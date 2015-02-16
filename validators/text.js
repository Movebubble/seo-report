var wordcount = require('wordcount');

function Text(error, result, $, report) {
	var p = $('p');

    var text = p.text();

    if (wordcount(text) < 100) {
        report.addMessage("WARN", "Only " + wordcount(text) + " words on the page.");
    }   
}

module.exports = Text;
