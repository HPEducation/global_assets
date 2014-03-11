function storage_isSupported() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

function storage_getValue(key) {
	var value = '';
	if (typeof UIWebView === "undefined") {
		if (!storage_isSupported()) { return ''; }
		if (localStorage) {
			if (localStorage[key]) value = localStorage[key];
		}
	} else {
		// String UIWebView.retrieveValue(final String key)
		value = UIWebView.retrieveValue(key);
	}
	if (value == 'undefined') value = '';
	return value;
}

function storage_setValue(key, value) {
	value = value.replace('<', '&lt;');
	value = value.replace('>', '&gt;');
	if (typeof UIWebView === "undefined") {
		if (!storage_isSupported()) { return; }
		if (localStorage) {
			localStorage[key] = value;
		}
	} else {
		// UIWebView.saveValue(final String key, final String value)
		UIWebView.saveValue(key, value);
	}
}

function storage_getTextbox(parentDiv) {
	for (var i=0; i<parentDiv.childNodes.length; i++) {
		if (parentDiv.childNodes[i].tagName) {
			if (parentDiv.childNodes[i].tagName.toLowerCase() == 'textarea') {
				return parentDiv.childNodes[i];
			}
		}
	}
	return null;
}

function storage_saveTextbox(parentDiv) {
	var textbox = storage_getTextbox(parentDiv);
	if (textbox == null) return;
	var key = textbox.getAttribute('key');
	var value = textbox.value;
	storage_setValue(key, value);
}

function storage_createTextbox(parentDiv, key) {
	var textbox = storage_getTextbox(parentDiv);
	if (textbox == null) {
		textbox = document.createElement('TEXTAREA');
		textbox = parentDiv.appendChild(textbox);
		textbox.style.position = 'absolute';
		textbox.style.top = '0px';
		textbox.style.left = '0px';
		textbox.style.width = '100%';
		textbox.style.height = '100%';
	}
	textbox.setAttribute('key', key);
	textbox.value = storage_getValue(key);
}