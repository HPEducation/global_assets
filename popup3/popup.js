var currentPopup = '';

function showPopup (id) {
	//console.log("show: " + id);
	//detach
	returnPrevElement();
	$("#jPosMarker").detach().insertAfter(id);

	var element = $(id).detach();
	$(".jlightbox .overlayInnerWrapper").empty().append(element);

	$(id).fadeIn();
	$(".jlightbox").fadeIn();

	$(id + ' .evtvosync').each(function() {
		var d = parseInt($(this).data('delay'));
		if (isNaN(d)) d = 0;
		syncWithVo($(this), d);
	});

	if (typeof onShowPopup !== 'undefined') onShowPopup(id);
	currentPopup = id;

	//reinit popcontent height to detech height changes
	//height was null when it was display none
	if ($(id + ' .popcontent').hasClass('scroll-pane')) {
		if (parseFloat($(id + ' .scroll-pane').css('height')) == 0) {
			var maxHeight = $(id + ' .scroll-pane').css('max-height');
			if (parseFloat(maxHeight) == 0 || maxHeight == 'none') {
				$(id + ' .scroll-pane').css('height', '100px');
				console.log(id + ' .scroll-pane needs a height/max-height');
			} else {
				$(id + ' .scroll-pane').css('height', maxHeight);
			}
		}
		
		var pane = $(id + ' .scroll-pane');
		var api = pane.data('jsp');
		api.reinitialise();
	}
}

function hidePopup (id) {
	$(id).hide();
	$(".jlightbox").hide();
	clearAllTImers();
	if (typeof onClosePopup !== 'undefined') onClosePopup(id);
	returnPrevElement ();
}

function returnPrevElement () {
	if (currentPopup != '') {
		$(currentPopup).detach().insertAfter("#jPosMarker");
		currentPopup = '';
		$("body").append($("#jPosMarker").detach());
	}
}
	
$(document).ready (function () {
	//dom ready
	if ($(".jlightbox").length > 0) {
		//console.log("yes");
	} else {
		//console.log("no");
		$("body").append("<div class='jlightbox'><div class='overlay'></div><div class='overlayWrapper'><div class='overlayInnerWrapper'></div></div></div><div id='jPosMarker'></div>")
	}

	$('.popup').hide();

	$('.popup:not(.noclosebtn)').append("<div class='closebtn'></div>");

	$('.closebtn').addClass('pointer');

	$('.closebtn').click (function () {
		hidePopup(currentPopup);
	});

	$(".overlay").click(function() {
		if (typeof currentPopup !== 'undefined' && currentPopup != '') {
			hidePopup(currentPopup);
		}
	});
});
