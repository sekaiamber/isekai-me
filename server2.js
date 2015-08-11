/*
	逻辑
**********************************/
var http = require('http');
var url = require("url");
var path = require("path");
var fs = require("fs");
var querystring = require("querystring");
var config = require('./config');
var route = require('./route');
var ve = require('./include/ve');
var utility = require('./utility.js');
var db = require('./model/dbContext');
// 初始化视图引擎
vashHandler.initialize(path.join(__dirname, config.layout));
// 初始化数据库
db.initialize(config.databaseInfo);
db.open();
// 启动服务器
var server = http.createServer(function(req, res){
	var _postData = '';
	//on用于添加一个监听函数到一个特定的事件
	req.on('data', function(chunk){
		_postData += chunk;
	}).on('end', function(){
		console.log(req.url);
		req.post = querystring.parse(_postData);
		handlerRequest(req, res);
	});
}).listen(8000, config.IP);;
utility.Log("worker " + process.pid, utility.ENUM_MSG_TYPE.info, "webServer started.");
// process.on("message", function(msg,socket) {
// 	process.nextTick(function(){
// 		if(msg == 'c' && socket) {
// 			console.log("a socket in.");
// 			socket.readable = socket.writable = true;
// 			socket.resume();
// 			// server.connections++;
// 			// console.log("process.pid: " + process.pid);
// 			socket.server = server;
// 			server.emit("connection", socket);
// 			socket.emit("connect");
// 		}
// 	});
// });

// startHeartBeat();

/*
	子函数
**********************************/
var handlerRequest = function(req, res){
	//通过route来获取controller和action信息
	var actionInfo = route.getActionInfo(req.url, req.method);
	//如果route中有匹配的action，则分发给对应的action
	if(actionInfo.action){
		//假设controller都放到当前目录的controllers目录里面
		var controller = require('./controllers/'+actionInfo.controller); // ./controllers/blog
		if(controller[actionInfo.action]){
			var ct = new controllerContext(req, res);
			//动态调用，动态语言就是方便啊
			//通过apply将controller的上下文对象传递给action
			controller[actionInfo.action].apply(ct, [actionInfo.args, actionInfo.query, req.post]);
		}else{
			handler500(req, res, 'Error: controller "' + actionInfo.controller + '" without action "' + actionInfo.action + '"');
		};
	}else{
		//如果route没有匹配到，则当作静态文件处理
		staticFileServer(req, res);
	};
};

var controllerContext = function(req, res){
	this.req = req;
	this.res = res;
	this.handler404 = handler404;
	this.handler500 = handler500;
};

controllerContext.prototype.render = function(viewName, context){
	viewEngine.render(this.req, this.res, viewName, context);
};

controllerContext.prototype.renderJson = function(json){
	viewEngine.renderJson(this.req, this.res, json);
};

//如果有未处理的异常抛出，可以在这里捕获到
//process.on('uncaughtException', function (err) {
//    console.log(err);
//});

var handler404 = function(req, res){
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.end('Page Not Found');
};

var handler500 = function(req, res, err){
	res.writeHead(500, {'Content-Type': 'text/plain'});
	res.end(err);
};

var viewEngine = {
	render: function(req, res, viewName, context){
		var filename = path.join(__dirname, 'views', viewName);
		var output = "";
		try{
			output = vashHandler.renderView(filename, context);
			
		} catch(err) {
			handler500(req, res, err);
			return;
		}
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(output);
	},

	renderJson: function(res, json){
		//TODO:
	}
};

var staticFileServer = function(req, res, filePath){
	if(!filePath){
		filePath = path.join(__dirname, config.staticFileDir, url.parse(req.url).pathname);
	};
	fs.exists(filePath, function(exists) {  
		if(!exists) {  
			handler404(req, res);  
			return;  
		}  

		fs.readFile(filePath, "binary", function(err, file) {  
			if(err) {  
				handler500(req, res, err);
				return;  
			}
			var ext = path.extname(filePath);
			ext = ext ? ext.slice(1) : 'html';
			res.writeHead(200, {'Content-Type': config.contentTypes[ext] || 'text/html'});
			res.write(file, "binary");
			res.end();
		});
	});
};

// 启动心跳
function startHeartBeat() {
	setTimeout(function(){
		process.send(createHeartBeat());
		startHeartBeat();
	}, config.WORKER_HEARTBEAT_BLOCK);
};

// 心跳工厂
function createHeartBeat() {
	var beat = { pid: process.pid };
	return beat;
};
