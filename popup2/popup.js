var currentPopup = '';

function showPopup (id) {
	//console.log("show: " + id);
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
	currentPopup = '';
}
	
$(document).ready (function () {
	//dom ready
	$('.closebtn').addClass('pointer');

	$('.closebtn').click (function () {
		hidePopup($(this).parent());
	});

	$(".overlay").click(function() {
		if (typeof currentPopup !== 'undefined' && currentPopup != '') {
			hidePopup(currentPopup);
		}
	});
});