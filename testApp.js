var config = require('./config/local.js');
var connectSdk = require('connect-sdk-nodejs');
var async = require('async');

(function(){

    connectSdk.init({
        host: config.ingenico.host,
        scheme: 'https',
        port: 443,
        apiKeyId: config.ingenico.apiKeyId,
        secretApiKey: config.ingenico.secretApiKey
    });

    async.auto({
        createPayment: function(asyncCb) {
            createPayment(asyncCb);
        },
        tokenizePayment: ['createPayment', function(result, asyncCb){
            tokenizePayment(result, asyncCb);
        }],
        capturePayment: ['tokenizePayment', function(result, asyncCb){
            capturePayment(result, asyncCb);
        }]
    }, function(error, asyncResults){
        if(error) {
            console.log('AN ERROR HAS OCCURRED');
            console.log(JSON.stringify(error));
        } else {
            console.log('CAPTURING PAYMENT SUCCESSFUL');
        }
    });

})();

// Test if connection to global collect is okay and if credentials are properly setup
function testConnection() {
    connectSdk.services.testconnection(config.ingenico.merchantId, null, function (error, sdkResponse) {
        console.log(JSON.stringify(sdkResponse));
    });
}

// Check if card scheme is supported
function getIINdetails() {
    var body = { bin: '4567350000427977' };
    connectSdk.services.getIINdetails(config.ingenico.merchantId, body, null, function (error, sdkResponse) {
        console.log(JSON.stringify(sdkResponse));
    });
}

// Create an actual payment
function createPayment(callback) {
    var body = require('./stub/samplePaymentRequest.js').body;
    console.log('CREATING PAYMENT..');

    connectSdk.payments.create(config.ingenico.merchantId, body, null, function (error, sdkResponse) {
        console.log('CREATE RESPONSE: ' + JSON.stringify(sdkResponse));
        if(error || sdkResponse.status != '201') {
            return callback(error ? error : sdkResponse);
        }
        return callback(null, sdkResponse);
    });
}

// Tokenize payment, returned value would be used as parameter to capturing the paymet
function tokenizePayment(result, callback) {
    var paymentId = result.createPayment.body.payment.id;
    
    connectSdk.payments.tokenize(config.ingenico.merchantId, paymentId, { alias: 'some alias here' }, null, function (error, sdkResponse) {
        console.log('TOKENIZE RESPONSE: ' + JSON.stringify(sdkResponse));
        if(error || (sdkResponse.status != '201' && sdkResponse.status != '200')) {
            return callback(error ? error: sdkResponse);
        }
        return callback(null, sdkResponse);
    });
}

// Check status of payment
function getPayment() {
    connectSdk.payments.get(config.ingenico.merchantId, '000000238700000000010000100001', null, function (error, sdkResponse) {
        console.log(JSON.stringify(sdkResponse));
    });
}

// Capture payment
function capturePayment(result, callback) {
    console.log('CAPTURING PAYMENT..');

    var body = require('./stub/captureRequest.js').body;
    var paymentId = result.createPayment.body.payment.id;
    body.directDebitPaymentMethodSpecificInput.token = result.tokenizePayment.body.token;
    
    connectSdk.payments.approve(config.ingenico.merchantId, paymentId, body, null, function (error, sdkResponse) {
        console.log('CAPTURE RESPONSE: ' + JSON.stringify(sdkResponse));
        if(error) {
            return callback(error);
        }
        return callback(null, sdkResponse);
    });
}