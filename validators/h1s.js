function H1(error, result, $, report) {
	var h1 = $('h1');

    if(h1.length <= 0) {
        report.addMessage('ERROR', 'No h1 tag');
    } else if (h1.length > 1) {
        report.addMessage('ERROR', '' + h1.length + ' h1 tags on page.')
    } else {
    	var text = h1.text();

    	if(text.length == 0) {
	        report.addMessage('ERROR', 'Empty h1 tag');
    	}
    }
}

module.exports = H1;