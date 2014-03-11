/* last edited by jin 2013.06.13 4.57pm */

window.lib = {};

if (!window.console) console = ﻿{log: function() {}};

function debug (data) {
	if( console && console.log ) {
    	console.log(data);
	}	
}

(function ( $ ) {
	$.fn.classList = function() {
		var c = this.attr('class');
		if (typeof c === "undefined") return undefined;
		return this.attr('class').split(/\s+/);
	};
}( jQuery ));

var getCSS = function (prop, fromClass) {
	var $inspector = $("<div>").css('display', 'none').addClass(fromClass);
    $("body").append($inspector); // add to DOM, in order to read the CSS property
    try {
        return $inspector.css(prop);
    } finally {
        $inspector.remove(); // and remove from DOM
    }
};

var showDebugBox = false;

function debugMsg (msg) {
	if (typeof msg === 'undefined') return;
	
	var mydiv = document.getElementById('debugBox');
	if (mydiv == null || showDebugBox == false) {
		console.log(msg);
	} else {
		mydiv.innerHTML = mydiv.innerHTML + ' ' + msg + '<br />';
	}
	
}

function enableDebug (b) {
	if (typeof b === 'undefined') b = true;
	if (b) {
		if (document.getElementById('debugBox') == null) {
			var div = document.createElement('div');
			div = document.body.appendChild(div);	
			div.style.position = 'fixed';
			div.style.zIndex = 9999;
			div.style.top = '0px';
			div.style.right = '0px';
			div.style.width = '320px';
			div.style.backgroundColor = 'black';
			div.style.color = 'white';
			div.style.maxHeight = '200px';
			div.style.overflow = 'auto';
			div.style.padding = '10px';
			div.id = 'debugBox';
		}
		$('#debugBox').show();
	} else {
		if (document.getElementById('debugBox') != null) $('#debugBox').hide();
	}
	
	showDebugBox = b;
}

window.mobilecheck = function() {
var check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
return check; }

function detectmob() { 
	if( navigator.userAgent.match(/Android/i)
	 || navigator.userAgent.match(/webOS/i)
	 || navigator.userAgent.match(/iPhone/i)
	 || navigator.userAgent.match(/iPad/i)
	 || navigator.userAgent.match(/iPod/i)
	 || navigator.userAgent.match(/BlackBerry/i)
	 || navigator.userAgent.match(/Windows Phone/i)
 	) {
		return true;
	} else {
		return false;
	}
}

var isMobile = detectmob();

debugMsg("is mobile: " + isMobile);

var isUIWebView = false;

if (typeof UIWebView !== "undefined") {
	isUIWebView = true;
}

var voDelayArray = [];

function syncWithVo (id, d) {
	if (typeof id === 'undefined') return;
	if (typeof d === 'undefined') d= 0;

	var voDelayId = voDelayArray.length;
	
	$(id).css('opacity', 0);
	window['timer'+voDelayId] = setTimeout (function(e) {
		console.log('VO Sync: ' + id + ', ' + e.get(0).outerHTML);
		$(e).animate({opacity:1}, 500, function() {
			//oncomplete 
		});
	}, d, $(id));
	voDelayArray.push(window['timer'+voDelayId]);
	voDelayId++;
}

function clearAllTImers () {
	for (i=0; i<voDelayArray.length; i++) {
		clearTimeout(voDelayArray[i]);
	}
	voDelayArray=[];
}

function playVo (u) {
	if (typeof u === 'undefined') return;
	stopAudio();
	playAudio(u);
}

var videoLoaded = false;

lib.videoInit = function () {
	//init, redefine in document
}
lib.videoEnded = function () {
	//init, redefine in document
}
lib.videoPaused = function () {
	//init, redefine in document
}
lib.videoPlayed = function () {
	//init, redefine in document
}
lib.videoStopped = function () {
	//init, redefine in document
}

var videoContainerHolder;

function playVideo (path, obj) {
	videoLoaded = false;
	if (typeof path === 'undefined') return;
	if (typeof obj === 'undefined') obj = {};
	if (typeof obj.container !== 'undefined' && obj.container != null) {
		var tgtContainer = $(obj.container);
		var offset = tgtContainer.offset();
		var tgtX = offset.left + parseInt(tgtContainer.css('borderLeftWidth'),10) + parseInt(tgtContainer.css('paddingLeft'),10);
		var tgtY = offset.top + parseInt(tgtContainer.css('borderTopWidth'),10) + parseInt(tgtContainer.css('paddingTop'),10);
		var tgtW = tgtContainer.width();
		var tgtH = tgtContainer.height();
		debugMsg(tgtContainer + ': ' + tgtX + ' ' + tgtY + ', ' +tgtW + ' ' + tgtH);
	} else {
		debugMsg('container not found: ' + obj.container + ', using values');
		var tgtX = parseFloat(obj.x);
		var tgtY = parseFloat(obj.y);
		if (isNaN(tgtX)) {
			tgtX = 0;
		}
		if (isNaN(tgtY)) {
			tgtY = 0;
		}
		var tgtW = obj.width;
		var tgtH = obj.height;
	}

	if (isUIWebView || typeof obj.container === 'undefined' || obj.container == null) {
		if (obj.loop) {
			playVideoLoop(path, tgtX, tgtY, tgtW, tgtH);
			debugMsg(UIWebView.playVideoLoop);
		} else {
			playVideoOnce(path, tgtX, tgtY, tgtW, tgtH);
			debugMsg(UIWebView.playVideoEmbedded);
		}
	} else {
		stopAudio();
		stopVideo2();
		var video = document.createElement('video');
		video.id = 'mcms_video';
		video.style.position = 'relative';
		//video.style.top = y + 'px';
		//video.style.left = x + 'px';
		video.style.width = tgtW + 'px';
		video.style.height = tgtH + 'px';
		video.style.backgroundColor = 'black';
		var tgtContainer = $(obj.container);
		videoContainerHolder = $(obj.container).find('*').detach();
		$(obj.container).empty();
		obj.container.appendChild(video);
		video.src = path;
		video.controls = true;
		video.load();
		video.play();
		if (obj.loop) {
			video.addEventListener("ended", function () {
				var video = document.getElementById('mcms_video');
				if (video != null) {
					video.play();
				}
			}, false);
		}
	}

	var video = document.getElementById("mcms_video");
	video.removeEventListener("loadedmetadata");
	video.addEventListener("loadedmetadata", function() {
		lib.videoInit();
		var t = obj.startTime;
		if (typeof t === 'undefined') {
			t = 0;
		}
		videoSeekToTime(t);
	}, false);
	video.addEventListener("ended", function() {
		lib.videoEnded();
	}, false);
}

function videoSeekToTime (t) {
	var video = document.getElementById('mcms_video');

	if (video != null) {
		if (t < 0 || t > video.duration) return;
		video.currentTime = t;
		video.play();
		lib.videoPlayed();
	}
}

function pauseVideo () {
	var video = document.getElementById('mcms_video');

	video.pause();
	lib.videoPaused();
}

function resumeVideo () {
	var video = document.getElementById('mcms_video');

	video.play();
	lib.videoPlayed();
}

function stopVideo2 () {
	if (isUIWebView) {
		stopVideo();
	} else {
		$('#mcms_video').parent().empty().append(videoContainerHolder);
	}

	lib.videoStopped();
}