//matching lines - validate on release
//multiline supported
//feedback is immediate after release

//default values
var selectedConnector;
var prevConn;

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

	var t = 0;
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
		t += $(this).data("ans").length;
	});
	//console.log(t/2);
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
		console.log(err.message);
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
		console.log(err.message);
	}

	selectConnector(undefined);
	enableConnectors(id, true);
}


function selectConnector (e) {
	//console.log("Sel: " + e + " - " + selectedConnector)
	if (typeof e !== "undefined") {
		var holder = e.parents(':eq(2)');
		if (e != selectedConnector) {
			//console.log("Prev sel: " + selectedConnector);
			e.addClass("activeconnector");
			if (typeof selectedConnector !== "undefined") {
				var t;
				//console.log("Same group or diff set? " + isSameGroupOrDiffSet(e, selectedConnector));
				if (!isSameGroupOrDiffSet(e, selectedConnector)) {
					var mySet = e.data("set").substring(1);
					//console.log("Validate: " + validateSelection (e, selectedConnector));
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
								console.log(err.message);
							}
							
							//set answered
							setAnswered (e, selectedConnector);

							var multiLine = e.parents(':eq(2)').data("multiLine");
							if (!multiLine) {
								//disable both points
								e.unbind("click");
								selectedConnector.unbind("click");
								e.css("cursor", "default");
								selectedConnector.css("cursor", "default");
							}
							if (isAllAnswered("#"+mySet)) {
								try {
									allComplete("#"+mySet);
								} catch (err) {
									console.log(err.message);
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
							console.log(err.message);
						}
						var s = parseInt(holder.data("tries"));
						holder.data('tries', s+1);
					};

					console.log(selectedConnector.attr('id') + " " + e.attr('id'));
					prevConn = selectedConnector;
					setTimeout ( function () { prevConn.removeClass("activeconnector"); }, 300);
					setTimeout ( function () { e.removeClass("activeconnector"); }, 300);
					var match = true;
					
					try {
						updateScreen("#"+mySet);
					} catch (err) {
						console.log(err.message);
					}

					t = undefined;
				} else {
					t = e;
				}
				if (!match) selectedConnector.removeClass("activeconnector");
				selectedConnector = t;
				if (typeof selectedConnector !== "undefined") selectedConnector.addClass("activeconnector");
			} else {
				selectedConnector = e;
				//selectedConnector.addClass("activeconnector");
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
	//console.log("Validate: " + pt1.attr("id") + " - " + pt2.attr("id"));
	var a1 = pt1.data("ans");
	var a2 = pt2.attr("id");
	
	for (i=0; i<a1.length; i++) {
		//console.log(a1[i] + " " + a2);
		if (a1[i] == a2) {
			console.log("Match found!");
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
		//console.log($(this).attr("id") + " " + $(this).data("ans"));
		//console.log($(this).attr("id") + " " + $(this).data("answered"));
		if (typeof $(this).data("answered") !== "undefined") {
			if ($(this).data("ans").length != $(this).data("answered").length) {
				complete = false;
				//console.log("Ad");
				//return false;
			}
		} else {
			complete = false;
			//console.log("Ad2");
			//return false;
		}
	});
	console.log(id + " Complete: " + complete);
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