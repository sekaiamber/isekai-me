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
    var test = inputTest(key);
    var ret = {
        status: 200,
        key: key,
        hits: []
    }
    var $this = this;
    if (!test['ok']) {
        ret['status'] = 201;
        ret['message'] = "key " + test['type'];
        $this.renderJson(ret);
    };
    service.getListByKeyword({
        "$or": [
            {"Code": new RegExp(key, "i")},
            {"Name": new RegExp(key, "i")},
            {"Tags": new RegExp(key, "i")},
            {"Actress": new RegExp(key, "i")}
        ]
    }, 1, 50, function(docs){
        for (var i = 0; i < docs.length; i++) {
            var item = new service.searchListModel();
            item.index = docs[i]['SQL_Id'];
            item.code = docs[i]['Code'];
            item.title = docs[i]['Name'];
            item.publishTime = docs[i]['IssueDate'];
            item.tags = docs[i]['Tags'];
            item.actress = docs[i]['Actress'];
            ret['hits'].push(item)
        };
        $this.renderJson(ret);
    }, function(err){
        ret['status'] = 201;
        ret['message'] = err;
        $this.renderJson(ret);
    });
    
}

function inputTest(str) {
    var result = {
        ok: false,
        type: ""
    };
    str = trim(str);
    if (str == "") {
        result['type'] = "empty";
        return result;
    };
    if (str.length > 10) {
        result['type'] = "too-long";
        return result;
    };
    if (str.length < 3) {
        if(str.replace(/[^\x00-\xff]/g,"..").length < 3) {
            result['type'] = "too-short";
            return result;
        }
    };
    result['ok'] = true;
    return result;
}

function trim(text) {
    return text == null ? "" : (text + "").replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "" );
}