var moment = require('moment');
var akari = require('../include/akari');
var service = require('../model/avModels');
var config = require('../config');


/*
    index
**********************************/
exports.index = function(args, query, form){
    this.render('av/index.html', { cssandjs: index_cssandjs });
}
var index_cssandjs = '<link rel="stylesheet" type="text/css" href="./content/css/av/index.css">' + 
    '<script type="text/javascript" src="./content/scripts/av/index.js"></script>';

/*
    search
**********************************/
exports.search = function(args, query, form){
    var key = "";
    if (query['key']) {
        key = query['key'];
    };
    var ret = {
        status: 200,
        key: key,
        hits: []
    }
    for (var i = 0; i < 10; i++) {
        var mo = new service.searchListModel();
        mo['index'] = i;
        mo['code'] = 'NMB-777';
        mo['title'] = 'This is a test';
        mo['publishTime'] = '2015-07-15';
        ret['hits'].push(mo);
    };
    this.renderJson(ret);
}