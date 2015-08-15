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
    // db.collections['av'].aggregate([
    //     // QUERY
    //     {
    //         $match: selector
    //     },
    //     // FILED
    //     {
    //         $project: {
    //             Code : 1, Name : 1, IssueDate : 1, Tags : 1, Actress : 1, SQL_Id : 1, ActressCount : { $size: "$Actress" } , TimeStamp : {$subtract : ["$IssueDate", new Date("1-1-1970")] }
    //         }
    //     },
    //     // SORT
    //     {
    //         $sort : {
    //             ActressCount : 1, IssueDate : -1
    //         } 
    //     },
    //     // SKIP
    //     {
    //         $skip : (page - 1) * count
    //     },
    //     // LIMIT
    //     {
    //         $limit : count
    //     }
    // ], function(err, docs){
    //     if (err) {
    //         if(errcallback && typeof errcallback == 'function') {
    //             errcallback(err);
    //         };
    //         return;
    //     };
    //     if (callback && typeof callback == 'function') {
    //         callback(docs);
    //     };
    // });
    db.collections['av'].mapReduce(function() {
        var ret = {
            hits : []
        }
        var value = {
            Code : this.Code,
            Name : this.Name,
            IssueDate : this.IssueDate,
            Tags : this.Tags,
            Actress : this.Actress,
            SQL_Id : this.SQL_Id,
            ActressCount : this.Actress.length,
            Timestamp : (new Date().getTime() - this.IssueDate.getTime()) / 86400000
        }
        value['Score'] = (1 - 0.5 / value['ActressCount'] ) * (0.5 - Math.atan(value['Timestamp'] / 480 - 2) / Math.PI) / (0.5 - Math.atan(- 2) / Math.PI) + 0.5 / value['ActressCount']
        if(value['ActressCount'] > 5)
            value['Score'] *= 0.85;
        ret.hits.push(value);
        emit(1, ret);
    }, function(k, v) {
        var ret = {
            hits: []
        }
        for(var i = 0; i < v.length; i++) {
            for(var j = 0; j < v[i].hits.length; j++) {
                ret.hits.push(v[i].hits[j]);
            }
        }
        return ret;
    }, {
        query : selector,
        out : { inline: 1 },
        scope : {
            page : page,
            count : count
        },
        finalize : function(k, v) {
            var ret = {
                hits: []
            }
            v.hits.sort(function(a, b){
                return b.Score - a.Score;
            });
            ret.hits = v.hits.slice((page - 1) * count, count);
            return ret;
        }
    }, function(err, docs, stats){
        if (err) {
            if(errcallback && typeof errcallback == 'function') {
                errcallback(err);
            };
            return;
        };
        if (callback && typeof callback == 'function') {
            if (docs.length > 0) {
                callback(docs[0]['value']['hits']);
            } else {
                callback([]);
            }
        };
    });
};

exports.searchListModel = searchListModel;
exports.getListByKeyword = getListByKeyword;