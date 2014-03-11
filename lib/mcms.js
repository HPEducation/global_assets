/*
  mcms.js
  MCMS Compatibility JavaScript Library for ePUB 3.0 Content
  Version: 1.1
  Last Updated On: 28 March 2013
  Created and maintained by Lewis Yang (lewisyang@stee.stengg.com)
  Copyright (C) 2012-2013 ST Electronics (Training & Simulation Systems) Pte Ltd. All rights reserved.
*/

var mcms_video_loop = false;
var mcms_video_file = null;
var mcms_video_x = 0;
var mcms_video_y = 0;
var mcms_video_width = 0;
var mcms_video_height = 0;

function playAudio(file) {
	if (typeof UIWebView === "undefined") {
		var audio = document.getElementById('mcms_audio');
		if (audio != undefined) {
			stopAudio();
			stopVideo();
		} else {
			audio = document.createElement('audio');
			audio.id = 'mcms_audio';
			document.body.appendChild(audio);
		}
		audio.src = file;
		audio.load();
		audio.play();
	} else {
		// UIWebView.playAudio(String audioURL, final boolean autoStarted, final boolean enableCompletionFeedback);
		UIWebView.playAudio(file, false, false);
	}
}

function playAudioMixed(file) {
	if (typeof UIWebView === "undefined") {
		var audio = document.getElementById('mcms_audio');
		if (audio != undefined) {
			stopAudio();
		} else {
			audio = document.createElement('audio');
			audio.id = 'mcms_audio';
			document.body.appendChild(audio);
		}
		audio.src = file;
		audio.load();
		audio.play();
	} else {
		// UIWebView.playAudioMixed(String audioURL);
		UIWebView.playAudioMixed(file);
	}
}

function stopAudio() {
	if (typeof UIWebView === "undefined") {
		var audio = document.getElementById('mcms_audio');
		if (audio != undefined) {
			audio.pause();
		}
	} else {
		UIWebView.stopAudio();
	}
}

function playVideoOnce(file,x,y,width,height) {
	mcms_video_loop = false;
	//--- video tag destroyed automatically on video playback completion
	if (typeof UIWebView === "undefined") {
		stopAudio();
		stopVideo();
		var video = document.createElement('video');
		video.id = 'mcms_video';
		video.style.position = 'absolute';
		video.style.top = y + 'px';
		video.style.left = x + 'px';
		video.style.width = width + 'px';
		video.style.height = height + 'px';
		video.style.backgroundColor = 'black';
		document.body.appendChild(video);
		//video.addEventListener("click", stopVideo, false);
		video.src = file;
		video.controls = true;
		video.load();
		video.play()
	} else {
		//--- create a black click-able holder: once clicked video will be toggled into full-screen mode
		var obj = document.getElementById('mcms_video');
		if (obj != undefined) {
			document.body.removeChild(obj);
		}
		obj = document.createElement('div');
		obj.id = 'mcms_video';
		obj.style.position = 'absolute';
		obj.style.display = 'block';
		obj.style.top = y + 'px';
		obj.style.left = x + 'px';
		obj.style.width = width + 'px';
		obj.style.height = height + 'px';
		obj.style.backgroundColor = 'black';
		document.body.appendChild(obj);
		obj.addEventListener("click", enterFullscreenVideo, false);
		//--- play video in MCMS
		//UIWebView.playVideoEmbedded(String videoURL, final int x, final int y, final int width, final int height, final boolean autoStarted, final boolean enableController, final boolean enableCompletionFeedback);
		UIWebView.playVideoEmbedded(file,x,y,width,height,false,false,true);
	}
}

function replayVideo() {
	if (typeof UIWebView === "undefined") {
		var video = document.getElementById('mcms_video');
		if (video != null) {
			video.play();
		}
	}
}

function playVideoLoop(file,x,y,width,height) {
	mcms_video_loop = true;
	mcms_video_file = file;
	mcms_video_x = x;
	mcms_video_y = y;
	mcms_video_width = width;
	mcms_video_height = height;
	if (typeof UIWebView === "undefined") {
		stopVideo();
		var video = document.createElement('video');
		video.id = 'mcms_video';
		video.style.position = 'absolute';
		video.style.top = y + 'px';
		video.style.left = x + 'px';
		video.style.width = width + 'px';
		video.style.height = height + 'px';
		video.style.backgroundColor = 'black';
		document.body.appendChild(video);
		video.addEventListener("ended", replayVideo, false);			
		video.src = file;
		video.controls = true;
		video.load();
		video.play()
	} else {
		//--- create a black click-able holder: once clicked video will be toggled into full-screen mode
		var obj = document.getElementById('mcms_video');
		if (obj != undefined) {
			document.body.removeChild(obj);
		}
		obj = document.createElement('div');
		obj.id = 'mcms_video';
		obj.style.position = 'absolute';
		obj.style.display = 'block';
		obj.style.top = y + 'px';
		obj.style.left = x + 'px';
		obj.style.width = width + 'px';
		obj.style.height = height + 'px';
		obj.style.backgroundColor = 'black';
		document.body.appendChild(obj);
		//obj.addEventListener("click", enterFullscreenVideo, false);
		//--- play video in MCMS
		//UIWebView.playVideoLoop(String videoURL, final int x, final int y, final int width, final int height);
		UIWebView.playVideoLoop(file,x,y,width,height);
	}
}

function stopVideo() {
	var video = document.getElementById('mcms_video');
	if (video != undefined) {
		if (video.tagName.toLowerCase() != 'div') {
			video.pause();
		}
		document.body.removeChild(video);
	}
	if (typeof UIWebView !== "undefined") {
		UIWebView.stopVideo();
	}
}

function enterFullscreenVideo() {
	var video = document.getElementById('mcms_video');
	if (video != undefined) {
		// do nothing
	}
	if (typeof UIWebView !== "undefined") {
		UIWebView.enterFullscreenVideo();
	}
}

function UIWebView_Feedback_VideoFinished() {
	stopVideo();
	if (mcms_video_loop) {
		playVideoLoop(mcms_video_file, mcms_video_x, mcms_video_y, mcms_video_width, mcms_video_height);
	}
}

function UIWebView_Feedback_AudioFinished() {
	stopAudio();
}

function enableScroll() {
	if (typeof UIWebView === "undefined") {
		// do nothing
	} else {
		// UIWebView.enableScroll();
		UIWebView.enableScroll();
	}
}

function disableScroll() {
	if (typeof UIWebView === "undefined") {
		// do nothing
	} else {
		// UIWebView.disableScroll();
		UIWebView.disableScroll();
	}
}

function showMessage(title, msg, buttonText) {
	if (typeof UIWebView === "undefined") {
		alert(title + '\n\n' + msg);
	} else {
		UIWebView.showMessage(title, msg, buttonText);
	}
}

function showToast(msg) {
	if (typeof UIWebView === "undefined") {
		// do nothing
	} else {
		UIWebView.showToast(msg);
	}
}