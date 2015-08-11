var vash = require('./vash');
var path = require('path');
var fs = require('fs');
var templateCatch = {};

var vashHandler = {
	renderView: function(viewPath, context) {
		var template = templateCatch[viewPath];
		if(!template) {
			var template_str = '';
			if(fs.existsSync(viewPath)){
				//这里使用的是同步读取
				template_str = fs.readFileSync(viewPath, 'utf-8');
			}else{
				throw 'View: ' + viewPath + ' not exists';
			};
			template = vash.compile(template_str);
			//添加到缓存中
			templateCatch[viewPath] = template;
		};
		var output = template(context);
		context.content = output;
		output = templateCatch['__layout'](context);
		return output;
	},
	initialize: function(layoutPaht) {
		//vash设置
		vash.config.htmlEscape = false;
		//加载模板
		var template = templateCatch['__layout'];
		if (template) {
			templateCatch['__layout'] = null;
		};
		var template_str = '';
		if(fs.existsSync(layoutPaht)){
			//这里使用的是同步读取
			template_str = fs.readFileSync(layoutPaht, 'utf-8');
		}else{
			throw 'View: ' + layoutPaht + ' not exists';
		};
		template = vash.compile(template_str);
		//添加到缓存中
		templateCatch['__layout'] = template;
	}
};

global.vashHandler = vashHandler;
