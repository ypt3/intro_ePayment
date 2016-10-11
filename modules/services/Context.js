var rekuire = require('rekuire');
var config = rekuire('local.js');

module.exports = {
    
    getContext: function getConnectSdk() {
        return {
            host: config.ingenico.host,
            protocol: 'https',
            port: 443,
            apiKeyId: config.ingenico.apiKeyId,
            secretApiKey: config.ingenico.secretApiKey
        };
    }

}