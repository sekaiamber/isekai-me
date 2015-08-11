var moment = require('moment');
var akari = require('../include/akari');
var service = require('../model/blogModels');
var config = require('../config');
var crypto = require('crypto');


exports.test = function(){
	var a = [];
	var b = a[2];
	b();
	this.render('blog/index.html', { t: 'template' });
};

/*
	list
**********************************/
exports.index = function(args, query, form){
	var index = 1;
	if (args.length > 0) {
		var pi = parseInt(args[0]);
		if (!isNaN(pi)) {
			index = pi;
		};
	};
	var $this = this;
	var model = new service.listModel();
	model.cssandjs = list_cssandjs;
	model.index = index;
	model.pagePrefix = "/blog/";
	new akari.waterfall([function(){
		// 获取瀑布流
		var waterfall = this;
		service.getArticleList({}, index, config.article_per_page, function(docs){
			if (docs == null || docs.length == 0) {
				waterfall.error();
				return;
			};
			for (var i = 0; i < docs.length; i++) {
				docs[i].createTime = moment(docs[i].createTime).format('YYYY.MM.DD HH:mm');
			};
			model.articles = docs;
			waterfall.next();
		}, waterfall.error)
	}, function(){
		// 获取瀑布流
		var waterfall = this;
		service.getArticleCount({},function(count){
			var maxPage = Math.ceil(count / config.article_per_page);
			for (var i = 0; i < maxPage; i++) {
				model.pages[i] = i + 1;
			};
			$this.render('blog/bloglist.html', model);
		}, waterfall.error);
	}], {
		error: function(){
			$this.handler404($this.req, $this.res);
			return;
		}
	});
};
var list_cssandjs = '<link rel="stylesheet" type="text/css" href="/content/css/bloglist.css">' +
	'<script type="text/javascript" src="/content/scripts/bloglist.js"></script>';


/*
	article
**********************************/
function sortComent(a, b){
	return a.index > b.index ? 1 : -1;
};

exports.article = function(args, query, form){
	var id = parseInt(args);
	var model = new service.articleModel();
	if (query && query.comment) {
		model.commentIndex = parseInt(query.comment);
	};
	var $this = this;
	model.cssandjs = article_cssandjs;
	service.getArticlePlusView(id, function(doc){
		if (doc == null) {
			$this.handler404($this.req, $this.res);
			return;
		};
		model.entity = doc;
		model.entity.createTime = moment(model.entity.createTime).format('YYYY.MM.DD HH:mm');
		model.entity.modifyTime = moment(model.entity.createTime).format('YYYY.MM.DD HH:mm');
		model.entity.comments.sort(sortComent);
		for (var i = 0; i < model.entity.comments.length; i++) {
			model.entity.comments[i].createTime = moment(model.entity.comments[i].createTime).format('YYYY.MM.DD HH:mm');
		};
		model.commentCount = model.entity.comments.length;
		model.postUrl = "/blog/article/" + model.entity.index + "#comment" + (model.commentCount + 1);
		$this.render('blog/article.html', model);
	}, function(err){
		$this.handler404($this.req, $this.res);
	});
};
var article_cssandjs = '<link rel="stylesheet" type="text/css" href="/content/css/blog.css">' +
	'<script type="text/javascript" src="/content/scripts/blog.js"></script>';

exports.article_post = function(args, query, form){
	var id = parseInt(args);
	var model = new service.articleModel();
	if (query && query.comment) {
		model.commentIndex = parseInt(query.comment);
	};
	var $this = this;
	model.cssandjs = article_cssandjs;
	form.email = form.email.trim().toLowerCase();
	form.author = form.author.trim();
	form.web = form.web.trim().toLowerCase();
	if (parseInt(form._i) == null || parseInt(form._i) == 'undefined' ||
		!(form.author && form.author != '') ||
		!(form.email && form.email != '')) {
		$this.handler404($this.req, $this.res);
		return;
	};
	form._i = parseInt(form._i);
	new akari.waterfall([function(){
		// 获取瀑布流
		var waterfall = this;
		// 检测是否重复提交
		service.getArticleCount({"comments.index" : form._i}, function(count){
			if (count != 0) {
				exports.article.apply($this, [args, query]);
				return;
			};
			waterfall.next();
		}, waterfall.error);
	}, function(){
		// 获取瀑布流
		var waterfall = this;
		// 生成评论
		var comment = new service.commentModel();
		comment.index = form._i;
		comment.author = form.author;
		comment.email = form.email;
		var md5 = crypto.createHash('md5');
		md5.update(form.email);
		comment.emailmd5 = md5.digest('hex');
		comment.web = form.web;
		comment.createTime = new Date();
		comment.content = form.comment;
		service.getArticleAddComment(id, comment, function(doc){
			if (doc == null) {
				waterfall.error();
				return;
			};
			model.entity = doc;
			model.entity.createTime = moment(model.entity.createTime).format('YYYY.MM.DD HH:mm');
			model.entity.modifyTime = moment(model.entity.createTime).format('YYYY.MM.DD HH:mm');
			model.entity.comments.sort(sortComent);
			for (var i = 0; i < model.entity.comments.length; i++) {
				model.entity.comments[i].createTime = moment(model.entity.comments[i].createTime).format('YYYY.MM.DD HH:mm');
			};
			model.commentCount = model.entity.comments.length;
			model.postUrl = "/blog/article/" + model.entity.index + "#comment" + (model.commentCount + 1);
			$this.render('blog/article.html', model);
		}, waterfall.error);
	}], {
		error: function(){
			$this.handler404($this.req, $this.res);
			return;
		}
	});
};

/*
	catalog
**********************************/
exports.catalog = function(args, query, form){
	var catalogindex = parseInt(args[0]);
	var index = parseInt(args[1]);
	var $this = this;
	var model = new service.listModel();
	model.cssandjs = list_cssandjs;
	model.index = index;
	model.pagePrefix = "/blog/catalog/" + catalogindex + "/";
	new akari.waterfall([function(){
		// 获取瀑布流
		var waterfall = this;
		service.getArticleList({'catalog.index' : catalogindex}, index, config.article_per_page, function(docs){
			if (docs == null || docs.length == 0) {
				waterfall.error();
				return;
			};
			for (var i = 0; i < docs.length; i++) {
				docs[i].createTime = moment(docs[i].createTime).format('YYYY.MM.DD HH:mm');
			};
			model.articles = docs;
			model.catalog = docs[0].catalog;
			waterfall.next();
		}, waterfall.error);
	}, function(){
		// 获取瀑布流
		var waterfall = this;
		service.getArticleCount({'catalog.index' : catalogindex},function(count){
			var maxPage = Math.ceil(count / config.article_per_page);
			for (var i = 0; i < maxPage; i++) {
				model.pages[i] = i + 1;
			};
			console.log(model);
			$this.render('blog/bloglist.html', model);
		}, waterfall.error);
	}], {
		error: function(){
			$this.handler404($this.req, $this.res);
			return;
		}
	});
};

/*
	tag
**********************************/
exports.tag = function(args, query, form){
	var tagindex = parseInt(args[0]);
	var index = parseInt(args[1]);
	var $this = this;
	var model = new service.listModel();
	model.cssandjs = list_cssandjs;
	model.index = index;
	model.pagePrefix = "/blog/tag/" + tagindex + "/";
	new akari.waterfall([function(){
		// 获取瀑布流
		var waterfall = this;
		service.getArticleList({'tags.index' : tagindex}, index, config.article_per_page, function(docs){
			if (docs == null || docs.length == 0) {
				waterfall.error();
				return;
			};
			for (var i = 0; i < docs.length; i++) {
				docs[i].createTime = moment(docs[i].createTime).format('YYYY.MM.DD HH:mm');
			};
			model.articles = docs;
			for (var i = 0; i < docs[0].tags.length; i++) {
				if(docs[0].tags[i].index == tagindex) {
					model.catalog = { name : "Tag : " + docs[0].tags[i].name };
					break;
				};
			};
			waterfall.next();
		}, waterfall.error);
	}, function(){
		// 获取瀑布流
		var waterfall = this;
		service.getArticleCount({'tags.index' : tagindex},function(count){
			var maxPage = Math.ceil(count / config.article_per_page);
			for (var i = 0; i < maxPage; i++) {
				model.pages[i] = i + 1;
			};
			console.log(model);
			$this.render('blog/bloglist.html', model);
		}, waterfall.error);
	}], {
		error: function(){
			$this.handler404($this.req, $this.res);
			return;
		}
	});
};