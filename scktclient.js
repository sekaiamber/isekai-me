/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-10-26
 * Time: 下午3:56
 * To change this template use File | Settings | File Templates.
 */

var net = require('net');
var port = 7003;
var host = '127.0.0.1';
var config = require('./config.js');

　var http = require('http');
var webserver =　　http.createServer(function (req, res) {
　　  res.writeHead(200, {'Content-Type': 'text/plain'});
 　　 res.end('Hello World\n');
　　});

// 启动服务器
net.createServer(function(socket) {
	// socket.pause();
	// var worker = workers.shift();
	// try{
	// 	worker.process.send('c', socket);
	// 	workers.push(worker);
	// } catch(err) {
	// 	utility.Log("Master", utility.ENUM_MSG_TYPE.error, 'Catch error:' + err.message);
	// 	if (err.message == 'channel closed') {
	// 		for (var i = 0; i < workers.length; i++) {
	// 			var msg = "<worker " + worker.sign + "> down, ";
	// 			worker = createWorker();
	// 			msg += "<worker " + worker.sign + "> raise.";
	// 			worker.process.send('c', socket);
	// 			workers.push(worker);
	// 		};
	// 	};
	// };
	// // worker.process.kill();
	console.log("1");
	client.write(socket);
}).listen(config.PORT, config.IP);


var client= new net.Socket();
client.setEncoding('binary');
//连接到服务端
client.connect(port,host,function(){

    client.write('hello my client');

});

client.on('data',function(data){
    console.log('recv data:'+ data);

});
client.on('error',function(error){

    console.log('error:'+error);
    client.destory();

});
client.on('close',function(){

    console.log('Connection closed');


});