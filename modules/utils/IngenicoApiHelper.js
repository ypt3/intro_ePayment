var dateformat = require('dateformat');
var crypto = require('crypto');
var _ = require('lodash');

module.exports = {

    // Create request header
    createHeader: function createHeader(method, path, context) {
        var headers = {
            Date: generateDate(),
            'Content-Type': 'application/json',
            path: path
        };

        var extraHeaders = [];

        // Add extraheaders as defined on context
        if(context && context.extraHeaders) {
            for(var i=0; i < context.extraHeaders.length; i++) {
                var header = context.extraHeaders[i];
                headers[header.key] = _.trim(header.value.replace(/\r?\n[\\s&&[^\r\n]]*/g, " "));
                extraHeaders.push(header);
            }
        }

        // Add idempotence header if present on context
        if(context && context.idempotence) {
            var idempotenceHeader = {
                key: 'X-GCS-Idempotence-Key',
                value: context.idempotence
            }
            headers[idempotenceHeader.key] = idempotenceHeader.value;
            extraHeaders.push(idempotenceHeader);
        }

        // Add ServerMetaInfo header if present on context
        if (context && context.serverMetaInfo) {
            var serverMetaInfo = {
                key: 'X-GCS-ServerMetaInfo',
                value: generateServerMetaInfo(context.serverMetaInfo)
            };
            headers[serverMetaInfo.key] = serverMetaInfo.value;
            extraHeaders.push(serverMetaInfo);
        }

        // Generate signature as specified on:
        // https://developer.globalcollect.com/documentation/api/server/#api-authentication
        headers['Authorization'] = 'GCS v1HMAC:' + 
            context.apiKeyId + ':' +
            getSignature(context.secretApiKey, method, 'application/json', headers.Date, extraHeaders, path);

        return headers;
    }

}

function generateDate() {
    return dateformat('GMT:ddd, dd mmm yyyy HH:MM:ss') + ' GMT';
}

function generateServerMetaInfo(serverMetaInfo) {
    return new Buffer(JSON.stringify(serverMetaInfo)).toString('base64');
}

// Create actual signature
function getSignature(secretApiKey, method, contentType, date, extraHeaders, path) {
    return crypto.createHmac('SHA256', secretApiKey)
        .update(method + '\n' + contentType + '\n' + date + '\n' + sortHeaders(extraHeaders) + path + '\n')
        .digest('base64');
}

// Sort Ingenico (X-GCS) headers alphabetically
function sortHeaders(extraHeaders) {
    var headers = '';
    if(extraHeaders) {
        var sortedHeaders = [];
        _.each(extraHeaders, function(header){
            if(header.key.toUpperCase().indexOf('X-GCS') === 0) {
                sortedHeaders.push(header)
            }
        });
        sortedHeaders = sortedHeaders.sort(function(a, b){
            a.key = a.key.toUpperCase();
            b.key = b.key.toUpperCase();
            if (a.key < b.key) {
                return -1;
            } else if (a.key > b.key) {
                return 1;
            } else {
                return 0;
            }
        });
        _.each(sortedHeaders, function(header) {
            headers += header.key.toLowerCase() + ":" + header.value + "\n";
        });
    }
    return headers;
;}