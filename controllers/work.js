var moment = require('moment');
var akari = require('../include/akari');
var service = require('../model/workModels');
var config = require('../config');

/*
	Index
**********************************/
var index_cssandjs = '<link rel="stylesheet" type="text/css" href="/content/css/work.css">';
exports.index = function(){
	var model = new service.indexModel();
	model.cssandjs = index_cssandjs;
	// model.cssandjs = list_markdownEditor;
	this.render('work/index.html', model);
};