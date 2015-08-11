var db = require('../model/dbContext');
/*
	list
**********************************/
function listModel(){
	this.index = 1;
	this.cssandjs = "";
	this.articles = [];
	this.pages = [];
	this.catalog = null;
	this.pagePrefix = "/"
};

function getArticleList(selector, page, count, callback, errcallback) {
	db.collections['articles'].find(selector, {
		skip : (page - 1) * count, 
		limit : count, 
		fields : { author : 1, index : 1, createTime : 1, title : 1, tags : 1, summary : 1, catalog : 1},
		sort : [['createTime' , -1]]
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

exports.listModel = listModel;
exports.getArticleList = getArticleList;

/*
	article
**********************************/
function articleModel(){
	this.entity = {
		"index" : -1,
		"createTime" : null,
		"modifyTime" : null,
		"catalog" : {
			"index" : -1,
			"name" : ""
		},
		"title" : "",
		"author" : "",
		"view" : -1,
		"content" : "",
		"tags" : [],
		"comments" : []
	};
	this.commentIndex = 1;
	this.commentCount = -1;
	this.cssandjs = "";
	this.postUrl = "";
};

function commentModel(){
	this.index = -1;
	this.author = "";
	this.email = "";
	this.emailmd5 = "";
	this.web = "";
	this.createTime = null;
	this.content = "";
};

function getArticlePlusView(id, callback, errcallback) {
	findAndModifyArticle({index:id}, { $inc : { view : 1}}, function(err, doc){
		if (err) {
			if(errcallback && typeof errcallback == 'function') {
				errcallback(err);
			};
			return;
		};
		if (callback && typeof callback == 'function') {
			callback(doc);
		};
	});
};

function getArticleAddComment(id, comment, callback, errcallback) {
	findAndModifyArticle({index:id}, { $push : { comments : comment} }, function(err, doc){
		if (err) {
			if(errcallback && typeof errcallback == 'function') {
				errcallback(err);
			};
			return;
		};
		if (callback && typeof callback == 'function') {
			callback(doc);
		};
	});
};

function getArticleCount(selector, callback, errcallback) {
	db.collections['articles'].count(selector,  function(err, count) {
		if (err) {
			if(errcallback && typeof errcallback == 'function') {
				errcallback(err);
			};
			return;
		};
		if (callback && typeof callback == 'function') {
			callback(count);
		};
	});
};

function findAndModifyArticle(selector, update, callback){
	db.collections['articles'].findAndModify(selector, [['index', 1]] , update, { 'new' : true}, callback);
};

exports.articleModel = articleModel;
exports.commentModel = commentModel;
exports.getArticlePlusView = getArticlePlusView;
exports.getArticleAddComment = getArticleAddComment;
exports.getArticleCount = getArticleCount;