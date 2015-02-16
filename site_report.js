function PageReport(uri, site) {
	this.uri = uri;
	this.messages = [];
	this._siteReport = site;
	this.indexable = true;
	this.errors = 0;
	this.warnings = 0;
}

PageReport.prototype.addMessage = function(level, message, uri, linkedUri) {
	if(uri) {
		this._siteReport.getPageReport(uri).addMessage(level, message, null, linkedUri);
	} else {
		this.messages.push({ category: arguments.callee.caller.name, level: level, message: message, linkedUri: linkedUri });

		if(level == "WARN") {
			this.warnings++;
			this._siteReport.warnings++;
		}

		if(level == "ERROR") {
			this.errors++;
			this._siteReport.errors++;
		}
	}
};

PageReport.prototype.setIndexable = function(isIndexable) {
	if(this.indexable == isIndexable) return;

	this.indexable = isIndexable

	if(isIndexable) {
		this._siteReport.indexedUriCount++;
	} else {
		this._siteReport.indexedUriCount--;
	}
	
};

function SiteReport() {	
	this.uris = {};	
	this.errors = 0;
	this.warnings = 0;
	this.uriCount = 0;
	this.indexedUriCount = 0;
}

SiteReport.prototype.getPageReport = function(uri) {
	if(this.uris[uri]) {
		return this.uris[uri];
	}

	this.uris[uri] = new PageReport(uri, this);
	this.uriCount++;
	this.indexedUriCount++;

	return this.uris[uri];
}

SiteReport.prototype.toTextReport = function() {
	var report = "";

	for(var uri in this.uris) {
		var page = this.uris[uri];

		report += page.uri + "\r\n";

		for(var i = 0; i < page.messages.length; i++) {
			var message = page.messages[i];
			report += "    " + message.level + " - " + message.message + "\r\n";
		}
	}

	return report;
}

module.exports = SiteReport;