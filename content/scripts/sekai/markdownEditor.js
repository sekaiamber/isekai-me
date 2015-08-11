var editor;
var ireg = /text\/.*/i;

$(document).ready(function() {
	var $tempMd = $(".preview-part .temp-textarea-md").first();
	var $tempHtml = $("#htmlEditor .temp-textarea-html").first();
	var $previewZone = $(".preview-part .preview-zone").first();
	var $tabContainer = $(".tab-container").first();
	var $top = $("#top").first();
	var $middle = $(".middle").first();
	var $popup = $(".popup").first();

	// **************
	// Marked Engine
	// **************
	var md = marked;
	var renderer = new marked.Renderer();
	
	// add google-code-prettify
	renderer.code = function (code, lang, escaped) {
		if (this.options.highlight) {
			var out = this.options.highlight(code, lang);
			if (out != null && out !== code) {
				escaped = true;
				code = out;
			}
		}

		if (!lang) {
			return '<pre class="code-pre"><code class="prettyprint">'
			+ code
			+ '\n</code></pre>';
		}

		return '<pre class="code-pre"><code class="'
		+ this.options.langPrefix
		+ escape(lang, true)
		+ ' prettyprint">'
		+ code
		+ '\n</code></pre>\n';
	};

	// add google-code-prettify
	renderer.codespan = function (text) {
		return '<code class="prettyprint inline-code">' + text + '</code>';
	};

	// remove align effect of 'th' element
	renderer.tablecell = function (content, flags) {
		var type = flags.header ? 'th' : 'td';
		var tag = type == 'td' && flags.align
			? '<' + type + ' style="text-align:' + flags.align + '">'
			: '<' + type + '>';
		return tag + content + '</' + type + '>\n';
	};

	// **************
	// ACE Editor
	// **************
	editor = ace.edit("editor");
	editor.$blockScrolling = Infinity
	editor.getSession().setMode("ace/mode/markdown");
	editor.getSession().on('change', function(e) {
		// e.type, etc
		render(editor.getValue(), $tempMd, $tempHtml, $previewZone, md, renderer);
	});
	render(editor.getValue(), $tempMd, $tempHtml, $previewZone, md, renderer);
	setupEditorInit();
	editor.getSession().setUseWrapMode(true);
	editor.setShowPrintMargin(false);
	tabItemBtBind($(".tab-item.setup-editor").first(), $(".popup-dialog.setup-editor").first());

	// **************
	// TAB
	// **************
	tabItemInit();

	// **************
	// RESIZE
	// **************
	// tab resize
	var $size = $(".change-bt-size").first();
	var $changeLeft = $(".change-bt.left").first();
	var $changeTop = $(".change-bt.top").first();
	var $editPart = $(".edit-part").first();
	var $previewPart = $(".preview-part").first();
	$(".change-bt").hover(function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	});
	$changeLeft.click(function(){
		var size = parseInt($size.html());
		size = ((size / 25) % 3 + 1) * 25;
		$size.html(size);
		$editPart.css("width", size+"%");
		$previewPart.css("width", (100-size)+"%");
		if (size == 25 || size == 50) {
			$(this).removeClass("icon-xiangzuo");
			$(this).addClass("icon-xiangyou");
		} else {
			$(this).removeClass("icon-xiangyou");
			$(this).addClass("icon-xiangzuo");
		};
		editor.resize();
	});
	$changeTop.click(function(){
		if($top.css("display") == "none") {
			$top.css("display", "");
			$(this).removeClass("icon-xiangxia");
			$(this).addClass("icon-xiangshang"); 
			resizeWindow($top, $middle, $changeLeft);
			editor.resize();
		} else {
			$top.css("display", "none");
			$(this).removeClass("icon-xiangshang");
			$(this).addClass("icon-xiangxia"); 
			resizeWindow($top, $middle, $changeLeft);
			editor.resize();
		}
	});

	// **************
	// Popup
	// **************
	$(".popup-dialog").each(function(){
		var $this = $(this);
		$(".popup-close", $(this)).click(function(){
			switchPopupDialog($this);
		});
	});

	// **************
	// FILE APIs
	// **************
	var supportFileApi = false;
    var supportDrag = true;

    // file reader
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        supportFileApi = true;
    };

    if (supportFileApi) {
        // file bt
        fileBt($tabContainer);

        // drag support
        if (supportDrag) {
        	dragSupport();
        };
    };

    // **************
	// HELP
	// **************
	helpInit();

    // window resize
	$(window).resize(function() {
		resizeWindow($top, $middle, $changeLeft);
	});
	resizeWindow($top, $middle, $changeLeft);
});

function render(text, $tempMd, $tempHtml, $previewZone, md, renderer) {
	$tempMd.val(text);
	$tempHtml.val(md(text, {renderer : renderer}));
	$previewZone.html($tempHtml.val());
	prettyPrint();
};

function fileBt($container){
	var $file = $('.tab-item.read-file').first();
	$file.removeClass("hide");
	var $fileDialog = $(".popup-dialog.load-file").first();

	tabItemBtBind($file, $fileDialog);

	$(".popup-dialog.load-file").change(fileHandler);
}

function fileHandler(evt) {
    var files = evt.target.files
    var isClose = 0;
    if (files[0]) {
        isClose = showFile(files[0]);
    };

    if (isClose == 1) {
    	switchPopupDialog($(".popup-dialog.load-file").first());
    };
};

// drag support
function dragSupport() {
	var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
    var isClose = 0;
    if (files[0]) {
        isClose = showFile(files[0]);
    };

    if (isClose == 1) {
    	switchPopupDialog($(".popup-dialog.load-file").first());
    };
}

function showFile(f) {
    if (!f.type.match(ireg)) {
        // $("#error").html("error: not a text file.");
        showPopupDialogError($(".popup-dialog.load-file").first(), "读取错误：读取的文件不是一个文本文件。")
        return -1;
    };

    var reader = new FileReader();
    reader.onload = (function(){
        return function(e) {
            editor.setValue(this.result);
        };
    })(f);

    reader.readAsText(f);
    return 1;
}


function resizeWindow($top, $middle, $changeBtLeft){
	var height = $top.css("display") == "none" ? 0 : $top.height();
	$middle.height($(window).height() - height);
	$changeBtLeft.css('lineHeight', ($middle.height() - 50) + "px");
}

function switchPopupDialog($dialog){
	if($dialog.hasClass("hide")){
		$dialog.removeClass("hide");
	} else {
		$dialog.addClass("hide");
	}
}

function showPopupDialogError($dialog, msg){
	$(".popup-error", $dialog).html(msg);
}

function tabItemBtBind($bt, $popup, opt) {
	opt = opt || {};
	$bt.click(function(){
		if (!!!(opt.offset)) {
			opt.offset = $bt.offset();
			opt.offset.top += $bt.height();
		};
		$popup.css('top',opt.offset.top + "px");
		$popup.css('left',opt.offset.left + "px");
		showPopupDialogError($popup, "");
		switchPopupDialog($popup);
	});
}

function setupEditorInit() {
	var $fontSize = $(".popup-dialog.setup-editor .font-size").first();
	var $readonly = $(".popup-dialog.setup-editor .readonly").first();

	$fontSize.change(function(e){
		editor.setFontSize(parseInt($(this).val()));
	});
	$readonly.change(function(e){
		editor.setReadOnly($(this).prop('checked'));
	});
}

function tabItemInit() {
	$(".tab-item-button").hover(function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	});
	// markdown to html
	var $mdEditor = $("#editor");
	var $htmlEditor = $("#htmlEditor");
	var $mtoh = $(".tab-item.mtoh").first();
	$mtoh.click(function(){
		if ($(this).hasClass("md")) {
			$mdEditor.addClass("hide");
			$htmlEditor.removeClass("hide");
			$(this).removeClass("md").addClass("html");
		} else if ($(this).hasClass("html")) {
			$mdEditor.removeClass("hide");
			$htmlEditor.addClass("hide");
			$(this).removeClass("html").addClass("md");
		};
	});

	// assist input
	function assistInput(insertPattern, defaultMsg, curMoveLeft, option, selectLength) {
		var selectRange = editor.getSelectionRange();
		var selectMsg = editor.session.getTextRange(selectRange);
		var already = false;
		option = option || {};

		if (selectMsg.length > 0) {
			defaultMsg = selectMsg;
		};
		selectLength = defaultMsg.length;
		curMoveLeft += selectLength;
		insertPattern = insertPattern.replace(/\$/, defaultMsg);

		if (selectMsg.length > 0 && !!!option.noUndo) {
			// test if selected text match the insertPattern
			var msgIndex = insertPattern.indexOf(defaultMsg);
			selectRange.start.column = selectRange.start.column - msgIndex;
			selectRange.end.column = selectRange.end.column + (insertPattern.length - defaultMsg.length - msgIndex);
			var matchMsg = editor.session.getTextRange(selectRange);
			if (matchMsg == insertPattern) {
				already = true;
			};
		};

		if (already) {
			// if select some text and text match the insertPattern
			editor.selection.setRange(selectRange);
			editor.insert(defaultMsg);

			cur = editor.selection.getCursor();
			cur.column -= defaultMsg.length;
			editor.selection.moveCursorToPosition(cur);
			cur.column += defaultMsg.length;
			editor.selection.selectToPosition(cur);
		} else {
			var cur = editor.selection.getCursor();
			if (option.newBlock) {
				editor.insert("\n");
				editor.selection.moveCursorUp();
			};

			if (option.replaceFunc) {
				option.replaceFunc(insertPattern, cur, defaultMsg)
			} else {
				editor.insert(insertPattern);
				cur = editor.selection.getCursor();
				cur.column -= curMoveLeft;
				editor.selection.moveCursorToPosition(cur);
				cur.column += selectLength;
				editor.selection.selectToPosition(cur);
			};
		}
		
		editor.focus();
	};

	// strong
	$(".tab-item.strong").click(function(){
		assistInput("**$**", "加粗内容", 2);
	});
	// italics
	$(".tab-item.em").click(function(){
		assistInput("*$*", "斜体内容", 1);
	});
	// link
	$(".tab-item.link").click(function(){
		assistInput("[$](http://链接地址)", "说明文本", 14);
	});
	// blockquote
	$(".tab-item.blockquote").click(function(){
		opt = {
			'newBlock' : true
		};
		assistInput(">$", "引用内容", 0, opt);
	});
	// code
	$(".tab-item.code").click(function(){
		opt = {
			'newBlock' : true,
			'noUndo' : true,
			'replaceFunc' : function(insertPattern, cur, msg){
				editor.insert(insertPattern);
				cur = editor.selection.getCursor();
				cur.row -= 2;
				editor.selection.moveCursorToPosition(cur);
				cur.column += msg.length;
				editor.selection.selectToPosition(cur);
			}
		};
		assistInput("```$\n\t/* TODO */\n```", "语言类型", 16, opt);
	});
	// img
	$(".tab-item.img").click(function(){
		assistInput("![$](http://链接地址)", "说明文本", 14);
	});
	// ol
	$(".tab-item.ol").click(function(){
		opt = {
			'newBlock' : true
		};
		assistInput("1.  $", "条目内容", 0, opt);
	});
	// ul
	$(".tab-item.ul").click(function(){
		opt = {
			'newBlock' : true
		};
		assistInput("*   $", "条目内容", 0, opt);
	});
	// divid line
	$(".tab-item.hr").click(function(){
		opt = {
			'newBlock' : true,
			'noUndo' : true,
			'replaceFunc' : function(insertPattern, cur, msg){
				editor.insert(insertPattern);
				editor.selection.moveCursorDown();
			}
		};
		assistInput("--------------------$", "", 0, opt);
	});
	// tooltip
	tooltipInit();
}

function tooltipInit () {
	$body = $("body");
	$(".f-tooltip").each(function(){
		$this = $(this);
		if ($this.attr("tooltip") == undefined) {
			return;
		};
		word = $this.attr("tooltip");
		$tooltip = $('<div class="d-tooltip"><div class="t-tooltip">' +
			word + '</div></div>');
		$body.append($tooltip);
		(function($this, $tooltip){
			$this.hover(function(){
				pos = $this.position();
				$tooltip.css("top", (pos.top - 10) + "px");
				$tooltip.css("left", pos.left + "px");
				$tooltip.animate({
					opacity: 1,
					top: "-=20"
				}, 200);
			}, function(){
				$tooltip.animate({
					opacity: 0,
					top: "+=20"
				}, 200);
			});
		})($this, $tooltip);
	});
}

function helpInit() {
	var $help = $('.tab-item.help').first();
	var $helpDialog = $(".popup-dialog.help").first();

	tabItemBtBind($help, $helpDialog);

	$(".help-menu div", $helpDialog).click(function(){
		var i = $(".help-menu div").index(this);
		console.log(i);
		$(".help-context div.show").removeClass("show");
		$(".help-context div:gt(" + i + ")").addClass("show");
	});
}
