var dragdrop = {};

var dragdrop_obj = null;
var dragdrop_x = 0;
var dragdrop_y = 0;
var dragArray = [];
var quizAnswers = [];
var completedQuiz = [];
var defaultClass = "outershadow";


//default values
var aesthetics = true;
var instantfeedback = true;
var replacedrop = false;

//var answers = [];
//var quiz_sym = null;

//var currDragme = null;

$(document).ready (function () {

function quiz_load(sym, params) {
	debugMsg("quiz load: " + sym);
	$(sym).attr('data-aesthetics', aesthetics);
	$(sym).attr('data-draggingclass', defaultClass);
	$(sym).attr('data-instantfeedback', instantfeedback);
	$(sym).attr('data-replacedrop', replacedrop);

	if (typeof params !== 'undefined') {
		if (typeof params.aesthetics === 'boolean') {
			$(sym).attr('data-aesthetics', params.aesthetics);
		}
		if (typeof params.draggingclass !== 'undefined' && params.draggingclass != '') {
			$(sym).attr('data-draggingclass', defaultClass + ' ' + params.draggingclass);
		}
		if (typeof params.instantfeedback === 'boolean') {
			$(sym).attr('data-instantfeedback', params.instantfeedback);
		}
		if (typeof params.replacedrop === 'boolean') {
			if (params.instantfeedback == false) $(sym).attr('data-replacedrop', params.replacedrop);
		}
	}
	
	$(sym).find('.response').hide();
	dragdrop_ini(sym);
}
dragdrop.quiz_load = quiz_load;

function checkComplete (sym) {
	var tt = parseInt($(sym).attr("total"));
	var currArrayId = parseInt($(sym).attr("quizid"));
	var currArray = quizAnswers[currArrayId];
	
	debugMsg(currArray.length + " / " + tt);

	var arrayPos = $.inArray( sym, completedQuiz );

	if (currArray.length == tt) {
		if (arrayPos == -1) {
			//if not in array add in
			completedQuiz.push(sym);
		}
		try {
			completed($(sym));
		} catch (err) {
			debugMsg(err.message);
		}
		var b = true;
	} else {
		if (arrayPos >= 0) {
			//if in array remove
			completedQuiz.splice(arrayPos, 1);
		}
		var b = false;
	}

	if (checkAllComplete()) {
		try {
			allComplete();
		} catch (err) {
			debugMsg(err.message);
		}
	}

	return b;
}

function checkAllComplete () {
	if (completedQuiz.length == quizAnswers.length) {
		return true;
	}
	return false;
}

function dragdrop_ini(sym) {
	//--- make images draggable	
	$(sym).find('.dragMe').each(function() {
		addInteractions ($(this));
		
		$(this).attr("dragdrop_group", "#"+$(sym).get(0).id);
		$(this).addClass("origin");
		$(this).attr("data-uid", dragArray.length);
		dragArray.push($(this));
	});
	
	var n = 0;
	$(sym).find('.dropHere').each(function() {
		$(this).attr("dragdrop_group", "#"+$(sym).get(0).id);
		//$(this).attr("id", n);
		n++;
	});
	
	$(sym).attr("total", n);
	
	var l = quizAnswers.length;
	$(sym).attr("quizid", l);
	quizAnswers[l] = new Array();
	
}

function addInteractions (obj) {
	obj.mousedown(function(e) {
		e.stopPropagation(); e.preventDefault();
		//debugMsg("mousedown: " + $(this).html());
		dragdrop_mousedown(e);
		if ($(this).hasClass("origin")) $(this).addClass("dragMeActive");
		//currDragme = $(this);
	});
	obj.on('touchstart', function(e){
		e.stopPropagation(); e.preventDefault();
		//debugMsg("touchstart: " + $(this).html());
		dragdrop_touchstart(e);
		if ($(this).hasClass("origin")) $(this).addClass("dragMeActive");
		//currDragme = $(this);
	});
	obj.addClass("pointer");
}

function getLTWH (obj) {
	var originalPadding = parseFloat($(obj).css("padding-top"));
	var originalBorderWidth = parseFloat($(obj).css("border-top-width"));

	if (isNaN(originalPadding)) {
		originalPadding = 0;
	}
	if (isNaN(originalBorderWidth)) {
		originalBorderWidth = 0;
	}
	
	var top = getTop(obj) - originalPadding;
	var left = getLeft(obj) - originalPadding;
	var width = getWidth(obj) - (originalBorderWidth*2);
	var height = getHeight(obj) - (originalBorderWidth*2);
	//debugMsg(left + " " + top + " " + width + " " + height);
	return {"left":left, "top":top, "width":width, "height":height};
}

function dragdrop_mousedown(event) {
	
	//--- find the event object
	var evt = event || window.event;
	if (evt == null) return;
	var obj = evt.target || evt.srcElement;
	if (obj == null) return;
	evt.preventDefault();
	
	var sym = obj.getAttribute('dragdrop_group');
	var ltwh = getLTWH(obj);

	//--- make a clone of the object
	$("#temp_dragdrop").empty();
	$("#temp_dragdrop").remove();
	dragdrop_obj = null;
	dragdrop_obj = document.createElement('div');
	dragdrop_obj = document.body.appendChild(dragdrop_obj);
	dragdrop_obj.id = 'temp_dragdrop';
	var clone = obj.cloneNode(true); // "deep" clone
	$(clone).removeAttr('id');
	$(clone).removeClass('origin');
	clone.style.width = ltwh.width + 'px';
	clone.style.height = ltwh.height + 'px';
	clone.style.position = "relative";
	dragdrop_obj.appendChild(clone);
	
	if ($(sym).attr("data-aesthetics") == "true") $("#temp_dragdrop div").addClass("dragMe " + $(sym).attr('data-draggingclass'));
	//$("#temp_dragdrop div").css("width", ltwh.width+'px');
	//$("#temp_dragdrop div").css("height", ltwh.height+'px');
	$("#temp_dragdrop div").css("margin", 0);
	//$("#temp_dragdrop").css("border", "1px solid blue");
	
	//dragdrop_obj.src = obj.src;
	dragdrop_obj.setAttribute('answer', obj.getAttribute('data-ans'));
	dragdrop_obj.setAttribute('dragdrop_group', sym);
	dragdrop_obj.setAttribute('data-uid', obj.getAttribute('data-uid'));
	dragdrop_obj.style.position = 'absolute';
	dragdrop_obj.style.top = ltwh.top + 'px';
	dragdrop_obj.style.left = ltwh.left + 'px';
	//dragdrop_obj.style.width = ltwh.width + 'px';
	//dragdrop_obj.style.height = ltwh.height + 'px';
	//dragdrop_obj.style.cursor = 'pointer';
	dragdrop_obj.style.zIndex = 2000;
	
	//--- record initial drag-drop location
	dragdrop_obj.setAttribute('iniX', evt.clientX);
	dragdrop_obj.setAttribute('iniY', evt.clientY);
	dragdrop_obj.setAttribute('iniTop', ltwh.top);
	dragdrop_obj.setAttribute('iniLeft', ltwh.left);

	//disable original
	enableOrigin ($(dragdrop_obj), false);

	if (!$(obj).hasClass("origin") && $(sym).attr('data-instantfeedback') == "false") {
		$(obj).parent().remove();
	}

	try {
		onDragged (dragdrop_obj);
	} catch (err) {
		debugMsg(err.message);
	}

	//--- attach mousemove and mouseup listener to document
	document.addEventListener('mousemove', dragdrop_mousemove, true);
	document.addEventListener('mouseup', dragdrop_mouseup, true);
}

function dragdrop_touchstart(event) {
	//debugMsg("touchstart evt: " + event.type + " " + $(event.target).html());
	//--- find the event object
	var evt = event || window.event;
	if (evt == null) return;
	var obj = evt.target || evt.srcElement;
	if (obj == null) return;
	evt.preventDefault();
	
	//debugMsg("obj: " + obj);
	var sym = obj.getAttribute('dragdrop_group');	
	var ltwh = getLTWH(obj);
	
	//--- make a clone of the object
	$("#temp_dragdrop").empty();
	$("#temp_dragdrop").remove();
	dragdrop_obj = null;
	dragdrop_obj = document.createElement('div');
	dragdrop_obj = document.body.appendChild(dragdrop_obj);
	dragdrop_obj.id = 'temp_dragdrop';
	var clone = obj.cloneNode(true); // "deep" clone
	$(clone).removeAttr('id');
	$(clone).removeClass('origin');
	clone.style.width = ltwh.width + 'px';
	clone.style.height = ltwh.height + 'px';
	clone.style.position = "relative";
	dragdrop_obj.appendChild(clone);
	
	if ($(sym).attr("data-aesthetics") == "true") $("#temp_dragdrop div").addClass("dragMe " + $(sym).attr('data-draggingclass'));
	//$("#temp_dragdrop div").css("width", width+'px');
	//$("#temp_dragdrop div").css("height", height+'px');
	$("#temp_dragdrop div").css("margin", 0);
	//$("#temp_dragdrop").css("border", "1px solid blue");

	//dragdrop_obj.src = obj.src;
	dragdrop_obj.setAttribute('answer', obj.getAttribute('data-ans'));
	dragdrop_obj.setAttribute('dragdrop_group', sym);
	dragdrop_obj.setAttribute('data-uid', obj.getAttribute('data-uid'));
	dragdrop_obj.style.position = 'absolute';
	dragdrop_obj.style.top = ltwh.top + 'px';
	dragdrop_obj.style.left = ltwh.left + 'px';
	//dragdrop_obj.style.width = ltwh.width + 'px';
	//dragdrop_obj.style.height = ltwh.height + 'px';
	//dragdrop_obj.style.cursor = 'pointer';
	dragdrop_obj.style.zIndex = 2000;
	
	//--- record initial drag-drop location
	var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
	//debugMsg("touches: " + evt.originalEvent.touches[0] + ", touch id: " + touch);
	dragdrop_x = touch.pageX;
	dragdrop_y = touch.pageY;
	//debugMsg("x,y: " + dragdrop_x + ", " + dragdrop_y)
	dragdrop_obj.setAttribute('iniX', dragdrop_x);
	dragdrop_obj.setAttribute('iniY', dragdrop_y);
	dragdrop_obj.setAttribute('iniTop', ltwh.top);
	dragdrop_obj.setAttribute('iniLeft', ltwh.left);

	//disable original
	enableOrigin ($(dragdrop_obj), false);

	if (!$(obj).hasClass("origin") && $(sym).attr('data-instantfeedback') == "false") {
		$(obj).parent().remove();
	}

	try {
		onDragged (dragdrop_obj);
	} catch (err) {
		debugMsg(err.message);
	}
	
	//--- attach mousemove and mouseup listener to document
	document.addEventListener('touchmove', dragdrop_touchmove, true);
	document.addEventListener('touchend', dragdrop_touchend, true);
	document.addEventListener('touchcancel', dragdrop_touchend, true);
}

function dragdrop_mousemove(event) {
	//debugMsg("dragging: " + $(event.target).html());

	//--- find the event object
	var evt = event || window.event;
	if (evt == null) return;
	evt.preventDefault();
	if (dragdrop_obj == null) return;

	//--- move the object
	var xMoved = evt.clientX - parseInt(dragdrop_obj.getAttribute('iniX'));
	var yMoved = evt.clientY - parseInt(dragdrop_obj.getAttribute('iniY'));
	dragdrop_obj.style.left = (parseInt(dragdrop_obj.getAttribute('iniLeft')) + xMoved) + 'px';
	dragdrop_obj.style.top = (parseInt(dragdrop_obj.getAttribute('iniTop')) + yMoved) + 'px';
}

function dragdrop_touchmove(event) {
	//debugMsg("touch dragging: " + $(event.target).html());

	//--- find the event object
	var evt = event || window.event;
	if (evt == null) return;
	evt.preventDefault();
	if (dragdrop_obj == null) return;

	//--- move the object
	var touch = evt.touches[0];
	dragdrop_x = touch.pageX;
	dragdrop_y = touch.pageY;
	var xMoved = dragdrop_x - parseInt(dragdrop_obj.getAttribute('iniX'));
	var yMoved = dragdrop_y - parseInt(dragdrop_obj.getAttribute('iniY'));
	dragdrop_obj.style.left = (parseInt(dragdrop_obj.getAttribute('iniLeft')) + xMoved) + 'px';
	dragdrop_obj.style.top = (parseInt(dragdrop_obj.getAttribute('iniTop')) + yMoved) + 'px';
}

function dragdrop_mouseup(event) {

	//--- find the event object
	var evt = event || window.event;
	if (evt == null) return;
	if (dragdrop_obj == null) return;
	evt.preventDefault();
	
	//--- remove listeners
	document.removeEventListener('mousemove', dragdrop_mousemove, true);
	document.removeEventListener('mouseup', dragdrop_mouseup, true);

	//--- check if drop target is valid (className contains 'dropHere')
	var x = evt.clientX;
	var y = evt.clientY;
	dragdrop_finished(x, y);
}

function dragdrop_touchend(event) {

	//--- find the event object
	var evt = event || window.event;
	if (evt == null) return;
	if (dragdrop_obj == null) return;
	evt.preventDefault();
	
	//--- remove listeners
	document.removeEventListener('touchmove', dragdrop_touchmove, true);
	document.removeEventListener('touchend', dragdrop_touchend, true);
	document.removeEventListener('touchcancel', dragdrop_touchend, true);

	//--- check if drop target is valid (className contains 'dropHere')
	dragdrop_finished(dragdrop_x, dragdrop_y);
}

function dragdrop_finished(x, y) {
	var top, left, width, height;
	var targets = document.getElementsByTagName('div');
	var target = null;
	var scrollTop = $(window).scrollTop();
	var scrollLeft = $(window).scrollLeft();
	var validDrop = true;

	//debugMsg(scrollTop + " " + scrollLeft);
	for (var i=0; i<targets.length; i++) {
		if (targets[i].className.indexOf('dropHere') == -1) continue;

		top = getTop(targets[i]);
		left = getLeft(targets[i]);
		width = getWidth(targets[i]);
		height = getHeight(targets[i]);

		if (!isMobile) {
			top -= scrollTop;
			left -= scrollLeft;
		}

		if (x >= left && x <= (left + width) && y >= top && y <= (top + height)) {
			target = targets[i];
			break;
		}
	}

	//--- if invalid target, move the object back to original position (animated), then destroy it
	if (target == null) {
		returnBack (dragdrop_obj);
		validDrop = false;
	}

	var sym = dragdrop_obj.getAttribute('dragdrop_group');

	//if incorrect group
	if (validDrop) {
		if (sym != target.getAttribute('dragdrop_group')) {
			returnBack (dragdrop_obj);
			validDrop = false;
		}
	}

	//--- check if there is another drop object in the target container, if so,
	//--- move the object back to original position (animated), then destroy it
	if (validDrop) {
		var objs = target.childNodes;
		for (var i=objs.length-1; i>=0; i--) {
			if (objs[i].className) {
				if (objs[i].className == 'dragdrop_dropped') {
					returnBack (dragdrop_obj);
					validDrop = false;
					break;
				}
			}
		}
	}

	if (validDrop) {
		if ($(sym).attr('data-instantfeedback') == "true") {

			//instant feedback
			if ( isDropCorrect($(dragdrop_obj), $(target)) ) {
				//correct
				attachDrag(dragdrop_obj, target);

				//update stats
				addAnswers (sym, dragdrop_obj.getAttribute('answer'), target.getAttribute('data-ans'));

				//check if complete
				checkComplete (sym);

				//feedback to function
				correctFeedback (target);

			} else {
				//incorrect
				returnBack (dragdrop_obj);
				
				//feedback to function
				wrongFeedback (dragdrop_obj, target);

			}
		} else {
			//manual feedback
			attachDrag(dragdrop_obj, target);
			addInteractions ($(dragdrop_obj).find(".dragMe"));
		}
	}

	updateAnswers (sym);

	try {
		onDropped (dragdrop_obj, target);
	} catch (err) {
		debugMsg(err.message);
	}
	
}

function attachDrag (obj, target) {
	var top, left;
	var sym = obj.getAttribute('dragdrop_group');
	
	//--- add this object to the target container
	var dragAttached = target.appendChild(obj);
	top = Math.floor((getHeight(target) - getHeight(dragAttached)) / 2) - parseFloat($(target).css("border-top-width"));
	left = Math.floor((getWidth(target) - getWidth(dragAttached)) / 2) - parseFloat($(target).css("border-left-width"));

	//debugMsg($(dragAttached).get(0));
	//debugMsg(getHeight(target) + " " + getHeight(dragAttached) + " " + top);
	//debugMsg("left border width: " + parseFloat($(target).css("border-left-width")));
	//debugMsg(dragAttached);
	$(dragAttached).find(".dragMe").css("margin", 0);
	//$(dragAttached).find(".dragMe").css("top", "0px");
	//$(dragAttached).find(".dragMe").css("position", "absolute");
	//$(dragAttached).removeClass("pointer");
	$(dragAttached).find(".dragMe").removeClass('pointer ' + $(sym).attr('data-draggingclass'));
	//$(dragAttached).find(".dragMe").removeAttr('data-ans');
	//$(dragAttached).find(".dragMe").removeAttr('id');
	//dragAttached.style.cursor = 'default';
	
	dragdrop_obj.style.zIndex = 'auto';
	dragAttached.style.position = 'absolute';
	dragAttached.style.top = top + 'px';
	dragAttached.style.left = left + 'px';
	$(dragAttached).removeAttr("id");
	//dragAttached.id = '';
	//dragAttached.className = 'dragdrop_dropped';
	//$(dragAttached).removeClass("dropHere");
	$(dragAttached).addClass("dragdrop_dropped");
	
	//answers.push(dragAttached);
	
	//dragAttached = null;
}

function isDropCorrect (drag, target) {
	//--- mark the answer
	//--- answer of the dragged object is stored in attribute = 'answer'
	//--- correct answer for the drop target container s stored in attribute = 'answer'
	var sym = drag.attr('dragdrop_group');
	var answer = drag.attr('answer');
	var correctAnswer = target.attr('data-ans');
	debugMsg("Validate: " + answer + ", Correct: " + correctAnswer);
	
	//if correct answer
	if (answer == correctAnswer || answer == "*" || correctAnswer == "*") {
		//if (quiz_correct.indexOf(answer) == -1) quiz_correct = quiz_correct + answer;
		//if ($.inArray(answer, quiz_correct) == -1) {
			//not found		
			return true;
		//}
		//debugMsg("Corrects: " + currArray);
	} else {
		return false;
	}
}

function returnBack (drag) {
	var origin = dragArray[$(drag).attr("data-uid")];
	var ltwh = getLTWH(origin.get(0));
	var iniLeft = ltwh.left;
	var iniTop = ltwh.top;
	$("#temp_dragdrop").animate({ left: iniLeft, top: iniTop }, 50, function() {
		// animation completed
		origin.removeClass("dragMeActive");
		//drag.parentNode.removeChild(drag);
		enableOrigin ($(dragdrop_obj), true);
		$(dragdrop_obj).remove();
		//drag = null;
		//currDragme = null;
	});
}

function returnBackFromDrop (drag) {
	$(drag).parent().remove();
	var origin = dragArray[$(drag).attr("data-uid")];
	//var ltwh = getLTWH(origin.get(0));
	//var iniLeft = ltwh.left;
	//var iniTop = ltwh.top;
	
		// animation completed
		origin.removeClass("dragMeActive");
		//drag.parentNode.removeChild(drag);
		enableOrigin ($(drag), true);
		//$(dragdrop_obj).remove();
		//drag = null;
		//currDragme = null;

}

dragdrop.returnBackFromDrop = returnBackFromDrop;

/*function addObjToDrop (drag, target) {
	var obj = target.appendChild(drag);
	var top = Math.floor((getHeight(target) - getHeight(obj)) / 2) - parseFloat($(target).css("border-top-width"));
	var left = Math.floor((getWidth(target) - getWidth(obj)) / 2) - parseFloat($(target).css("border-left-width"));
	
	//debugMsg($(obj).get(0));
	//debugMsg(getHeight(target) + " " + getHeight(obj) + " " + top);
	//debugMsg("left border width: " + parseFloat($(target).css("border-left-width")));
	//debugMsg(obj);
	$(obj).find(".dragMe").css("margin", 0);
	$(obj).find(".dragMe").css("top", "0px");
	$(obj).find(".dragMe").css("position", "absolute");
	$(obj).removeClass("pointer");
	$(obj).find(".dragMe").removeClass("pointer");
	//obj.style.cursor = 'default';
	
	obj.style.position = 'absolute';
	obj.style.top = top + 'px';
	obj.style.left = left + 'px';
	obj.id = '';
	//obj.className = 'dragdrop_dropped';
	$(obj).removeClass("dropHere");
	$(obj).addClass("dragdrop_dropped");
	
	answers.push(obj);
	obj = null;
}*/

function addObjToDrop2 (drag, drop) {	
	var top = Math.floor(($(drop).outerHeight() - $(drag).outerHeight()) / 2) - parseFloat($(drop).css("border-top-width"));
	var left = Math.floor(($(drop).outerWidth() - $(drag).outerWidth()) / 2) - parseFloat($(drop).css("border-left-width"));

	var clone = $(drag).clone(false);
	clone.removeAttr('id');
	clone.removeAttr('data-ans');

	if ($(drop).children().hasClass('dragdrop_dropped')) {
		$(drop + ' .dragdrop_dropped').remove();
	}
	
	$(drop).append('<div class="dragdrop_dropped"></div>');
	$(drop + ' .dragdrop_dropped').append(clone);

	$(drop + ' .dragMe').css({'position':'absolute', 'margin':'0', 'top':top + 'px', 'left':left + 'px'});
	$(drop + ' .dragMe').removeClass('pointer');
	$(drop + ' .dragMe').removeClass('dragMeActive');
	$(drop).addClass('dragdrop_dropped');
	$(drag).addClass('dragMeActive');
	$(drag).unbind('mousedown');
	$(drag).unbind('touchstart');
	$(drag).css('cursor', 'default');

	//update stats
	//var sym = $(drag).attr('dragdrop_group');
	//var currArrayId = parseInt($(sym).attr("quizid"));
	//var currArray = quizAnswers[currArrayId];
	//currArray.push($(drag).attr('data-ans') + ":" + $(drop).attr('data-ans'));
	
	//checkComplete (sym);
}

dragdrop.addObjToDrop = addObjToDrop2;

function addAnswers (id, answer, correctAnswer) {
	var currArrayId = parseInt($(id).attr("quizid"));
	var currArray = quizAnswers[currArrayId];

	currArray.push(answer + ":" + correctAnswer);
	quizAnswers[currArrayId] = currArray;
}

function clearAnswers (id) {
	var currArrayId = parseInt($(id).attr("quizid"));
	var currArray = quizAnswers[currArrayId] = [];
	quizAnswers[currArrayId] = currArray;
}

function updateAnswers (id) {
	//clear all answers
	clearAnswers(id);

	$(id + ' .dropHere .dragdrop_dropped').each(function() {
		//update stats, re-adding to array	
		addAnswers (id, $(this).find(".dragMe").attr('data-ans'), $(this).attr('answer'));
	});

	//check if complete
	checkComplete (id);
}

function checkAnswers (id) {
	//checking
	var correctArray = [];
	var wrongArray = [];
	$(id + ' .dropHere').each(function() {
		//console.log('length: ' + $(this).find('.dragdrop_dropped').length);
		if ($(this).find('.dragdrop_dropped').length > 0) {
			var drag = $(this).find(".dragdrop_dropped");
			var drop = $(this);
			if (isDropCorrect(drag, drop)) {
				//correct
				correctArray.push(drop);
				correctFeedback(drop.get(0));

			} else {
				//wrong
				wrongArray.push(drop);
				wrongFeedback(drag.get(0), drop.get(0));
			}
		}
	});
	return {"correct":correctArray, "wrong":wrongArray};
}
dragdrop.checkAnswers = checkAnswers;

function showAnswer (id) {
	$(id + ' .dropHere').each(function() {
		//console.log('length: ' + $(this).find('.dragdrop_dropped').length);
		if ($(this).find('.dragdrop_dropped').length == 0) {
			var ans = $(this).attr('data-ans');
			var dragId = findMyFriend(id + ' .dragMe', 'data-ans', ans);
			console.log('drag id: ' + dragId);
			if(dragId != '') addObjToDrop2 ('#'+dragId, '#'+$(this).attr('id'));
		}
	});
}
dragdrop.showAnswer = showAnswer;

function findMyFriend (id, attr, value) {
	var dragId = '';
	//console.log($(id).not('.dragMeActive'));
	$(id).not('.dragMeActive').each(function() {
		//make sure not in a dropped area
		if (!$(this).parent().hasClass('dragdrop_dropped')) {
			//console.log($(this).html());
			//console.log($(this).attr(attr) + ' ' + value);
			if ($(this).attr(attr) == value) {
				dragId = $(this).attr('id');
				//console.log($(this).html());
				return false;
			}
		}
	});
	//must have an 'id' attribute
	return dragId;
}

function correctFeedback (target) {
	try {
		correct (target);
	} catch (err) {
		debugMsg(err.message);
	}
}

function wrongFeedback (obj, target) {
	try {
		var origin = dragArray[$(obj).attr("data-uid")];
		incorrect(target, origin);
	} catch (err) {
		debugMsg(err.message);
	}
}

function enableDragme (drag, b) {
	if (b) {
		addInteractions(drag);
	} else {
		drag.unbind("mousedown");
		drag.unbind("touchstart");
		drag.removeClass("pointer");
		//currDragme = null;
	}
}
dragdrop.enableDragme = enableDragme;

function enableOrigin (obj, b) {
	var origin = dragArray[obj.attr("data-uid")];
	enableDragme(origin, b)
}

dragdrop.enableOrigin = enableOrigin;

});