 // 标准记录

exports.Log = function Log(sender, msgType, msg) {
	console.log("[" + (new Date()) + "][" + msgType + "][" + sender + "] : " + msg);
};

var ENUM_MSG_TYPE = { info : 'I',  warning : 'W', error : 'E' };

exports.ENUM_MSG_TYPE = ENUM_MSG_TYPE;
