var Crawler = require("crawler");
var csv = require('fast-csv');

var pagesToCrawl = 1000;

count = 0;

var isMovebubbleUrl = new RegExp(/^https:\/\/www\.movebubble\.com\//)


var csvStream = csv.createWriteStream({headers: true});
csvStream.pipe(process.stdout);

function writeCsv(obj) {
    csvStream.write(obj);
}

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
    
    page['indexed?'] = true;

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
            toQueueUrl = "https://www.movebubble.com" + toQueueUrl;
        }

        if(isMovebubbleUrl.test(toQueueUrl)) {
            c.queue(toQueueUrl);
        }
    });
}


var c = new Crawler({
    maxConnections : 10,
    skipDuplicates: true,
    // This will be called for each crawled page
    callback : function (error, result, $) {

        if(!isMovebubbleUrl.test(result.uri)) {
            return;
        }

        buildPageModel(result.uri, $);

        if(count < (pagesToCrawl)) {
            queueLinksFromThisPage($);
        }

        count++;
        process.stderr.write('processed ' + count + ' of ' + c.queueItemSize + "\r\n");

    },
    onDrain: function() {
        csvStream.end();
        process.exit();
    }
});

// Queue just one URL, with default callback
c.queue('https://www.movebubble.com');
