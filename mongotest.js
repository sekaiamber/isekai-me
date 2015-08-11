var http = require('http');
var db = require('./model/dbContext');

db.initialize({
	server:"10.1.7.103",
	port:27017,
	database:"linyou",
	logHandler:function(log){
		console.log(log);
	},
	errorHandler:function(err){
		console.log(err);
	}
});
db.open();
http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write("<html><head></head><body>");
	res.write("<div>"+db.initialized+"</div>");
	res.write("<div>"+db.connectionInfo.server+"</div>");
	res.write("<div>"+db.connectionInfo.port+"</div>");
	res.write("<div>"+db.connectionInfo.database+"</div>");
	res.write("<div>==============</div>");
	for (var i = 0; i < db.collections.length; i++) {
		res.write("<div>"+db.collections[i].collectionName+"</div>");
	};
	res.write("<div>==============</div>");
	console.log("called.");
	// db.collections['test1'].insert([{
	// 	name : "test5",
	// 	index : 5,
	// 	author : "sekai"
	// }], {w:1}, function(err, result){
	// 	if (err) {console.log(err)};

	// });
	db.collections['test1'].findOne({index:2},function(err, doc){
		res.write("<div>"+doc.name+"</div>");
		res.end('</body></html>');
	});
}).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');