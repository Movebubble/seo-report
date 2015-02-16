var url = require('url');

module.exports = function Canonical(error, result, $, report) {
	var link = $('link[rel=canonical]');

	if(link.length <= 0) return;

	var canonical = url.resolve(result.uri, link.attr('href'));

	if(canonical == result.uri) return;

	report.addMessage("INFO", "The canonical version of this page is at " + canonical);
	report.addMessage("INFO", "This is the canonical page for " + result.uri, canonical);
}