$(document).ready(function(){
    $input = $("input.keyword-input").first();
    $bt = $("button.submit-bt").first();
    $result = $(".result-container").first();
    $resultlist = $(".result-container .result").first();
    if (Math.random() > 0.5) {
        $('#main').addClass("bg1");
    } else {
        $('#main').addClass("bg2");
    };
    searchInit();
    resizeInit();
    $result.css('height', $(window).height() * 0.7);
});
var movetime = 600;
var $input;
var $bt;
var $result;
var $resultlist;
function searchInit() {
    $bt.click(search);
};

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
    if (!$this.hasClass("more")) {
        startSearchFirst();
    } else {
        startSearch();
    };
};

function startSearchFirst() {
    $(".title").slideUp(movetime, startSearch);
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
        var key = encodeURI($.trim($input.val()));
        $.ajax({
            url: './av/search/?key=' + key,
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
    console.log(data);
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
    if (data['status'] != 200) {
        searchFail();
        return;
    };
    var $table = $("<table><thead><tr><th width=\"15%\">番号</th><th width=\"70%\">标题</th><th width=\"15%\">发行时间</th></tr></thead><tbody></tbody></table>");
    var $tbody = $("tbody", $table).first();
    for (var i = 0; i < data.hits.length; i++) {
        var $row = $("<tr></tr>");
        $row.append("<td>"+data.hits[i]['code']+"</td>");
        $row.append("<td class=\"left\">"+data.hits[i]['title']+"</td>");
        $row.append("<td>"+data.hits[i]['publishTime']+"</td>");
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