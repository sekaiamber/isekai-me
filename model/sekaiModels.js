var db = require('../model/dbContext');
/*
	insertArticle
**********************************/
function markdownEditorModel(){
	this.index = 1;
	this.cssandjs = "";
	this.catalog = null;
	this.title = "Sekai的Markdown在线编辑器";
};

exports.markdownEditorModel = markdownEditorModel;