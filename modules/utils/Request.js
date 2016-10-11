var rekuire = require('rekuire');
var https = require('https');
var helper = rekuire('IngenicoApiHelper');

module.exports = {

    // Send the actual request to ingenico's apis
    /*
        @context
            Contains: 
            - host (required)
            - port (required)
            - idempotence
            - serverMetaInfo
            - extraHeaders
        @method
            - HTTP Method to be used
        @path
            - Path to ingenico's api (e.g. /v1/id/payments)
        @requestBody
            - body of the request
        @callback(error, data)
            - function passed by the v2 paymentController
     */
    send: function send(context, method, path, requestBody, callback) {
        var options = {
            host: context.host,
            protocol: 'https:',
            port: context.port,
            method: method,
            headers: helper.createHeader(method, path, context),
            path: path
        };

        // Send the request through https
        var req = https.request(options, function(res){
            var body = '';
            res.setEncoding('utf8');
            
            // response is a stream
            res.on('data', function(chunk){
                body += chunk;
            });
            res.on('end', function(){
                // return the whole response
                return callback(null, {
                    status: res.statusCode,
                    body: JSON.parse(body),
                    headers: res.headers
                });
            });
        });

        // Return the error if an error occurred
        req.on('error', function(e){
            return callback(e);
        });

        // Transform the object the json string
        if(requestBody) {
            req.write(JSON.stringify(requestBody));
        }
        req.end();
    }

}