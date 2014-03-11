//matching lines - validate on release
//multiline supported
//feedback is immediate after release

//default values
var selectedConnector;
var prevConn;
var prevConn2;
var dragdropx = 0;
var dragdropy = 0;

if (typeof $.fn.classList === "undefined") {
	(function ( $ ) {
		$.fn.classList = function() {
			var c = this.attr('class');
			if (typeof c === "undefined") return undefined;
			return this.attr('class').split(/\s+/);
		};
	}( jQuery ));
}

function connect(lw, div1, div2, color, thickness, temp) {
	var off1 = getOffset(div1);
	var off2 = getOffset(div2);
	var scrollLeft = $(window).scrollLeft();
	var scrollTop = $(window).scrollTop();
	// bottom right
    var x1 = off1.left + (off1.width/2) + scrollLeft;
    var y1 = off1.top + (off1.height/2) + scrollTop;
    // top right
    var x2 = off2.left + (off2.width/2) + scrollLeft;
    var y2 = off2.top + (off2.height/2) + scrollTop;
    // distance
    var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
    // make holder

    if (temp) {
    	var htmlLine = "<div id='templine' class='" + div1.id + " " + div2.id + "' style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
    } else {
    	var htmlLine = "<div class='" + div1.id + " " + div2.id + "' style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
    }
    //
    //alert(htmlLine);
	//document.body.innerHTML += htmlLine;
	document.getElementById(lw).innerHTML += htmlLine;
}

function getOffset( el ) {
	var _x = 0;
	var _y = 0;
	var _w = el.offsetWidth|0;
	var _h = el.offsetHeight|0;
	while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
		_x += el.offsetLeft - el.scrollLeft;
		_y += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	}
	return { top: _y, left: _x, width: _w, height: _h };
}

function enableConnectors (id, b) {
	if (b) {
		$(id + " .connector").each(function(){
			$(this).data("answered", []);
				//debugMsg($(this).data("ans"));
				$(this).unbind("mousedown touchstart");
				$(this).on('mousedown touchstart', function(e) {
					//debugMsg("Sel: " + this.id);
					e.stopPropagation();
					selectConnector($(this));
				});
				/*$(this).on('mouseup touchend touchcancel', function(e) {
					debugMsg("up: " + this.id);
					e.stopPropagation();
					validate($(this));
				})*/
			});
		$(id + " .connector").css("cursor", "pointer");
	} else {
		$(id + " .connector").each(function(){
			$(this).unbind("mousedown");
			$(this).unbind("touchstart");
		});
		$(id + " .connector").css("cursor", "default");
	}
}

function initLines (id, arguments) {
	debugMsg("init: " + id);
	/*try {
		disableScroll();
	} catch (err) {
		debugMsg(err.message);
	}*/
	$(id).attr('unselectable', 'on')
	$(id).css('user-select', 'none')
	$(id).on('selectstart', false);

	var t = 0;
	$("body").prepend('<div id="lw_' + id.substring(1) + '" style="position:absolute; width:100%; height:100%; margin:0; padding:0; left:0px; top:0px;"></div>');
	$(id + " .connector").each(function() {
		var a = $(this).data("ans");
		$(this).data("set", id);
		if (typeof a !== "undefined") {
			//debugMsg("*** Current: " + this.id);
			for (i=0; i<a.length; i++) {
				//debugMsg("Ans: " + a[i]);
				var tgt = $("#"+a[i]).data("ans");
				if (typeof tgt === "undefined") { tgt = []; }
				//debugMsg("Tgt answers: " + tgt);
				if ($.inArray(this.id, tgt) < 0) {
					//if not found
					//debugMsg("not found");
					tgt.push(this.id);
					$("#"+a[i]).data("ans", tgt);
				}
			}
		}
		t += $(this).data("ans").length;
	});
	//debugMsg(t/2);
	$(id).data('totalQ', t/2);
	$(id).data('corrects', 0);
	$(id).data('tries', 0);
	$(id).data('lineColor', arguments.lineColor);
	$(id).data('lineThickness', arguments.lineThickness);
	//$(id).data("multiLine",arguments.multiLine);
	setMultiline(id, arguments.multiLine);
	try {
		updateScreen(id);
	} catch (err) {
		debugMsg(err.message);
	}

	resetLines(id);
}

function resetLines (id) {
	$("#lw_"+id.substring(1)).empty();
	$(id).data('corrects', 0);
	$(id).data('tries', 0);
	
	try {
		feedback(id, "");
		updateScreen(id);
	} catch (err) {
		debugMsg(err.message);
	}

	//selectConnector(undefined);
	enableConnectors(id, true);
}


function selectConnector (e) {
	//debugMsg("Sel: " + e + " - " + selectedConnector)
	selectedConnector = e;
	e.addClass("activeconnector");

	dragdrop_obj = document.createElement('div');
	dragdrop_obj = document.body.appendChild(dragdrop_obj);
	dragdrop_obj.id = 'temp_dragdrop';
	//$('#temp_dragdrop').css('width', '10px');
	//$('#temp_dragdrop').css('height', '10px');
	//$('#temp_dragdrop').css('background-color', 'red');
	$("#temp_dragdrop").css({margin:0, padding:0});
	$("#temp_dragdrop").css("position", "absolute");
	
	//--- attach mousemove and mouseup listener to document
	if (isMobile) {
		document.addEventListener('touchend', dragdrop_mouseup, true);
		document.addEventListener('touchcancel', dragdrop_mouseup, true);
		document.addEventListener('touchmove', dragdrop_mousemove, true);
	} else {
		document.addEventListener('mouseup', dragdrop_mouseup, true);
		document.addEventListener('mousemove', dragdrop_mousemove, true);
	}
}

function validate (e) {
	e.addClass("activeconnector");
	if (!isSameGroupOrDiffSet(e, selectedConnector)) {
		var holder = e.parents(':eq(2)');
		var mySet = selectedConnector.data("set").substring(1);
		//debugMsg('same group');
		if (validateSelection (e, selectedConnector)) {
			//check if same line was drew over
			var v1 = e.data("answered");
			var v2 = selectedConnector.data("answered");
			var a2 = selectedConnector.attr("id");
			var sameline = false;
			if (typeof v1 !== "undefined" && typeof v2 !== "undefined") {
				for (var k=0; k<v1.length; k++) {
					//ans before
					if (v1[k] == a2) sameline = true;
				}
			}

			if (!sameline) {
				//correct
				connect("lw_"+mySet, e.get(0), selectedConnector.get(0), $("#"+mySet).data("lineColor"), parseFloat($("#"+mySet).data("lineThickness")));

				try {
					lineCorrect("#"+mySet);
				} catch (err) {
					debugMsg(err.message);
				}
				
				//set answered
				setAnswered (e, selectedConnector);

				var multiLine = e.parents(':eq(2)').data("multiLine");
				if (!multiLine) {
					//disable both points
					e.unbind("mousedown");
					e.unbind("touchstart");
					selectedConnector.unbind("mousedown");
					selectedConnector.unbind("touchstart");
					e.css("cursor", "default");
					selectedConnector.css("cursor", "default");
				}
				if (isAllAnswered("#"+mySet)) {
					try {
						allComplete("#"+mySet);
					} catch (err) {
						debugMsg(err.message);
					}
					enableConnectors("#"+mySet, false);
				}
				var s = parseInt(holder.data("corrects"));
				holder.data('corrects', s+1);
			}
		} else {
			//salah
			try {
				lineIncorrect("#"+mySet);
			} catch (err) {
				debugMsg(err.message);
			}
			var s = parseInt(holder.data("tries"));
			holder.data('tries', s+1);
		};

		//debugMsg(selectedConnector.attr('id') + " " + e.attr('id'));
		
		try {
			updateScreen("#"+mySet);
		} catch (err) {
			debugMsg(err.message);
		}

	}

	prevConn2 = e;
	setTimeout ( function () { prevConn2.removeClass("activeconnector"); }, 300);
	selectedConnector = null;
}

function dragdrop_mousemove(event) {
	//debugMsg("dragging: " + $(event.target).html());

	//--- find the event object
	var evt = event || window.event;
	if (evt == null) return;
	evt.preventDefault();
	if (typeof dragdrop_obj === 'undefined') return;

	//--- move the object
	if (!isMobile) {
		var xMoved = evt.clientX + $(window).scrollLeft();
		var yMoved = evt.clientY + $(window).scrollTop();
	} else {
		var touch = evt.touches[0];
		//debugMsg("touches: " + evt.originalEvent.touches[0] + ", touch id: " + touch);
		var xMoved = touch.pageX;
		var yMoved = touch.pageY;
	}
	
	dragdrop_obj.style.left = xMoved + 'px';
	dragdrop_obj.style.top = yMoved + 'px';

	var mySet = selectedConnector.data("set").substring(1);

	//remove old line
	$('#templine').remove();

	//draw new line
	connect("lw_"+mySet, dragdrop_obj, selectedConnector.get(0), $("#"+mySet).data("lineColor"), parseFloat($("#"+mySet).data("lineThickness")), true);

	if (!isMobile) {
		dragdropx = evt.clientX + $(window).scrollLeft();
		dragdropy = evt.clientY + $(window).scrollTop();
	} else {
		var touch = evt.touches[0];
		//debugMsg("touches: " + evt.originalEvent.touches[0] + ", touch id: " + touch);
		dragdropx = touch.pageX;
		dragdropy = touch.pageY;
	}
}

function dragdrop_mouseup(event) {
	//--- find the event object
	var evt = event || window.event;
	if (evt == null) return;
	//if (typeof dragdrop_obj === 'undefined') return;
	evt.preventDefault();
	
	prevConn = selectedConnector;
	setTimeout ( function () { prevConn.removeClass("activeconnector"); }, 300);

	//--- remove listeners
	if (isMobile) {
		document.removeEventListener('touchend', dragdrop_mouseup, true);
		document.removeEventListener('touchcancel', dragdrop_mouseup, true);
		document.removeEventListener('touchmove', dragdrop_mousemove, true);
	} else {
		document.removeEventListener('mouseup', dragdrop_mouseup, true);
		document.removeEventListener('mousemove', dragdrop_mousemove, true);
	}

	//--- validate
	var tgt = dragdrop_finished (dragdropx, dragdropy);
	debugMsg("return: " + tgt);
	if (tgt != -1) validate($(tgt));

	//remove templine
	$('#templine').remove();

	//remove temp div for positioning
	$('#temp_dragdrop').remove();
}

function dragdrop_finished(x, y) {
	debugMsg('drag drop finished: ' + x + ", " + y);
	var top, left, width, height;
	var targets = document.getElementsByTagName('div');
	var target = null;
	var scrollTop = $(window).scrollTop();
	var scrollLeft = $(window).scrollLeft();

	//debugMsg(scrollTop + " " + scrollLeft);
	for (var i=0; i<targets.length; i++) {
		if (targets[i].className.indexOf('connector') == -1) continue;

		top = getTop(targets[i]);
		left = getLeft(targets[i]);
		width = getWidth(targets[i]);
		height = getHeight(targets[i]);

		if (x >= left && x <= (left + width) && y >= top && y <= (top + height)) {
			target = targets[i];
			return target;
		}
	}
	//--- if invalid target, move the object back to original position (animated), then destroy it
	return -1;
}

function isSameGroupOrDiffSet (pt1, pt2) {
	var a1 = pt1.parents(':eq(1)').classList();
	var a2 = pt2.parents(':eq(1)').classList();
	//var sameGroup = false;
	if (pt1.data("set") == pt2.data("set")) {
		//if under same set
		for (i=0; i<a1.length; i++) {
			if ($.inArray(a1[i],a2)>=0) { 
				//found match
				//same group
				return true;
			}
		}
	} else {
		//not same set
		return true;
	}
	return false;
}

function validateSelection (pt1, pt2) {
	debugMsg("Validate: " + pt1.attr("id") + " - " + pt2.attr("id"));
	var a1 = pt1.data("ans");
	var a2 = pt2.attr("id");
	
	for (i=0; i<a1.length; i++) {
		//debugMsg(a1[i] + " " + a2);
		if (a1[i] == a2) {
			debugMsg("Match found!");
			return true;
		}
	}
	return false;
}

function setAnswered (pt1, pt2) {
	var multiLine = pt1.parents(':eq(2)').data("multiLine");
	if (multiLine) {	
		var v1 = pt1.data("answered");
		var v2 = pt2.data("answered");
		if (typeof v1 === "undefined") v1 = [];
		if (typeof v2 === "undefined") v2 = [];
		v1.push(pt2.attr("id"));
		v2.push(pt1.attr("id"));
		pt1.data("answered", v1);
		pt2.data("answered", v2);	
	} else {
		//mark as answered
		var v1 = pt1.data("ans");
		var v2 = pt2.data("ans");
		pt1.data("answered", v1);
		pt2.data("answered", v2);
	}
}

function isAllAnswered (id) {
	var complete = true;
	$(id + " .connector").each(function () {
		//debugMsg($(this).attr("id") + " " + $(this).data("ans"));
		//debugMsg($(this).attr("id") + " " + $(this).data("answered"));
		if (typeof $(this).data("answered") !== "undefined") {
			if ($(this).data("ans").length != $(this).data("answered").length) {
				complete = false;
				//debugMsg("Ad");
				//return false;
			}
		} else {
			complete = false;
			//debugMsg("Ad2");
			//return false;
		}
	});
	debugMsg(id + " Complete: " + complete);
	return complete;
}

function getTotal (id) {
	return $(id).data("totalQ");
}

function getCorrects (id) {
	return $(id).data("corrects");
}

function setMultiline (id, b) {
	$(id).data("multiLine", b);
}

function getMultiline (id) {
	return $(id).data("multiLine");
}

function getTries (id) {
	return $(id).data("tries");
}