var popup_currentPoint = null;
var popup_currentPopup = null;
function popup_ini() {
	//--- optional 1st arg: min_number
	//--- optional 2nd arg: max_number
	var min_number = 1;
	var max_number = 99999;
	if (arguments.length > 1) {
		min_number = parseInt(arguments[0]);
		max_number = parseInt(arguments[1]);
	}
	//--- find all div tags with class name = 'popup'
	var divs = document.getElementsByTagName('DIV');
	if (divs == null) return;
	if (divs.length == 0) return;
	var top = 0;
	var left = 0;
	var position = '';
	var icon = '';
	var number = 0;
	var autostart = '';
	for (var i=0; i<divs.length; i++) {
		var div = divs[i];
		if (div.className.indexOf('popup') == -1) continue;
		try {
			top = parseInt(div.getAttribute('top'));
			left = parseInt(div.getAttribute('left'));
			position = div.getAttribute('position');
			icon = div.getAttribute('icon');
			autostart = div.getAttribute('autostart');
			number = parseInt(div.id.replace('popup',''));
		} catch (err) {
			continue;
		}
		if (icon == null) icon = '';
		if (autostart == null) autostart = '';
		if (isNaN(top) || isNaN(left) || isNaN(number)) continue;
		if (number < min_number || number > max_number) continue;
		div.id = 'popup' + number;
		popup_create(number, top, left, icon, position, autostart);
	}
	//--- play autostart pointer and popup
	if (popup_currentPoint != null && popup_currentPopup != null) {
		popup_show(popup_currentPoint, popup_currentPopup);
	} else {
		popup_currentPoint = null;
		popup_currentPopup = null;
	}
}
function popup_destroy() {
	//--- optional 1st arg: min_number
	//--- optional 2nd arg: max_number
	var min_number = 1;
	var max_number = 99999;
	if (arguments.length > 1) {
		min_number = parseInt(arguments[0]);
		max_number = parseInt(arguments[1]);
	}
	if (popup_currentPoint != null) popup_hide(popup_currentPoint, popup_currentPopup);
	var obj = null;
	for (var i=min_number; i<=max_number; i++) {
		obj = document.getElementById('popup_point' + i);
		if (obj != null) {
			obj.parentNode.removeChild(obj);
		}
	}
}
function popup_create(number, top, left, icon, position, autostart) {
	//--- test if the popup with this number already exists
	var obj = document.getElementById('popup_point' + number);
	if (obj != null) return;
	//--- create div. example:
	//--- <div class="popup_point above-right" style="top:380px; left:90px" onclick="popup_toggle(event)">
	var div = document.createElement('DIV');
	div.className = 'popup_point ' + position;
	div.style.top = top + 'px';
	div.style.left = left + 'px';
	div = document.body.appendChild(div);
	div.id = 'popup_point' + number;
	div.addEventListener('click', popup_toggle, false);
	//--- child #1: rotating spinner
	//--- <img class="popup_rotate" src="popup_rotate.png" />
	var img = document.createElement('IMG');
	img.src = 'popup/popup_rotate.png';
	img.className = 'popup_rotate';
	div.appendChild(img);
	//--- child #2: point image
	//--- <img class="popup_point" src="popup_static.png" />
	img = document.createElement('IMG');
	if (icon == '') {
		img.src = 'popup/popup_static.png';
	} else {
	 	img.src = 'popup/' + icon;
	 }
	img.className = 'popup_point';
	div.appendChild(img);
	//--- child #3:
	//--- <font class="popup_point">1</font>
	var font = document.createElement('FONT');
	font.innerHTML = '' + number;
	if (icon == '') {
		font.className = 'popup_point';
	} else {
		font.className = 'popup_point_hidden';
	}
	div.appendChild(font);
	//--- save reference to point and popup if autostart = 'true'
	if (autostart == 'true') {
		popup_currentPoint = div;
		popup_currentPopup = document.getElementById('popup' + number);
	}
}
function popup_toggle(e) {
	//--- get the popup point div clicked (class=popup_point)
	var event = e || window.event;
	var point = event.target || event.srcElement;
	while (point.tagName.toLowerCase() != 'div') {
		point = point.parentNode;
	}
	//--- get the number in popup point (1,2,3...)
	var font = null;
	for (var i=0; i<point.childNodes.length; i++) {
		if (point.childNodes[i].tagName) {
			if (point.childNodes[i].tagName.toLowerCase() == 'font') {
				font = point.childNodes[i];
				break;
			}
		}
	}
	if (font == null) return;
	var num = parseInt(font.innerHTML);
	//--- locate the popup div (class=popup)
	var popup = document.getElementById('popup' + num);
	if (popup == null) return;
	//--- show or hide popup
	if (popup.className == 'popup_shown') {
		popup_hide(point, popup);
	} else {
		popup_show(point, popup);
	}
}
function popup_toggle2(obj, number) {
	//--- locate the popup div (class=popup)
	var popup = document.getElementById('popup' + number);
	if (popup == null) return;
	//--- show or hide popup
	if (popup.className == 'popup_shown') {
		popup_hide(obj, popup);
	} else {
		popup_show(obj, popup);
	}
}
function popup_show(point, popup) {
	//--- hide any existing popup
	if (popup_currentPoint != null) popup_hide(popup_currentPoint, popup_currentPopup);
	//--- stop rotation animation on point
	var image = null;
	for (var i=0; i<point.childNodes.length; i++) {
		if (point.childNodes[i].className) {
			if (point.childNodes[i].className.toLowerCase() == 'popup_rotate') {
				image = point.childNodes[i];
				break;
			}
		}
	}
	if (image == null) return;
	image.className = 'popup_rotate_stopped';
	//--- move point to the top of view
	point.style.zIndex = 1002;
	//--- get the position to show popup
	//--- above, above-right, above-left, below, below-right, below-left, center-left, center-right
	var position = point.className.replace('popup_point','').trim();
	//--- save reference to the current point and popup div
	popup_currentPoint = point;
	popup_currentPopup = popup;
	//--- play voice-over if any
	var voiceover = popup.getAttribute('voiceover');
	if (voiceover != null) {
		if (voiceover.length > 4) playAudio(voiceover);
	}
	//--- update the popup div's top and left
	var top = getTop(point);
	var left = getLeft(point);
	var height = getHeight(popup);
	if (position.indexOf('above') >= 0) {
		top = top - height + 20;
	} else if (position.indexOf('below') >= 0) {
		top = top + 8;
	} else {
		top = top - height / 2 + 10;
	}
	if (position.indexOf('left') >= 0) {
		if (position.indexOf('center') >= 0) {
			left = left - 395;
		} else {
			left = left - 365;
		}
	} else if (position.indexOf('right') >= 0) {
		if (position.indexOf('center') >= 0) {
			left = left + 12;
		} else {
			left = left - 15;
		}
	} else {
		left = left - 190;
	}
	if (left < 0) left = 0;
	if (top < 0) top = 0;
	popup.style.top = top + 'px';
	popup.style.left = left + 'px';
	popup.className = 'popup_shown';
}
function popup_hide(point, popup) {
	//--- re-start rotation animation on point
	var image = null;
	for (var i=0; i<point.childNodes.length; i++) {
		if (point.childNodes[i].className) {
			if (point.childNodes[i].className.toLowerCase() == 'popup_rotate_stopped') {
				image = point.childNodes[i];
				break;
			}
		}
	}
	if (image == null) return;
	image.className = 'popup_rotate';
	//--- reset zIndex
	point.style.zIndex = 1000;
	//--- clear any remaining enlarged image
	popup_clearEnlargedImage();
	//--- stop voice-over if any
	var voiceover = popup.getAttribute('voiceover');
	if (voiceover != null) {
		if (voiceover.length > 4) stopAudio();
	}
	//--- hide popup
	popup.className = 'popup';
	//--- clear reference to the current point and popup div
	popup_currentPoint = null;
	popup_currentPopup = null;
}
function popup_enlargeImage(imageID, enlargedSrc) {
	//--- find the popup enclosing the image
	var popup = document.getElementById(imageID);
	if (popup == null) return;
	while (popup.tagName.toLowerCase() != 'div') {
		popup = popup.parentNode;
	}
	if (popup != popup_currentPopup) return;
	//--- find the image to enlarge
	var image = document.getElementById(imageID);
	var top = getTop(image);
	var left = getLeft(image);
	var width = getWidth(image);
	var height = getHeight(image);
	//--- create enlarged image and apply zoom in animation to it
	var enlarged = document.createElement('IMG');
	enlarged.src = enlargedSrc;
	enlarged = document.body.appendChild(enlarged);
	enlarged.id = 'popup_enlarged';
	enlarged.style.top = top + 'px';
	enlarged.style.left = left + 'px';
	enlarged.style.width = width + 'px';
	enlarged.style.height = height + 'px';
	enlarged.className = 'popup_enlarged';
	enlarged.addEventListener('click', popup_clearEnlargedImage, false);
}
function popup_clearEnlargedImage() {
	var image = document.getElementById('popup_enlarged');
	if (image == null) return;
	image.parentNode.removeChild(image);
}
