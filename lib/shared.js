function getLeft(obj) {
    var left = obj.offsetLeft;
    var p = obj.offsetParent;
    while (p) {
        left += p.offsetLeft;
        p = p.offsetParent;
    }
    var paddingLeft = parseInt(window.getComputedStyle(obj, null).getPropertyValue('padding-left'));
    return left + paddingLeft;
}

function getTop(obj) {
    var top = obj.offsetTop;
    var p = obj.offsetParent;
    while (p) {
        top += p.offsetTop;
        p = p.offsetParent;
    }
    var paddingTop = parseInt(window.getComputedStyle(obj, null).getPropertyValue('padding-top'));
    return top + paddingTop;
}

function getWidth(obj) {
	var paddingLeft = parseInt(window.getComputedStyle(obj, null).getPropertyValue('padding-left'));
    var paddingRight = parseInt(window.getComputedStyle(obj, null).getPropertyValue('padding-right'));
	return obj.offsetWidth - paddingLeft - paddingRight;
}

function getHeight(obj) {
	var paddingTop = parseInt(window.getComputedStyle(obj, null).getPropertyValue('padding-top'));
    var paddingBottom = parseInt(window.getComputedStyle(obj, null).getPropertyValue('padding-bottom'));
	return obj.offsetHeight - paddingTop - paddingBottom;
}

function attachPrefixedEvent(element, type, callback) {
	var pfx = ["webkit", "moz", "MS", "o", ""];
	for (var p = 0; p < pfx.length; p++) {
		if (!pfx[p]) type = type.toLowerCase();
		element.addEventListener(pfx[p]+type, callback, false);
	}
}

function removePrefixedEvent(element, type, callback) {
	var pfx = ["webkit", "moz", "MS", "o", ""];
	for (var p = 0; p < pfx.length; p++) {
		if (!pfx[p]) type = type.toLowerCase();
		element.removeEventListener(pfx[p]+type, callback, false);
	}
}

function hitTestOnImage(image, x, y, origin_x, origin_y, size_width, size_height, image_width, image_height) {
	//--- returns true if point (x,y) is in region bounded by points: top left (origin_x, origin_y) and bottom right (origin_x + size_width, origin_y + size_height)
	var local_x = parseFloat(x - getLeft(image)) / parseFloat(getWidth(image));
	var local_y = parseFloat(y - getTop(image)) / parseFloat(getHeight(image));
	var left = parseFloat(origin_x) / parseFloat(image_width);
	var top = parseFloat(origin_y) / parseFloat(image_height);
	var right = parseFloat(origin_x + size_width) / parseFloat(image_width);
	var bottom = parseFloat(origin_y + size_height) / parseFloat(image_height);
	var result = false;
	if (local_x >= left && local_x <= right && local_y >= top && local_y <= bottom) result = true;
	return result;
}