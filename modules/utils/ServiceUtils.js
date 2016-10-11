var rekuire = require('rekuire');
var samplePaymentRequest = rekuire('samplePaymentRequest'); 
var sampleCaptureRequest = rekuire('sampleCaptureRequest');
var sampleRefundRequest = rekuire('sampleRefundRequest');

module.exports = {

    // Edits ingenico's sample create payment request on:
    // https://developer.globalcollect.com/documentation/api/server/#payments
    buildPaymentRequest: function buildPaymentRequest(contentType, body) {
        var createPaymentRequest = samplePaymentRequest.body;
        
        // Sets up the default card details & amount
        var defaultCard = samplePaymentRequest.card;
        var defaultAmount = samplePaymentRequest.amount;
        var card = {};
        var amount = {};

        // Get contents from request
        if(contentType == 'application/json') {
            card = body.card;
            amount = body.amount;
        } else if (contentType == 'application/x-www-form-urlencoded') {
            card = {
                cardholderName: body.cardholderName,
                cardNumber: body.cardNumber,
                cvv: body.cvv,
                expiryMonth: body.expDate.substring(0,2),
                expiryYear: body.expDate.substring(5,7)
            };
            amount = {
                currency: body.currency,
                value: body.value
            };
        }

        // Add card and amount details on request
        createPaymentRequest.cardPaymentMethodSpecificInput.card.cvv = card.cvv || defaultCard.cvv;
        if(card.cardholderName) {
            createPaymentRequest.cardPaymentMethodSpecificInput.card.cardholderName = card.cardholderName || defaultCard.cardholderName;
        }
        createPaymentRequest.cardPaymentMethodSpecificInput.card.cardNumber = card.cardNumber || defaultCard.cardNumber;
        createPaymentRequest.cardPaymentMethodSpecificInput.card.expiryDate = card.expiryMonth + card.expiryYear || defaultCard.expiryMonth + defaultCard.expiryYear;

        createPaymentRequest.order.amountOfMoney.currencyCode = amount.currency || defaultAmount.currency;
        createPaymentRequest.order.amountOfMoney.amount = Number(amount.value) || defaultAmount.value;

        return createPaymentRequest;
    },

    // Edits ingenico's sample create payment request on:
    // https://developer.globalcollect.com/documentation/api/server/#__merchantId__payments__paymentId__approve_post
    buildCaptureRequest: function buildCaptureRequest(contentType, body, result) {
        var createCaptureRequest = sampleCaptureRequest.body;
        
        // Sets token equal to the generated token on the tokenize function
        createCaptureRequest.directDebitPaymentMethodSpecificInput.token = result.tokenizePayment.body.token;
        
        // Sets dateCollect to date now (format is YYYYMMDD)
        createCaptureRequest.directDebitPaymentMethodSpecificInput.dateCollect = sampleCaptureRequest.getDateCollect();

        // You can add additional capture request details here
        if(body.amount) {
            createCaptureRequest.amount = result.createPayment ?
                result.createPayment.body.payment.paymentOutput.amountOfMoney.amount : body.amount;
        }

        return createCaptureRequest;
    },

    // Edits ingenico's sample create payment request on:
    // https://developer.globalcollect.com/documentation/api/server/#__merchantId__payments__paymentId__refund_post
    buildRefundRequest: function buildRefundRequest(contentType, body) {
        var refundRequest = sampleRefundRequest.body;
        var defaultAmount = sampleRefundRequest.amount;

        // Sets amount equal to the request body (if present) or the default values (if body is not present)
        refundRequest.amountOfMoney.amount = Number(body.amount.value) || Number(defaultAmount.value);
        refundRequest.amountOfMoney.currencyCode = body.amount.currency || defaultAmount.currency;
        
        // Sets refundDate to date now (format is YYYYMMDD)
        refundRequest.refundDate = sampleRefundRequest.getDateRefund();

        return refundRequest;
    }

};