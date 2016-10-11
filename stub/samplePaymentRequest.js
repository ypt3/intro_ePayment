module.exports = {
    card: {
        "cvv": "123",
        "cardholderName": "Wile E. Coyote",
        "cardNumber": "4567350000427977",
        "expiryMonth": "12",
        "expiryYear": "20"
    },
    amount: {
        "currency": "EUR",
        "value": 3000
    },
    body: {
        "cardPaymentMethodSpecificInput": {
            "paymentProductId": 1,
            "skipAuthentication": false,
            "card": {}
        },
        "order": {
            "amountOfMoney": {},
            "customer": {
                "shippingAddress": {
                    "additionalInfo": "Suite II",
                    "name": {
                        "surname": "Runner",
                        "firstName": "Road",
                        "title": "Miss"
                    },
                    "zip": "84536",
                    "city": "Monument Valley",
                    "countryCode": "US",
                    "state": "Utah",
                    "street": "Desertroad",
                    "houseNumber": "1"
                },
                "locale": "en_US",
                "vatNumber": "1234AB5678CD",
                "contactDetails": {
                    "phoneNumber": "+1234567890",
                    "emailAddress": "wile.e.coyote@acmelabs.com",
                    "emailMessageType": "html",
                    "faxNumber": "+1234567891"
                },
                "billingAddress": {
                    "additionalInfo": "b",
                    "countryCode": "US",
                    "zip": "84536",
                    "city": "Monument Valley",
                    "state": "Utah",
                    "street": "Desertroad",
                    "houseNumber": "13"
                },
                "personalInformation": {
                    "name": {
                        "surnamePrefix": "E.",
                        "surname": "Coyote",
                        "firstName": "Wile",
                        "title": "Mr."
                    },
                    "dateOfBirth": "19490917"
                },
                "companyInformation": {
                    "name": "Acme Labs"
                },
                "merchantCustomerId": "1234"
            }
        }
    }
}