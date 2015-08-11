var db = require('../model/dbContext');
/*
    list
**********************************/
function searchListModel(){
    this.index = -1;
    this.code = -1;
    this.title = "--";
    this.publishTime = "--";
};

exports.searchListModel = searchListModel;