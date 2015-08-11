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