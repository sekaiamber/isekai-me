var db = require('../model/dbContext');

/*
	index
**********************************/
function indexModel(){
	this.index = 1;
	this.cssandjs = "";
	this.catalog = null;
};

exports.indexModel = indexModel;