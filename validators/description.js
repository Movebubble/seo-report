module.exports = function MetaDescription(error, result, $, report) {
    var desc = $('meta[name=description]');

    if(desc.length <= 0) {
        report.addMessage('ERROR', 'No meta description tag');
    } else {
    	var text = desc.attr('content');

    	if(text.length == 0) {
	        report.addMessage('ERROR', 'Empty meta description tag');
    	} else if(text.length < 20) {
	        report.addMessage('WARN', 'Meta description tag too short');
    	} else if(text.length > 155) {
	        report.addMessage('WARN', 'Meta description tag too long');
    	}
    }
}