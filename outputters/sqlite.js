var sqlite3 = require('sqlite3').verbose();


module.exports = function Sqlite(report) {
	var db = new sqlite3.Database('output/crawl.db');

	db.serialize(function() {	
		db.run("CREATE TABLE urls (url TEXT, indexed BIT)");
 		db.run("CREATE TABLE messages (url TEXT, category TEXT, level TEXT, message TEXT)");
 	
		var urlstmt = db.prepare("INSERT INTO urls VALUES (?, ?)");
		var stmt = db.prepare("INSERT INTO messages VALUES (?, ?, ?, ?)");
		
		for(var uri in report.uris) {
			var page = report.uris[uri];

			urlstmt.run(uri, page.indexable)

			for(var i = 0; i < page.messages.length; i++) {
				stmt.run(uri, page.messages[i].category, page.messages[i].level, page.messages[i].message);
			}
		}

		urlstmt.finalize();
		stmt.finalize();
	});

	db.close();
}
 