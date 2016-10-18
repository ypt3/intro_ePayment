var rekuire = require('rekuire');
var ingenico = rekuire('local.js').ingenico;
var logger = rekuire('Logger');
var uuid = require('node-uuid');
var request = rekuire('Request');
var utils = rekuire('ServiceUtils');

function _PaymentController(req, rrn, context) {
    this.params = req.params;
    this.query = req.query;
    this.body = req.body;
    this.headers = req.headers;
    this.rrn = rrn; 
    this.headers = req.headers;
    this.context = context;
}

/*
    @callback(error, data)
        - Function passed by the _paymentController.createPayment
        - Returning an error would prevent next function to be executed (in case async.auto is used)
 */
_PaymentController.prototype.createPayment = function createPayment(callback){
    var service = 'CREATE';
    var context = this.context;
    var createPaymentRequest = utils.buildPaymentRequest(this.headers['content-type'], this.body);
    var rrn = this.rrn;

    // This would prevent multiple authorization of the same request
    context.idempotence = rrn;

    var path = '/v1/' + ingenico.merchantId + '/payments';
    logger.logRequest(rrn, service, createPaymentRequest);

    // Send a POST request to the @path specified
    request.send(context, 'POST', path, createPaymentRequest, function(error, response){
        logger.logResponse(rrn, service, response);
        if(error || response.status != '201') {
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
        - Function passed by the _paymentController.tokenizePayment
        - Returning an error would prevent next function to be executed (in case async.auto is used)
    @result
        - Return values of the previous functions in async.auto
 */
_PaymentController.prototype.tokenizePayment = function tokenizePayment(callback, result) {
    var service = 'TOKENIZE';
    var paymentId = this.params.paymentId || result.createPayment.body.payment.id ;
    var context = this.context;
    var rrn = this.rrn;
    var tokenizeRequest = { alias: rrn };

    var path = '/v1/' + ingenico.merchantId + '/payments/' + paymentId + '/tokenize';
    logger.logRequest(rrn, service, tokenizeRequest);

    // Send a POST request to the @path specified
    request.send(context, 'POST', path, tokenizeRequest, function(error, response){
        logger.logResponse(rrn, service, response);
        if(error || (response.status != '201' && response.status != '200')) {
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
    var context = this.context;
    var rrn = this.rrn;

    var path = '/v1/' + ingenico.merchantId + '/payments/' + paymentId + '/approve';
    logger.logRequest(rrn, service, captureRequest);

    // Send a POST request to the @path specified
    request.send(context, 'POST', path, captureRequest, function(error, response){
        logger.logResponse(rrn, service, response);
        if(error || response.status != '201') {
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
        - Function passed by the _paymentController.getPayment
        - Returning an error would prevent next function to be executed (in case async.auto is used)
 */
_PaymentController.prototype.getPayment = function getPayment(callback) {
    var service = 'GET';
    var paymentId = this.params.paymentId;
    var context = this.context;
    var rrn = this.rrn;

    var path = '/v1/' + ingenico.merchantId + '/payments/' + paymentId;
    logger.logRequest(rrn, service, { paymentId: paymentId });

    // Send a GET request to the @path specified
    request.send(context, 'GET', path, null, function(error, response){
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
        - Function passed by the _paymentController.cancelPayment
        - Returning an error would prevent next function to be executed (in case async.auto is used)
 */
_PaymentController.prototype.cancelPayment = function cancelPayment(callback) {
    var service = 'CANCELPAYMENT';
    var paymentId = this.params.paymentId;
    var context = this.context;
    var rrn = this.rrn;

    var path = '/v1/' + ingenico.merchantId + '/payments/' + paymentId + '/cancel';
    logger.logRequest(rrn, service, { paymentId: paymentId });

     // Send a POST request to the @path specified
    request.send(context, 'POST', path, null, function(error, response){
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
        - Function passed by the _paymentController.cancelApproval
        - Returning an error would prevent next function to be executed (in case async.auto is used)
 */
_PaymentController.prototype.cancelApproval = function cancelApproval(callback) {
    var service = 'CANCELAPPROVAL';
    var paymentId = this.params.paymentId;
    var context = this.context;
    var rrn = this.rrn;

    var path = '/v1/' + ingenico.merchantId + '/payments/' + paymentId + '/cancelapproval';
    logger.logRequest(rrn, service, { paymentId: paymentId });

     // Send a POST request to the @path specified
    request.send(context, 'POST', path, null, function(error, response){
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
        - Function passed by the _paymentController.refundPayment
        - Returning an error would prevent next function to be executed (in case async.auto is used)
 */
_PaymentController.prototype.refundPayment = function refundPayment(callback) {
    var service = 'REFUND';
    var refundRequest = utils.buildRefundRequest(this.headers['content-type'], this.body);
    var paymentId = this.params.paymentId;
    var context = this.context;
    var rrn = this.rrn;

    var path = '/v1/' + ingenico.merchantId + '/payments/' + paymentId + '/refund';
    logger.logRequest(rrn, service, refundRequest);

    // Send a POST request to the @path specified
    request.send(context, 'POST', path, refundRequest, function(error, response){
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
