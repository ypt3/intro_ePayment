var dateformat = require('dateformat');

module.exports = {
    getDateCollect: function getDateCollect() {
        return dateformat('yyyymmdd');
    },
    body: {
        "directDebitPaymentMethodSpecificInput": {}
    }
}

