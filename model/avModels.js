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
    db.collections['av'].aggregate([
        // QUERY
        {
            $match: selector
        },
        // FILED
        {
            $project: {
                Code : 1, Name : 1, IssueDate : 1, Tags : 1, Actress : 1, SQL_Id : 1, ActressCount : { $size: "$Actress" } , TimeStamp : {$subtract : ["$IssueDate", new Date("1-1-1970")] }
            }
        },
        // SORT
        {
            $sort : {
                ActressCount : 1, IssueDate : -1
            } 
        },
        // SKIP
        {
            $skip : (page - 1) * count
        },
        // LIMIT
        {
            $limit : count
        }
    ], function(err, docs){
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