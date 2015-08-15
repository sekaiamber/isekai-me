$(document).ready(function(){
    $input = $("input.keyword-input").first();
    $bt = $("button.submit-bt").first();
    $result = $(".result-container").first();
    $resultlist = $(".result-container .result").first();
    $resultdetail = $(".result-detail").first();
    if (Math.random() > 0.5) {
        $('#main').addClass("bg1");
    } else {
        $('#main').addClass("bg2");
    };
    searchInit();
    resizeInit();
    $result.css('height', $(window).height() * 0.7);
    $(document).keypress(function(e){
        if (e.which == 13) {
            $bt.click();
        };
    });
    $("button.return", $resultdetail).click(function(){
        $resultdetail.removeClass("show");
    });
    $(".btspread", $resultdetail).click(function(){
        window.open("http://www.btava.com/search/${0}".replace("${0}", $(this).attr("code")));
    });
    $(".torrentkitty", $resultdetail).click(function(){
        window.open("http://www.torrentkitty.org/search/${0}/".replace("${0}", $(this).attr("code")));
    });
});
var movetime = 600;
var $input;
var $bt;
var $result;
var $resultlist;
var $resultdetail;
var current_data;
function searchInit() {
    $bt.click(search);
};

var __S_INFO__ = {
    keyword: null,
    page: 0,
    count: 50,
}
function search() {
    var $this = $(this);
    if ($.trim($input.val()) == "") {
        $input.addClass("empty");
        return;
    } else {
        $input.removeClass("empty");
    };
    if ($this.hasClass("searching")) {
        return;
    } else {
        $this.addClass("searching");
    };
    __S_INFO__['keyword'] = encodeURI($.trim($input.val()));
    if (!$this.hasClass("more")) {
        startSearchFirst();
    } else {
        startSearch();
    };
};

function startSearchFirst() {
    $(".cell .title").slideUp(movetime, startSearch);
    $result.slideDown(movetime)
    $input.animate({
        width: 440
    }, movetime);
};

function startSearch() {
    $(".loading").css('left', '100%');
    $(".loading .pic").css('opacity', '0');
    $(".loading .pic").css('left', '30%');
    $(".loading .pic .text").html(loadingText[Math.floor(Math.random() * 12)]);
    $(".loading").animate({
        left: 0
    }, 400);
    if ($bt.hasClass("more")) {
        $resultlist.animate({
            left: "-100%"
        }, 400, function(){
            $resultlist.css('left', '100%');
        });
    };
    $(".loading .pic").delay(400).animate({
        left: 0,
        opacity: 1,
    }, 600, function() {
        $.ajax({
            url: './av/search/?key=' + __S_INFO__['keyword'] + "&p=" + __S_INFO__['page'] + "&c=" + __S_INFO__['count'],
        })
        .done(function(data) {
            finishSearch(data);
        })
        .fail(function(){
            finishSearch();
        });
    });
};

function finishSearch(data) {
    $resultlist.empty();
    if (data) {
        searchSuccess(data);
    } else {
        searchFail();
    };
    $(".loading .pic").animate({
        left: "-100%",
    }, 600, function() {
        $bt.addClass("more");
        $bt.removeClass("searching"); 
    });
    $(".loading").delay(600).animate({
        left: "-100%"
    }, 400);
    $resultlist.delay(600).animate({
        left: 0
    }, 400);
}

function searchSuccess(data) {
    current_data = data;
    if (data['status'] != 200) {
        searchFail();
        return;
    };
    var $table = $("<table><thead><tr><th width=\"15%\">番号</th><th width=\"70%\">标题</th><th width=\"15%\">发行时间</th></tr></thead><tbody></tbody></table>");
    var $tbody = $("tbody", $table).first();
    for (var i = 0; i < data.hits.length; i++) {
        var $row = $('<tr index="'+i+'"></tr>');
        $row.append("<td>"+data.hits[i]['code']+"</td>");
        $row.append("<td class=\"left\">"+data.hits[i]['title']+"</td>");
        $row.append("<td>"+dateFormat(data.hits[i]['publishTime'])+"</td>");
        hover($row);
        $row.click(rowClick);
        $tbody.append($row);
    };

    $resultlist.append($table);
}

function searchFail() {
    $resultlist.append('failed.');
}

function resizeInit() {
    $(window).resize(function(){
        $result.css('height', $(window).height() * 0.7);
    });
}

function dateFormat(date) {
    try {
        var d = new Date(date);
        return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    }
    catch(err) {
        return date;
    }
}

function hover($dom) {
    $dom.hover(function(){
        $(this).addClass("hover");
    }, function(){
        $(this).removeClass("hover");
    });
}

function rowClick() {
    var $this = $(this);
    var item = current_data['hits'][$this.attr('index')];
    $(".title", $resultdetail).empty();
    $(".title", $resultdetail).html(item['title']);
    $(".code", $resultdetail).empty();
    $(".code", $resultdetail).html(item['code']);
    $(".publishTime", $resultdetail).empty();
    $(".publishTime", $resultdetail).html(dateFormat(item['publishTime']));
    var maxindex = 20;
    if (item['actress'].length < maxindex) {
        maxindex = item['actress'].length;
    };
    $(".actress", $resultdetail).empty();
    for (var i = 0; i < maxindex; i++) {
        $(".actress", $resultdetail).append("<span>"+item['actress'][i]+"</span>");
    };
    if (item['actress'].length > maxindex) {
        $(".actress", $resultdetail).append("<br>等"+item['actress'].length+"人");
    };
    $(".tags", $resultdetail).empty();
    for (var i = 0; i < item['tags'].length; i++) {
        $(".tags", $resultdetail).append("<span>"+item['tags'][i]+"</span>");
    };
    $(".btspread", $resultdetail).attr("code", "");
    $(".btspread", $resultdetail).attr("code", item['code']);
    $(".torrentkitty", $resultdetail).attr("code", "");
    $(".torrentkitty", $resultdetail).attr("code", item['code']);

    $resultdetail.addClass("show");
}

var loadingText = [
    '<div style=\"font-size:80px;\">Alice</div><div style=\"font-size:40px;\">Down into</div><div style=\"font-size:60px;\">a Rabbit Hole...</div>',
    '<div style=\"font-size:80px;\">Alice</div><div style=\"font-size:40px;\">Enter</div><div style=\"font-size:60px;\">The Pool of Tears...</div>',
    '<div style=\"font-size:80px;\">Alice</div><div style=\"font-size:40px;\">Heard a Long Tale about</div><div style=\"font-size:60px;\">The Caucus Race...</div>',
    '<div style=\"font-size:80px;\">Alice</div><div style=\"font-size:40px;\">See The Rabbit Sends</div><div style=\"font-size:60px;\">a Little Bill...</div>',
    '<div style=\"font-size:80px;\">Alice</div><div style=\"font-size:40px;\">Got Advice</div><div style=\"font-size:60px;\">from a Caterpillar...</div>',
    '<div style=\"font-size:80px;\">Alice</div><div style=\"font-size:40px;\">Meet</div><div style=\"font-size:60px;\">Pig and Pepper...</div>',
    '<div style=\"font-size:80px;\">Alice</div><div style=\"font-size:40px;\">Join</div><div style=\"font-size:60px;\">a Mad Tea Party...</div>',
    "<div style=\"font-size:80px;\">Alice</div><div style=\"font-size:40px;\">is in The Queen's</div><div style=\"font-size:60px;\">Croquet Ground...</div>",
    "<div style=\"font-size:80px;\">Alice</div><div style=\"font-size:40px;\">Listen The Mock</div><div style=\"font-size:60px;\">Turtle's Story...</div>",
    '<div style=\"font-size:80px;\">Alice</div><div style=\"font-size:40px;\">Go in</div><div style=\"font-size:60px;\">Lobster Quadrille...</div>',
    '<div style=\"font-size:80px;\">Alice</div><div style=\"font-size:40px;\">Wonder</div><div style=\"font-size:60px;\">Who Stole the Tarts?</div>',
    "<div style=\"font-size:80px;\">Alice</div><div style=\"font-size:40px;\">Give</div><div style=\"font-size:60px;\">her Evidence...</div>"
];