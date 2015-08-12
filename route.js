var parseURL = require('url').parse;
//根据http请求的method来分别保存route规则
var routes = {get:[], post:[], head:[], put:[], delete:[]};
/**
* 注册route规则
* 示例：
* route.map({
*     method:'post',
*     url: /\/blog\/post\/(\d+)\/?$/i,
*     controller: 'blog',
*     action: 'showBlogPost'
* })
*/
exports.map = function(dict){
	if(dict && dict.url && dict.controller){
		var method = dict.method ? dict.method.toLowerCase() : 'get';
		routes[method].push({
			u: dict.url, //url匹配正则
			c: dict.controller,
			a: dict.action || 'index'
		});
	}
};

exports.getActionInfo = function(url, method){
	var r = {controller:null, action:null, args:null, query:{}};
	var method = method ? method.toLowerCase() : 'get';
	// url: /blog/index/1?page=1 ,则pathname为: /blog/index
	var pUrl = parseURL(url);
	var pathname = pUrl.pathname;
	var m_routes = routes[method];
	for(var i in m_routes){
		//正则匹配
		r.args = m_routes[i].u.exec(pathname);
		if(r.args){
			r.controller = m_routes[i].c;
			r.action = m_routes[i].a;
			r.args.shift(); //第一个值为匹配到的整个url，去掉
			if (pUrl.query) {
				var query = pUrl.query.split('&');
				for (var j = 0; j < query.length; j++) {
					var sp = query[j].indexOf('=');
					if (sp != -1) {
						r.query[query[j].substring(0, sp)] = query[j].substring(sp + 1);
					};
				};
			};
			for(key in r.query) {
				r.query[key] = decodeURI(r.query[key]);
			}
			break;
		};
	};
	//如果匹配到route，r大概是 {controller:'blog', action:'index', args:['1']}
	return r;
};