var rekuire = require('rekuire');
var config = rekuire('local.js');
var connectSdk = require('connect-sdk-nodejs');

(function(){
    connectSdk.init({
        host: config.ingenico.host,
        scheme: 'https',
        port: 443,
        apiKeyId: config.ingenico.apiKeyId,
        secretApiKey: config.ingenico.secretApiKey
    });
})();

module.exports = {
    
    getConnectSdk: function getConnectSdk() {
        return connectSdk;
    }

}