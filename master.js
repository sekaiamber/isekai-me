/*
	逻辑
**********************************/
var http = require('http');
var numCPUs = require('os').cpus().length;
var cp = require('child_process');
var net = require('net');
var utility = require('./utility.js');
var config = require('./config.js');
var workers = [];

for (var i = 0; i < numCPUs; i++) {
	startWorker(i);
};

// 启动服务器
net.createServer(function(socket) {
	socket.pause();
	var worker = workers.shift();
	try{
		worker.process.send('c', socket);
		workers.push(worker);
	} catch(err) {
		utility.Log("Master", utility.ENUM_MSG_TYPE.error, 'Catch error:' + err.message);
		if (err.message == 'channel closed') {
			for (var i = 0; i < workers.length; i++) {
				var msg = "<worker " + worker.sign + "> down, ";
				worker = createWorker();
				msg += "<worker " + worker.sign + "> raise.";
				worker.process.send('c', socket);
				workers.push(worker);
			};
		};
	};
	// worker.process.kill();
}).listen(config.PORT, config.IP);
utility.Log("Master", utility.ENUM_MSG_TYPE.info, 'Master start at http://' + config.IP + ':' + config.PORT);

// 启动子进程监控
// startMonitWorkerProcess();


/*
	子函数
**********************************/

// 启动worker进程
function startWorker() {
	var worker = createWorker();
	workers.push(worker);
};

// worker工厂
function createWorker() {
	var workerp = cp.fork('server.js', ['normal']);
	// 子进程心跳回调
	// workerp.on('message', function(beat) {
	// 	receiveWorkerHeartBeat(beat);
	// 	// console.log('Get beat pid:', beat.pid);
	// });
	var worker = { 
		process: workerp, 
		sign: workerp.pid,
		beattime: new Date()
	};
	return worker;
};

// 接收到worker心跳
// function receiveWorkerHeartBeat(beat) {
// 	var worker =  null;
// 	for (var i = 0; i < workers.length; i++) {
// 		if (workers[i].sign == beat.pid) {
// 			worker = workers[i];
// 			break;
// 		};
// 	};

// 	if (worker != null) {
// 		// console.log(worker.sign + ":" + worker.beattime);
// 		worker.beattime = new Date();
// 	};
// };

// 启动监控workers
// function startMonitWorkerProcess() {
// 	setTimeout(function(){
// 		// monitWorkerProcess();
// 		startMonitWorkerProcess();
// 	}, config.WORKER_MONIT_BLOCK);
// };

// 轮询workers
// function monitWorkerProcess() {
// 	for (var i = 0; i < workers.length; i++) {
// 		var timeblock = (new Date()).getTime() - workers[i].beattime.getTime();
// 		// console.log(timeblock);
// 		if (timeblock > config.WORKER_NO_RESPONCE_TIME) {
// 			var msg = "<worker " + workers[i].sign + "> down, ";
// 			workers[i] = createWorker();
// 			msg += "<worker " + workers[i].sign + "> raise.";
// 			utility.Log("Master", utility.ENUM_MSG_TYPE.warning, msg);
// 		};
// 	};
// };
