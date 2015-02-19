var robots = require('robots');
var url = require('url');
var parser = new robots.RobotsParser();

var robots =  "https://www.movebubble.com/robots.txt";
parser.setUrl(robots);

module.exports = function Robots(error, result, $, report) {
 	var uri = url.parse(result.uri);

    if(!parser.canFetchSync('', uri.pathname)) {
    	report.addMessage("INFO", "blocked from indexing by robots.txt");
    	report.setIndexable(false);
    } 

    var metaRobots = $('meta[name=robots]');

    if(!metaRobots) return;

	metaRobots = metaRobots.attr('content');
    
    if(!metaRobots) return;

	if(metaRobots.indexOf('nofollow') >= 0) {
		report.addMessage("INFO", "All links are nofollow due to meta robots tag.");
	}

	if(metaRobots.indexOf('noindex')  >= 0) {
		report.addMessage("INFO", "Blocked from indexing by meta robots tag.");
		report.setIndexable(false);
	}
}