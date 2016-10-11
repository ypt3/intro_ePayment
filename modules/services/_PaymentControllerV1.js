var rekuire = require('rekuire');
var ingenico = rekuire('local.js').ingenico;
var logger = rekuire('Logger');
var uuid = require('node-uuid');
var utils = rekuire('ServiceUtils');

function _PaymentController(req, rrn, connectSdk) {
    this.params = req.params;
    this.query = req.query;
    this.body = req.body;
    this.headers = req.headers;
    this.rrn = rrn;
    this.connectSdk = connectSdk;
}

/*
    @callback(error, data)  
        - Function passed by the _paymentController.createPayment
        - Returning an error would prevent next function to be executed (in case async.auto is used)
 */
_PaymentController.prototype.createPayment = function createPayment(callback){
    var service = 'CREATE';
    // Build payment request
    // Will substitute values on the sample create request with the ones on the request body
    var createPaymentRequest = utils.buildPaymentRequest(this.headers['content-type'], this.body);
    var rrn = this.rrn;
    
    // This would prevent multiple authorization of the same request
    // If no Request-Reference-No is provided on the header, rrn would be a generated uuid
    var options = {
        idemPotence: {
            key: rrn 
        }
    };

    logger.logRequest(rrn, service, createPaymentRequest);

    // Call ingenico's create api
    // Actual authorization happens
    this.connectSdk.payments.create(ingenico.merchantId, createPaymentRequest, options, function(error, response){
        logger.logResponse(rrn, service, response);
        if(error || response.status !=  '201') {
            var errorResponse = {
                body: error ? error : response.body,
                status: error ? 400 : response.status
            };
            return callback(errorResponse);
        }
        return callback(null, response);
    });
}

/*
    @callback(error, data)  
        - Function passed by the _paymentController.tokenizePayment
        - Returning an error would prevent next function to be executed (in case async.auto is used)
    @result
        - Return values of the previous functions in async.auto
 */
_PaymentController.prototype.tokenizePayment = function tokenizePayment(callback, result) {
    var service = 'TOKENIZE';
    var paymentId = this.params.paymentId || result.createPayment.body.payment.id ;
    var rrn = this.rrn;
    var tokenizeRequest = { alias: rrn };

    logger.logRequest(rrn, service, tokenizeRequest);

    // Call ingenico's tokenize api
    // This would tokenize the card details on the payment request.
    // Token is to be sent as part of the request body when capturing payment 
    this.connectSdk.payments.tokenize(ingenico.merchantId, paymentId, tokenizeRequest, null, function(error, response){
        logger.logResponse(rrn, service, response);
        if(error || (response.status != '200' && response.status != '201')) {
            var errorResponse = {
                body: error ? error : response.body,
                status: error ? 400 : response.status
            };
            return callback(errorResponse);
        }
        return callback(null, response);
    });
}

/*
    @callback(error, data)  
        - Function passed by the _paymentController.capturePayment
        - Returning an error would prevent next function to be executed (in case async.auto is used)
    @result
        - Return values of the previous functions in async.auto
 */
_PaymentController.prototype.capturePayment = function capturePayment(result, callback) {
    var service = 'CAPTURE';
    var captureRequest = utils.buildCaptureRequest(this.headers['content-type'], this.body, result);
    var paymentId = this.params.paymentId || result.createPayment.body.payment.id;
    var rrn = this.rrn;
    
    logger.logRequest(rrn, service, captureRequest);

    // Call ingenico's approve / capture api
    // Payment will now be sent to a 3rd party (Payment Processor / Acquirer)
    this.connectSdk.payments.approve(ingenico.merchantId, paymentId, captureRequest, null, function(error, response){
        logger.logResponse(rrn, service, response);
        if(error || response.status != '200') {
            var errorResponse = {
                body: error ? error : response.body,
                status: error ? 400 : response.status
            };
            return callback(errorResponse);
        }
        return callback(null, response);
    });
}

/*
    @callback(error, data)(error, data)  
        - Function passed by the _paymentController.getPayment
        - Returning an error would prevent next function to be executed (in case async.auto is used)
 */
_PaymentController.prototype.getPayment = function getPayment(callback) {
    var service = 'GET';
    var paymentId = this.params.paymentId;
    var rrn = this.rrn;

    logger.logRequest(rrn, service, { paymentId: paymentId });

    // Call ingenico's get api
    // This would retrieve payment details
    this.connectSdk.payments.get(ingenico.merchantId, paymentId, null, function(error, response){
        logger.logResponse(rrn, service, response);
        if(error || response.status != '200') {
            var errorResponse = {
                body: error ? error : response.body,
                status: error ? 400 : response.status
            };
            return callback(errorResponse);
        }
        return callback(null, response);
    });
}

/*
    @callback(error, data)  
        - Function passed by the _paymentController.createPayment
        - Returning an error would prevent next function to be executed (in case async.auto is used)
 */
_PaymentController.prototype.cancelPayment = function cancelPayment(callback) {
    var service = 'CANCELPAYMENT';
    var paymentId = this.params.paymentId;
    var rrn = this.rrn;

    logger.logRequest(rrn, service, { paymentId: paymentId });

    // Call ingenico's cancel payment api
    // This would cancel an Authorized payment
    this.connectSdk.payments.cancel(ingenico.merchantId, paymentId, null, function(error, response){
        logger.logResponse(rrn, service, response);
        if(error || response.status != '200') {
            var errorResponse = {
                body: error ? error : response.body,
                status: error ? 400 : response.status
            };
            return callback(errorResponse);
        }
        return callback(null, response);
    });
}

/*
    @callback(error, data)  
        - Function passed by the _paymentController.createPayment
        - Returning an error would prevent next function to be executed (in case async.auto is used)
 */
_PaymentController.prototype.cancelApproval = function cancelApproval(callback) {
    var service = 'CANCELAPPROVAL';
    var paymentId = this.params.paymentId;
    var rrn = this.rrn;

    logger.logRequest(rrn, service, { paymentId: paymentId });

    // Call ingenico's cancel approval api
    // This would cancel a captured payment
    this.connectSdk.payments.cancelapproval(ingenico.merchantId, paymentId, null, function(error, response){
        logger.logResponse(rrn, service, response);
        if(error || response.status != '200') {
            var errorResponse = {
                body: error ? error : response.body,
                status: error ? 400 : response.status
            };
            return callback(errorResponse);
        }
        return callback(null, response);
    });
},

/*
    @callback(error, data)  
        - Function passed by the _paymentController.createPayment
        - Returning an error would prevent next function to be executed (in case async.auto is used)
 */

_PaymentController.prototype.refundPayment = function refundPayment(callback) {
    var service = 'REFUND';
    var refundRequest = utils.buildRefundRequest(this.headers['content-type'], this.body);
    var paymentId = this.params.paymentId;
    var rrn = this.rrn;
    
    console.log(this.body.amount);
    // refundRequest.amountOfMoney.currencyCode = this.body.amount.currency;
    // refundRequest.amountOfMoney.amount = this.body.amount.value;

    logger.logRequest(rrn, service, refundRequest);
    // Call ingenico's refund api
    // Only payments that are fully captured would be eligible for refund
    this.connectSdk.payments.refund(ingenico.merchantId, paymentId, refundRequest, null, function(error, response){
        logger.logResponse(rrn, service, response);
        if(error || response.status != '200') {
            var errorResponse = {
                body: error ? error : response.body,
                status: error ? 400 : response.status
            };
            return callback(errorResponse);
        }
        return callback(null, response);
    });
}

module.exports = _PaymentController;