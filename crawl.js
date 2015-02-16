
var SiteReport = require("./site_report");
var Crawler = require("crawler");
var url = require('url');
var fs = require('fs');

var STARTING_URL = "https://www.movebubble.com/sitemap";
var MAX_DEPTH = 2;

var allowedHost = url.parse(STARTING_URL).host;

console.log(allowedHost);

var processors = [];

var normalizedPath = require("path").join(__dirname, "validators");
fs.readdirSync(normalizedPath).forEach(function(file) {
	processors.push(require("./validators/" + file));
});

var outputters = [];
normalizedPath = require("path").join(__dirname, "outputters");
fs.readdirSync(normalizedPath).forEach(function(file) {
	if(file.indexOf('.js') >= 0){
		outputters.push(require("./outputters/" + file));
	}
});

function queueLinksOnPage(error, result, $) {

	if(result.options.priority >= MAX_DEPTH) return;

    $('a').each(function(index, a) {
    	var $a = $(a);

        var toQueueUrl = $a.attr('href');

        if (toQueueUrl && toQueueUrl[0] === '/') {
            toQueueUrl = url.resolve(result.uri, toQueueUrl);
        }

		queue(toQueueUrl, result.options.priority + 1)
    });
}

var queue = function() {
	var cache = {};

	return function queue(uri, depth) {
		if(!uri) return;

		var u = url.parse(uri);

		if(!u.host) return;
	    if(u.host.indexOf(allowedHost) < 0) return;
	    if(cache[uri]) return;

	    cache[uri] = true;

	    c.queue({
			uri: uri,
			priority: depth
		});
	}
}();

var siteReport = new SiteReport();

var c = new Crawler({
    maxConnections : 10,
    cache: true,
    skipDuplicates: true,

    callback : function (error, result, $) {
    	if(error) {
    		console.error(error);
    		return;    		
    	}

    	console.log(result.uri);

    	if(url.parse(result.uri).host.indexOf(allowedHost) >= 0) {
    		queueLinksOnPage(error, result, $);

	    	var report = siteReport.getPageReport(result.uri);

	    	if(!$) {
	    		console.error('jquery undefined on ' + result.uri)
	    	} else {
		    	for (var i = 0; i < processors.length; i++) {
		    		processors[i](error, result, $, report);
		    	}
	    	}
    	}

    	if (c.queueItemSize == 1) {
    		for(var i = 0; i < outputters.length; i++) {
		        outputters[i](siteReport);
    		}
    	}
    }
});

queue(STARTING_URL, 0);

