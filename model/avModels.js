var db = require('../model/dbContext');
/*
    list
**********************************/
function searchListModel(){
    this.index = -1;
    this.code = -1;
    this.title = "--";
    this.publishTime = "--";
    this.tags = [];
    this.actress = [];
};

function getListByKeyword(selector, page, count, callback, errcallback) {
	db.collections['av'].find(selector, {
		skip : (page - 1) * count, 
		limit : count, 
		fields : { Code : 1, Name : 1, IssueDate : 1, Tags : 1, Actress : 1, SQL_Id : 1}
	}).toArray(function(err, docs){
		if (err) {
			if(errcallback && typeof errcallback == 'function') {
				errcallback(err);
			};
			return;
		};
		if (callback && typeof callback == 'function') {
			callback(docs);
		};
	});
};

exports.searchListModel = searchListModel;
exports.getListByKeyword = getListByKeyword;