# SIMPLE-PAYMENT-INTRO
- git clone https://github.com/ypt3/intro_ePayment.git
- then run node server.js

## Endpoints

#### Pay (POST, /version/pay)
This performs a whole payment process from create to capture
- Create payment
- Tokenize payment
- Capture payment

An endpoint with a UI is also available
- Version 1 (/v1)
- Version 2 (/v2)

_*Not all fields are present in the UI_

```json
{
    "amount": {
        "currency": "EUR",
        "value": 2500
    },
    "card": {
        "cardholderName": "Wile E. Coyote",
        "cardNumber": "4567350000427977",
        "expiryMonth": "12",
        "expiryYear": "20",
        "cvv": "123"
    }
}
```

#### Create Payment (POST, /payments/create)
Initiate a payment by posting all the required payment details
```json
{
    "amount": {
        "currency": "EUR",
        "value": 2500
    },
    "card": {
        "cardholderName": "Wile E. Coyote",
        "cardNumber": "4567350000427977",
        "expiryMonth": "12",
        "expiryYear": "20",
        "cvv": "123"
    }
}
```

##### Capture Payment (POST, /payments/capture/:paymentId)
This will make the transaction eligible to be captured. Depending on the payment product and the 3rd party used to process the payment this might be done in real-time or in more off-line batch like fashion.
```json
{
    "amount": 1000
}
```

##### Get Payment Status (GET, /payments/check/:paymentId)
Retrieves the details of a payment that has previously been created by suppling the unique paymentId that was returned to you with the create payment request.
```
GET /payments/check/000000238700000001300000100001
```

##### Refund Payment (POST, /payments/refund/:paymentId)
Refunds any transaction.
```json
{
    "amount": {
        "currency": "EUR",
        "value": 10
    }
}
```

##### Cancel Payment (POST, /payments/cancelPayment/:paymentId)
This makes it impossible to process the payment any further and will also try to reverse an authorization on a card.
```
POST /payments/cancelPayment/000000238700000001300000100001
```

##### Cancel Approval (POST, /payments/cancelApproval/:paymentId)
Cancels the capture request made for the payment transaction.
```
POST /payments/cancelApproval/000000238700000001300000100001
```

**_If request body is missing, it will provide default values based on ingenico's sample requests_**

---
### Versions

##### Version 1
Makes use of ingenico's connect-sdk.

##### Version 2
Consumes ingenico's payment API without using the connect-sdk
