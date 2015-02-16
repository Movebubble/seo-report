var url = require('url');

function Url(error, result, $, report) {
    var address = result.uri;

    if(address.length > 115) {
        report.addMessage("ERROR", "URL longer than 115 characters");
    } else if(url.length > 75) {
        report.addMessage("WARN", "URL longer than 75 characters");
    }

    var addressObj = url.parse(address, true);

    if(!addressObj.query) {
    	return;
    }

    var queryParameters = Object.keys(addressObj.query).length;

    if(queryParameters > 0) {
    	report.addMessage("ERROR", "Url contains " + queryParameters + " query parameters.");
    }
}

module.exports = Url;