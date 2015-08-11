exports.index = function(){
	this.render('home/index.html', { cssandjs: cssandjs });
};

var cssandjs = '<link rel="stylesheet" type="text/css" href="./content/css/index.css">' + 
 	'<link rel="stylesheet" type="text/css" href="./content/css/index-items.css">' + 
	'<script type="text/javascript" src="./content/scripts/index.js"></script>';