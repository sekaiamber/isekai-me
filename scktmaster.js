/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-10-26
 * Time: 下午3:44
 * To change this template use File | Settings | File Templates.
 */

var net = require('net');
var timeout = 20000;//超时
var listenPort = 7003;//监听端口

　var http = require('http');
var webserver =　　http.createServer(function (req, res) {
　　  res.writeHead(200, {'Content-Type': 'text/plain'});
 　　 res.end('Hello World\n');
　　});


var server = net.createServer(function(socket){
    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('connect: ' +
        socket.remoteAddress + ':' + socket.remotePort);
    socket.setEncoding('binary');

    //超时事件
//    socket.setTimeout(timeout,function(){
//        console.log('连接超时');
//        socket.end();
//    });

    //接收到数据
    socket.on('data',function(socket){

        console.log('recv: socket');
        // socket.server = webserver;
        //     webserver.emit("connection", socket);
        //     socket.emit("connect");
    });

    //数据错误事件
    socket.on('error',function(exception){
        console.log('socket error:' + exception);
        socket.end();
    });
    //客户端关闭事件
    socket.on('close',function(data){
        console.log('close: ' +
            socket.remoteAddress + ' ' + socket.remotePort);

    });


}).listen(listenPort);

//服务器监听事件
server.on('listening',function(){
    console.log("server listening:" + server.address().port);
});

//服务器错误事件
server.on("error",function(exception){
    console.log("server error:" + exception);
}); 