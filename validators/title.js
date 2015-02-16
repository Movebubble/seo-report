function Title(error, result, $, report) {
	var title = $('title');

    if(title.length <= 0) {
        report.addMessage('ERROR', 'No title tag');
    } else {
    	var text = title.text();

    	if(text.length == 0) {
	        report.addMessage('ERROR', 'Empty title tag');
    	} else if(text.length < 20) {
	        report.addMessage('WARN', 'Title tag too short');
    	} else if(text.length > 70) {
	        report.addMessage('WARN', 'Title tag too long');
    	}
    }
}

module.exports = Title;