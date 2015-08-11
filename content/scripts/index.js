$(document).ready(function() {
	initMenu();
	initContent();
});

function initMenu () {
	$("#menu-bt").hover(function(){
		$(".t-02.m-logo").first().stop().animate({
			marginTop: -540
		}, 400, function() {
			// Animation complete.
		});
	}, function() {

	});
	$(".menu-container").hover(function(){

	}, function() {
		$(".t-02.m-logo").first().stop().animate({
			marginTop:0
		}, 400, function() {
			// Animation complete.
		});
	});
	$(".m-l1-item").click(function(){
		window.location.href= $(this).attr("href"); 
	});
};

function initContent(){
	$(".pos-anchor").each(function(){
		var post = parseInt($(this).attr("pos-t"));
		var posl = parseInt($(this).attr("pos-l"));
		$(this).css("position", "absolute");
		if (post) {
			$(this).css("top", post + "px");
		};
		if (posl) {
			$(this).css("left", posl + "px");
		};
	});
};