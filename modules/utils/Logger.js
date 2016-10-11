module.exports = {

    logRequest: function(rrn, service, body) {
        console.log('[' + rrn + '] ' + service + 'REQUEST: ' + JSON.stringify(body));
    },

    logResponse: function(rrn, service, body) {
        console.log('[' + rrn + '] ' + service + 'RESPONSE: ' + JSON.stringify(body));
    }
    
}