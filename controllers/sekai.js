var moment = require('moment');
var akari = require('../include/akari');
var service = require('../model/sekaiModels');
var config = require('../config');



var list_markdownEditor = 	'<script type="text/javascript" src="/content/scripts/ace/ace.js"></script>\n' + 
		'<script type="text/javascript" src="/content/scripts/ace/ace_start.js"></script>\n' +
		'<script type="text/javascript" src="/content/scripts/marked/marked.js"></script>\n' +
		'<script type="text/javascript" src="/content/scripts/google/prettify.js"></script>\n' +
		'<script type="text/javascript" src="/content/scripts/sekai/markdownEditor.js"></script>\n' +
		'<link rel="stylesheet" type="text/css" href="/content/css/ace/ace.css">\n' +
		'<link rel="stylesheet" type="text/css" href="/content/css/google/prettify.css">\n' +
		'<link rel="stylesheet" type="text/css" href="/content/css/sekai/markdownEditor.css">\n' +
		'<link rel="stylesheet" type="text/css" href="/content/images/akari/akari-icon.css">\n';
exports.markdownEditor = function(){
	var model = new service.markdownEditorModel();
	model.cssandjs = list_markdownEditor;
	this.render('sekai/markdownEditor.html', model);
};