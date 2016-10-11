var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var rekuire = require('rekuire');
var PaymentController = rekuire('PaymentController');
var PaymentViewController = rekuire('PaymentViewController');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');

// Pay
app.get('/v1', function(req, res){
    res.render('v1/pay', {});
});

app.get('/v2', function(req, res){
    res.render('v2/pay', {});
});

app.post('/v1/pay', function(req, res){
    PaymentViewController.pay(req, res);
});

app.post('/v2/pay', function(req, res){
    PaymentViewController.pay(req, res);
});

// Create payment
app.post('/payments/create', function(req, res){
    checkIfValidVersion(req, res);
    PaymentController.createPayment(req, res);
});

// Capturing authorized payments
app.post('/payments/capture/:paymentId', function(req, res){
    checkIfValidVersion(req, res);
    PaymentController.capturePayment(req, res);
});

// Get payment status
app.get('/payments/check/:paymentId', function(req, res){
    checkIfValidVersion(req, res);
    PaymentController.getPayment(req, res);
});

// Refund a captured payment
app.post('/payments/refund/:paymentId', function(req, res){
    checkIfValidVersion(req, res);
    PaymentController.refundPayment(req, res);
});

// Cancel payment
app.post('/payments/cancelPayment/:paymentId', function(req, res){
    checkIfValidVersion(req, res);
    PaymentController.cancelPayment(req, res);
});

// Cancel approval
app.post('/payments/cancelApproval/:paymentId', function(req, res){
    checkIfValidVersion(req, res);
    PaymentController.cancelApproval(req, res);
});

app.listen(8000, function(){
    console.log('Started payment app on port 8000');
});

function checkIfValidVersion(req, res) {
    if(req.headers.version && req.headers.version != '1' && req.headers.version != '2') {
        return res.status(400).send('Invalid version!');
    }
}
