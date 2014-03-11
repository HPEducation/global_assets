//matching lines - submit to validate
//single line only per matching pair
//click to same connector again to change answer (this is why multiline is not possible for this method)

//default values
var selectedConnector;

if (typeof $.fn.classList === "undefined") {
	(function ( $ ) {
		$.fn.classList = function() {
			var c = this.attr('class');
			if (typeof c === "undefined") return undefined;
			return this.attr('class').split(/\s+/);
		};
	}( jQuery ));
}

function connect(lw, div1, div2, color, thickness) {
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
    var htmlLine = "<div class='" + div1.id + " " + div2.id + "' style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
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

$(document).click(function(){
	selectConnector(undefined);
});

function enableConnectors (id, b) {
	if (b) {
		$(id + " .connector").each(function(){
			$(this).data("answered", []);
				//console.log($(this).data("ans"));
				$(this).unbind("click");
				$(this).click(function(e) {
					//console.log("Sel: " + this.id);
					e.stopPropagation();
					selectConnector($(this));
				})
			});
		$(id + " .connector").css("cursor", "pointer");
	} else {
		$(id + " .connector").each(function(){
			$(this).unbind("click");
		});
		$(id + " .connector").css("cursor", "default");
	}
}

function initLines (id, arguments) {
	console.log("init: " + id);
	/*try {
		disableScroll();
	} catch (err) {
		console.log(err.message);
	}*/
	
	//var t = 0;
	$("body").prepend('<div id="lw_' + id.substring(1) + '" style="position:absolute; width:100%; height:100%; margin:0; padding:0; left:0px; top:0px;"></div>');
	$(id + " .connector").each(function() {
		var a = $(this).data("ans");
		$(this).data("set", id);
		if (typeof a !== "undefined") {
			//console.log("*** Current: " + this.id);
			for (i=0; i<a.length; i++) {
				//console.log("Ans: " + a[i]);
				var tgt = $("#"+a[i]).data("ans");
				if (typeof tgt === "undefined") { tgt = []; }
				//console.log("Tgt answers: " + tgt);
				if ($.inArray(this.id, tgt) < 0) {
					//if not found
					//console.log("not found");
					tgt.push(this.id);
					$("#"+a[i]).data("ans", tgt);
				}
			}
		}
		//t += $(this).data("ans").length;
	});
	//console.log(t/2);
	$(id).data('totalQ', Math.floor($(id + " .connector").length/2));
	$(id).data('corrects', 0);
	$(id).data('lineColor', arguments.lineColor);
	$(id).data('lineColorIncorrect', arguments.lineColorIncorrect);
	$(id).data('lineThickness', arguments.lineThickness);

	resetLines(id);
}

function resetLines (id) {
	$("#lw_"+id.substring(1)).empty();
	$(id).data('corrects', 0);
	selectConnector(undefined);
	enableConnectors(id, true);
	try {
		linesResetComplete(id);
	} catch (err) {
		console.log(err.message);
	}
}

function selectConnector (e) {
	//console.log("Sel: " + e + " - " + selectedConnector)
	if (typeof e !== "undefined") {
		//var holder = e.parents(':eq(2)');
		if (e != selectedConnector) {
			//console.log("Prev sel: " + selectedConnector);
			if (typeof selectedConnector !== "undefined") {
				var t;
				if (!isSameGroupOrDiffSet(e, selectedConnector)) {
					//console.log($("#lw_"+id.substring(1)));
					$("#lw_" + e.data("set").substring(1) + " ."+e.attr("id")).remove();
					$("#lw_" + selectedConnector.data("set").substring(1) + " ."+selectedConnector.attr("id")).remove();
					clearConnectedAns(e);
					clearConnectedAns(selectedConnector);
					
					setAnswered (e, selectedConnector);

					var mySet = e.data("set").substring(1);

					connect("lw_"+mySet, e.get(0), selectedConnector.get(0), $("#"+mySet).data("lineColor"), parseFloat($("#"+mySet).data("lineThickness")));

					if (isAllAnswered("#"+mySet)) {
						try {
							lineDrew("#"+mySet, true);
						} catch (err) {
							console.log(err.message);
						}
					} else {
						//$("#submitbtn").hide();
						try {
							lineDrew("#"+mySet, false);
						} catch (err) {
							console.log(err.message);
						}
					}
					t = undefined;
				} else {
					t = e;
				}
				selectedConnector.removeClass("activeconnector");
				selectedConnector = t;
				if (typeof selectedConnector !== "undefined") selectedConnector.addClass("activeconnector");
			} else {
				selectedConnector = e;
				selectedConnector.addClass("activeconnector");
			}
		}
	} else {
		console.log("clear sel");
		if (typeof selectedConnector !== "undefined") {
			selectedConnector.removeClass("activeconnector");
		}
		selectedConnector = e;
	}
}

function showAns (id) {
	$("#lw_"+id.substring(1)).empty();
	$(id + " .group1 .connector").each(function () {
		var tgt = $(this).data("ans");
		for (i=0; i<tgt.length; i++) {
			connect("lw_"+id.substring(1), $(this).get(0), $("#"+tgt[i]).get(0), $(id).data("lineColor"), parseFloat($(id).data("lineThickness")));
		}
	});
	try {
		answerShowed (id);
	} catch (err) {
		console.log(err.message);
	}
}

function clearConnectedAns (e) {
	var id = e.data("answered");
	if (typeof id !== "undefined") {
		//console.log("Clear answered: " + $("#"+id).attr("id"));
		$("#"+id).data("answered", "");
		//console.log($("#"+id).data("answered"));
	}
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

function validateSelection (e) {
	var a1 = e.data("ans");
	var a2 = e.data("answered");
	var mySet = e.data("set").substring(1);
	
	for (i=0; i<a1.length; i++) {
		//console.log(a1[i] + " " + a2);
		if (a1[i] == a2[0]) {
			console.log("Match found!");
			return true;
		}
	}
	$("#lw_" + mySet + " ." + e.attr("id")).css("background-color", $("#"+mySet).data("lineColorIncorrect"));
	return false;
}

function setAnswered (pt1, pt2) {
	//mark as answered
	//var v1 = pt1.data("ans");
	//var v2 = pt2.data("ans");
	pt1.data("answered", [pt2.attr("id")]);
	pt2.data("answered", [pt1.attr("id")]);
	//console.log(pt1.attr("id") + " correct: " + pt1.data("ans") + " answered: " + pt1.data("answered"));
	//console.log(pt2.attr("id") + " correct: " + pt2.data("ans") + " answered: " + pt2.data("answered"));
}

function isAllAnswered (id) {
	var complete = true;
	$(id + " .connector").each(function () {
		//console.log($(this).attr("id") + " " + $(this).data("ans"));
		//console.log($(this).attr("id") + " " + $(this).data("answered"));
		//console.log(this.id + " answered: " + $(this).data("answered"));
		if (typeof $(this).data("ans") !== "undefined") {
			if (typeof $(this).data("answered") === "undefined" || $(this).data("answered").length == 0) {
				complete = false;
				//console.log("Ad2");
				//return false;
			}
		}
	});
	//console.log(id + " complete: " + complete);
	return complete;
}

function validateAnswers (id) {
	var holder = $(id);
	var c = 0;
	$(id + " .connector").each(function () {
		if (typeof $(this).data("ans") !== "undefined") {
			if (validateSelection ($(this))) {
				//console.log("Correct!");
				c++;
			}
		}
	});
	
	c /= 2;
	holder.data('corrects', c);
	return c;
}

function getTotal (id) {
	return $(id).data("totalQ");
}

function getCorrects (id) {
	return $(id).data("corrects");
}

