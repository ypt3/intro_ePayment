var async = require('async');
var rekuire = require('rekuire');
var uuid = require('node-uuid');

var _PaymentControllerV1 = rekuire('_PaymentControllerV1');
var _PaymentControllerV2 = rekuire('_PaymentControllerV2');
var connectSdk = rekuire('ConnectSdk').getConnectSdk();
var context = rekuire('Context').getContext();

        // async.auto reference: http://www.oodlestechnologies.com/blogs/Understanding-async.auto-in-node-js
module.exports = {

    pay: function(req, res) {
        // This will get which version of payment controller would be used
        var _paymentController = getPaymentController(req);
        
        async.auto({
            createPayment: _paymentController.createPayment.bind(_paymentController),
            tokenizePayment: ['createPayment', function(result, asyncCb){
                var tokenizePayment = _paymentController.tokenizePayment.bind(_paymentController);
                tokenizePayment(asyncCb, result);
            }],
            capturePayment: ['tokenizePayment', function(result, asyncCb){
                var capturePayment = _paymentController.capturePayment.bind(_paymentController);
                capturePayment(result, asyncCb);
            }]
        }, function(error, asyncResults){
            if(error) {
                return res.status(error.status).send(error.body);
            }
            var capturePayment = asyncResults.capturePayment.body;

            return res.render('paymentDetails', {
                paymentId: capturePayment.payment.id,
                paymentStatus: capturePayment.payment.status,
                currency: capturePayment.payment.paymentOutput.amountOfMoney.currencyCode,
                value: capturePayment.payment.paymentOutput.amountOfMoney.amount,
                cardNumber: capturePayment.payment.paymentOutput.cardPaymentMethodSpecificOutput.card.cardNumber,
                expiryDate: capturePayment.payment.paymentOutput.cardPaymentMethodSpecificOutput.card.expiryDate,
                cvv: '***'
            });
        });
    }

};

function getPaymentController(req) {
    // set default version to 1
    var version = '1';

    if(req.path.split('/')[1] == 'v2') {
        version = '2';
    }
    var rrn = req.headers['request-reference-no'] ? req.headers['request-reference-no'] : uuid.v4();

    if(version == '1') {
        return new _PaymentControllerV1(req, rrn, connectSdk);
    } else {
        return new _PaymentControllerV2(req, rrn, context);
    }

}