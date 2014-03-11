
$(document).ready (function () {
	//dom ready

	$('nav.subnavi ul li').not('.active').each ( function () {
		$(this).addClass('pointer');
		$(this).click ( function() {
			var tgt = $(this).data('target');
			//console.log(tgt);
			//console.log(subnaviLinks[tgt]);
			window.location.href = subnaviLinks[tgt];
		});
	});
});