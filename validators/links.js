var url = require('url');

module.exports = function Links(error, result, $, report) {
	var links = $('a');

	var internal = 0, external = 0;

	links.each(function(index, a) {
		var href = $(a).attr('href');

		if(!href) return;

		var resolvedUrl = url.parse(href);

		if(!resolvedUrl.host ) {
			resolvedUrl = url.resolve(result.uri, href);
		}

		if (resolvedUrl.host == result.uri.host) {
			internal++;
		} else {
			external++;
		}
	});

	if(internal > 100) {
		report.addMessage("WARN", internal + " internal links on page");
	}

	if(external > 20) {
		report.addMessage("WARN", external + " external links on page");
	}
}