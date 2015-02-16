function Redirects(error, result, $, report) {
    var requestUri = result.options.uri;

    for(var i = 0; i < result.request.redirects.length; i++) {
    	var redirect = result.request.redirects[i];

    	var level = "ERROR";

    	if(redirect.statusCode == 301) {
    		level = "INFO";
    	}

        report.setAttribute(redirect.redirectUri, 'httpStatus', redirect.statusCode);

    	report.addMessage(level, "" + redirect.statusCode + " redirect to " + redirect.redirectUri, requestUri, redirect.redirectUri);
    	report.addMessage(level, requestUri + " does a " + redirect.statusCode + " redirect to here", null, requestUri);

        report.setAttribute(requestUri, 'httpStatus', redirect.statusCode);

    	requestUri = redirect.redirectUri;
    }

    report.setAttribute(requestUri, 'httpStatus', result.statusCode);
}

module.exports = Redirects;