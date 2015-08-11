var akari = require('../include/akari');

exports.about = function(index){
	var a = -1;
	if (index) { a = index; };

	// dos.parallel([function(){
	// 	process.nextTick(function() {
	// 	// 回调函数内容
	// 		var a= 1.0;
	// 		while(a != 0){
	// 			a = Math.random();
	// 		};
	// 		console.log(a);
	// 	});
	// }, function(){
	// 	console.log("00000000000000000");
	// }])(function(res1, res2){
	// 	console.log("finish");
	// }, function(err){
	// 	console.log("err");
	// });
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
	// 	nextTick : 1
	// });


	this.render('about/about.html', { cssandjs: about_cssandjs });
};


// var dos = function(){
// 	this.parallel = function(fns) {
// 		var results = [];
// 		var counter = fns.length;
// 		console.log("fns length:"+counter);
// 		return function(callback, errback) {
// 			fns.forEach(function(fn, i){
// 				fn(function(result) {
// 					result[i] = result;
// 					counter--;
// 					if (counter <= 0) {
// 						callback.apply(null, results);
// 					};
// 				}, errback);
// 			});
// 		}
// 	};

// 	this.waterfall = function(fns) {
// 		var result;
// 		var counter = fns.length;
// 		return function(callback, errback) {

// 		};
// 	};

// }



var about_cssandjs = '<link rel="stylesheet" type="text/css" href="/content/css/about.css">' +
	'<script type="text/javascript" src="/content/scripts/blog.js"></script>';