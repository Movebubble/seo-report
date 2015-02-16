var Handlebars = require('handlebars');
var fs = require('fs');

module.exports = function fullReport(report) {
	var templatePath = require("path").join(__dirname, "template.handlebars");

	var source = "" + fs.readFileSync(templatePath);
	var template = Handlebars.compile(source);
	fs.writeFileSync('output/report.html', template(report));
}