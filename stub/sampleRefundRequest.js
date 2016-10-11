var dateformat = require('dateformat');

module.exports = {
    getDateRefund: function getDateRefund() {
        return dateformat('yyyymmdd');
    },
    amount: {
        "currency": "EUR",
        "value": 1
    },
    body: {
        "amountOfMoney": {}, 
        "customer": {
            "contactDetails": {
            "emailAddress": "wile.e.coyote@acmelabs.com", 
            "emailMessageType": "html"
            }, 
            "address": {
            "name": {
                "surname": "Coyote"
            }, 
            "countryCode": "US"
            }
        }, 
        "refundReferences": {
            "merchantReference": "AcmeOrder0001"
        }
    }
}