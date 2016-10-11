var async = require('async');
var rekuire = require('rekuire');
var uuid = require('node-uuid');

var _PaymentControllerV1 = rekuire('_PaymentControllerV1');
var _PaymentControllerV2 = rekuire('_PaymentControllerV2');
var connectSdk = rekuire('ConnectSdk').getConnectSdk();
var context = rekuire('Context').getContext();

// async.auto reference: http://www.oodlestechnologies.com/blogs/Understanding-async.auto-in-node-js
module.exports = {

    createPayment: function(req, res) {
        // This will get which version of payment controller would be used
        var _paymentController = getPaymentController(req);
        
        // Create payment
        // This is where Authorization happens
        _paymentController.createPayment(function(error, result){
            if(error) {
                return res.status(error.status).send(error.body);
            }
            return res.status(result.status).send(result.body);
        });
    },

    capturePayment: function(req, res) {
        var _paymentController = getPaymentController(req);

        // tokenizePayment - returns a token for the payment details passed on create payment request
        // capturePayment - performed if no error occurred on the tokenizePayment function.
        async.auto({
            tokenizePayment: _paymentController.tokenizePayment.bind(_paymentController),
            capturePayment: ['tokenizePayment', _paymentController.capturePayment.bind(_paymentController)]
        }, function(error, asyncResults){
            if(error) {
                return res.status(error.status).send(error.body);
            }
            return res.status(asyncResults.capturePayment.status).send(asyncResults.capturePayment.body);
        });
    },

    getPayment: function(req, res) {
        var _paymentController = getPaymentController(req);

        // Retrieve payment details 
        _paymentController.getPayment(function(error, result){
            if(error) {
                return res.status(error.status).send(error.body);
            }
            return res.status(result.status).send(result.body);
        });
    },

    cancelPayment: function(req, res) {
        var _paymentController = getPaymentController(req);

        // Cancel an authorized payment
        _paymentController.cancelPayment(function(error, result){
            if(error) {
                return res.status(error.status).send(error.body);
            }
            return res.status(result.status).send(result.body);
        });
    },

    cancelApproval: function(req, res) {
        var _paymentController = getPaymentController(req);

        // Cancel a captured / approved payment
        _paymentController.cancelApproval(function(error, result){
            if(error) {
                return res.status(error.status).send(error.body);
            }
            return res.status(result.status).send(result.body);
        });
    },

    refundPayment: function(req, res) {
        var _paymentController = getPaymentController(req);

        // Refund a fully captured payment
        _paymentController.refundPayment(function(error, result){
            if(error) {
                return res.status(error.status).send(error.body);
            }
            return res.status(result.status).send(result.body);
        });
    },

};

function getPaymentController(req) {
    var version = req.headers.version ? req.headers.version : '1';
    var rrn = req.headers['request-reference-no'] ? req.headers['request-reference-no'] : uuid.v4();
    if(version == '1') {
        return new _PaymentControllerV1(req, rrn, connectSdk);
    } else {
        return new _PaymentControllerV2(req, rrn, context);
    }

}