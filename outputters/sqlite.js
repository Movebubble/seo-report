var sqlite3 = require('sqlite3').verbose();
var csv = require('fast-csv');

module.exports = function Sqlite(report) {
	var db = new sqlite3.Database('output/crawl.db');

	db.serialize(function() {	
		db.run("CREATE TABLE urls (url TEXT, indexed BIT, httpStatus TEXT, title TEXT, h1 TEXT)");
 		db.run("CREATE TABLE messages (url TEXT, category TEXT, level TEXT, message TEXT)");
 	
		var urlstmt = db.prepare("INSERT INTO urls VALUES (?, ?, ?, ?, ?)");
		var stmt = db.prepare("INSERT INTO messages VALUES (?, ?, ?, ?)");
		
		for(var uri in report.uris) {
			var page = report.uris[uri];

			urlstmt.run(uri, page.indexable, page.httpStatus, page.title, page.h1);

			for(var i = 0; i < page.messages.length; i++) {
				stmt.run(uri, page.messages[i].category, page.messages[i].level, page.messages[i].message);
			}
		}

		urlstmt.finalize();
		stmt.finalize();

		db.run( "INSERT INTO messages (url, category, level, message)" + "\r\n" +
				"SELECT u.url, 'Duplicate Title', 'ERROR', 'Title: ''' || u.title || ''' was found on ' || count(*) || ' indexed pages'" + "\r\n" +
				"FROM urls u" + "\r\n" +
				"INNER JOIN urls ts" + "\r\n" +
				"ON ts.title = u.title" + "\r\n" +
				"WHERE u.indexed = 1" + "\r\n" +
				"AND ts.indexed = 1" + "\r\n" +
				"GROUP BY u.url, u.title" + "\r\n" +
				"HAVING COUNT(*) > 1" + "\r\n" +
				"ORDER BY u.title");

		db.run( "INSERT INTO messages (url, category, level, message)" + "\r\n" +
				"SELECT u.url, 'Duplicate H1', 'ERROR', 'H1: ''' || u.h1 || ''' was found on ' || count(*) || ' indexed pages'" + "\r\n" +
				"FROM urls u" + "\r\n" +
				"INNER JOIN urls ts" + "\r\n" +
				"ON ts.h1 = u.h1" + "\r\n" +
				"WHERE u.indexed = 1" + "\r\n" +
				"AND ts.indexed = 1" + "\r\n" +
				"GROUP BY u.url, u.h1" + "\r\n" +
				"HAVING COUNT(*) > 1" + "\r\n" +
				"ORDER BY u.h1");

		var csvStream = csv.createWriteStream({headers: true});

		var d = new Date();
		var file = 'seo-' + d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2) + '.csv';

	    writableStream = require('fs').createWriteStream("output/" + file);

		csvStream.pipe(writableStream);

		db.each("SELECT * FROM urls u INNER JOIN messages m ON u.url = m.url", function(err, row) {
	    	csvStream.write(row);
	  	},
        function (err, cntx) {
            csvStream.end();
        });
	});
		
	db.close();
}
 