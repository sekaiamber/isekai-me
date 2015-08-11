var _$ = exports;

_$.waterfall = function (callbacks, options) {
	this.callbacks = callbacks;
	this.nextTick = false || (options.nextTick && options.nextTick === true);

	this.next = function(){
		var fn = this.callbacks.shift();
		if (fn != null) {
			var $this = this;
			var $arguments = arguments;
			if (this.nextTick) {
				process.nextTick(function(){
					fn.apply($this, $arguments);
				});
			} else {
				fn.apply($this, $arguments);
			};
		};
	};

	if (options.error && typeof options.error == 'function') {
		this.error = options.error;
	};

	this.next();
};

// ========Example=========
//
// var cb = new akari.waterfall([function(){
// 	var a = 1;
// 	var b = 2;
// 	console.log("sp1 ====");
// 	this.next(a + b);
// }, function(v){
// 	console.log("sp2 ====" + v);
// 	this.next("a", "b");
// 	console.log("sp2.2 ===");	
// }, function(a, b){
// 	console.log("sp3 ====" + a + ":" +  b);
// }], {
// 	error: function(e){
// 		console.log(e);
// 	}, 
// 	nextTick : true
// });