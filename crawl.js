var Crawler = require("crawler");
var csv = require('fast-csv');

var maxDepth = 2;
var currentDepth = 0;

count = 0;

var isMovebubbleUrl = new RegExp(/^https:\/\/dev\.movebubble\.com\//)


var csvStream = csv.createWriteStream({headers: true});
csvStream.pipe(process.stdout);

function writeCsv(obj) {
    csvStream.write(obj);
}

var pages = [];
var dups = {};

for(var i = 0; i <= maxDepth; i++) {
    pages.push([]);
}

pages[0].push('https://dev.movebubble.com');

var headers = ['url', 
    'url length', 
    'indexed?', 
    'title', 
    'title length', 
    'description', 
    'description length', 
    'h1 count', 
    'h1', 
    'h1 length'];

function buildPageModel(uri, $) {
    if(/noindex/.test($('meta[name=robots]').attr('content'))) {
        return;
    }

    var page = {};

    page['url'] = uri;
    page['url length'] = uri.length;
    
    page['depth'] = currentDepth;

    var title = $('title');

    page['title'] = null;
    page['title length'] = 0;

    if(title.length > 0) {
        page['title'] = title.text();
        page['title length'] = title.text().length;
    }

    var desc = $('meta[name=description]');

    page['description'] = null;
    page['description length'] = 0;

    if(desc.length > 0) {
        page['description'] = desc.attr('content');
        page['description length'] = desc.attr('content').length;
    }
    
    page['h1 count'] = $('h1').length;
    page['h1'] = null
    page['h1 length'] = 0;

    if($('h1').length > 0) {
        page['h1'] = $($('h1')[0]).text();
        page['h1 length'] = $($('h1')[0]).text().length;        
    }

    writeCsv(page);
} 

function queueLinksFromThisPage($) {
    $('a').each(function(index, a) {

        if($(a).attr('nofollow') != null){
            return;
        }

        var toQueueUrl = $(a).attr('href');

        if (toQueueUrl && toQueueUrl[0] === '/') {
            toQueueUrl = "https://dev.movebubble.com" + toQueueUrl;
        }

        if(isMovebubbleUrl.test(toQueueUrl)) {
            
            if(dups[toQueueUrl]){
                return;
            }

            dups[toQueueUrl] = true;
            if(pages[currentDepth + 1]) {
                pages[currentDepth + 1].push(toQueueUrl)
            }
        }
    });
}


var c = new Crawler({
    maxConnections : 10,

    callback : function (error, result, $) {

        count++;
        process.stderr.write('processing ' + count + ' of ' + pages[currentDepth].length + " at depth " + currentDepth + "\r\n");

        if(isMovebubbleUrl.test(result.uri)) {
            buildPageModel(result.uri, $);
            queueLinksFromThisPage($);
        }
       
        if(count == pages[currentDepth].length) {
            process.stderr.write('processed ' + pages[currentDepth].length + ' pages at depth ' + currentDepth + "\r\n");
            if(currentDepth < maxDepth) {
                currentDepth++;
                count = 0;
                process.stderr.write('queueing ' + pages[currentDepth].length + ' pages at depth ' + currentDepth + "\r\n");
                c.queue(pages[currentDepth]);
            }
        }
    },

    onDrain: function() {
        csvStream.end();
        process.exit();            
    }
});

// Queue just one URL, with default callback
c.queue(pages[0]);
