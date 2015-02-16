function H2(error, result, $, report) {
	var h2 = $('h2');

    if(h2.length <= 0) {
        report.addMessage('ERROR', 'No h2 tag');
    } else {
    	var text = h2.text();

    	if(text.length == 0) {
	        report.addMessage('ERROR', 'Empty h2 tag');
    	}
    }
}

module.exports = H2;