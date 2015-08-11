var mongo = require('mongodb');
var defaultInitInfo = {
	server : '',
	port : -1,
	database : '',
	errorHandler : null,
	logHandler : null
}
var initInfoExtend = function(info){
	var r = {
		server : '',
		port : -1,
		database : '',
		errorHandler : null,
		logHandler : null
	}
	if (info.server) r.server = info.server;
	if (info.port) r.port = info.port;
	if (info.database) r.database = info.database;
	if (info.errorHandler) r.errorHandler = info.errorHandler;
	if (info.logHandler) r.logHandler = info.logHandler;
	return r;
};
var _$ = exports;
_$.initialized = false;

_$.connectionInfo = {
	server : '',
	port : -1,
	database : ''
};
_$.errorHandler = null;
_$.logHandler = null;
var logEvent = function(log){
	if (_$.logHandler && typeof _$.logHandler == 'function') {
		_$.logHandler(log);
	};
};
var errorEvent = function(err){
	if (_$.errorHandler && typeof _$.errorHandler == 'function') {
		_$.errorHandler(log);
	};
};

_$.initialize = function (initInfo) {
	var opt = initInfoExtend(initInfo);
	_$.connectionInfo.server = opt.server;
	_$.connectionInfo.port = opt.port;
	_$.connectionInfo.database = opt.database;
	_$.errorHandler = opt.errorHandler;
	_$.logHandler = opt.logHandler;
	_$.initialized = true;
};

_$.open = function(callback) {
	if (_$.initialized && !_$.server) {
		logEvent("open start.");
		_$.server = new mongo.Server(_$.connectionInfo.server, _$.connectionInfo.port,{});
		logEvent("get server.");
		_$.mongoclient  = new mongo.MongoClient(_$.server,  {native_parser: true});
		logEvent("get mongo client.");
		_$.mongoclient.open(function(err, client){
			logEvent("open finish. call callback.");
			if (err != null) {
				errorEvent(err);
				return;
			};
			_$.database = client.db(_$.connectionInfo.database);
			logEvent("get database.");
			_$.database.collections(function(err, items){
				if (err != null) {
					errorEvent(err);
					return;
				};
				_$.collections = items;
				for (var i = 0; i < _$.collections.length; i++) {
					_$.collections[_$.collections[i].collectionName] = _$.collections[i];
				};
			});
			if (callback && typeof callback == 'function') {
				callback(_$);
			};
		});
	};
};

_$.close = function(callback) {
	if (_$.database) {
		_$.database.close(true, function(err, result){
			if (err != null) {
				errorEvent(err);
				return;
			};
			if (callback && typeof callback == 'function') {
				callback(_$);
			};
		});
	};
};

