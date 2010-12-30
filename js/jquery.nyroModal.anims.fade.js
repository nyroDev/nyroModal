/*
 * nyroModal v2.0.0
 * 
 * Fade animations
 * 
 * Depends:
 * 
 */
jQuery(function($, undefined) {
	$.nmAnims({
		fade: {
			showBg: function(nm, clb) {
				nm.elts.bg.fadeTo(250, 0.7, clb);
			},
			hideBg: function(nm, clb) {
				nm.elts.bg.fadeOut(clb);
			},
			showLoad: function(nm, clb) {
				nm.elts.load.fadeIn(clb);
			},
			hideLoad: function(nm, clb) {
				nm.elts.load.fadeOut(clb);
			},
			showCont: function(nm, clb) {
				nm.elts.cont.fadeIn(clb);
			},
			hideCont: function(nm, clb) {
				nm.elts.cont.css('overflow', 'hidden').fadeOut(clb);
			},
			showTrans: function(nm, clb) {
				nm.elts.load
					.css({
						position: nm.elts.cont.css('position'),
						top: nm.elts.cont.css('top'),
						left: nm.elts.cont.css('left'),
						width: nm.elts.cont.css('width'),
						height: nm.elts.cont.css('height'),
						marginTop: nm.elts.cont.css('marginTop'),
						marginLeft: nm.elts.cont.css('marginLeft')
					})
					.fadeIn(function() {
						nm.elts.cont.hide();
						clb();
					});
			},
			hideTrans: function(nm, clb) {
				nm.elts.cont.css('visibility', 'hidden').show();
				nm.elts.load
					.css('position', nm.elts.cont.css('position'))
					.animate({
						top: nm.elts.cont.css('top'),
						left: nm.elts.cont.css('left'),
						width: nm.elts.cont.css('width'),
						height: nm.elts.cont.css('height'),
						marginTop: nm.elts.cont.css('marginTop'),
						marginLeft: nm.elts.cont.css('marginLeft')
					}, function() {
						nm.elts.cont.css('visibility', '');
						nm.elts.load.fadeOut(clb);
					});
			},
			resize: function(nm, clb) {
				nm.elts.cont.animate({
					width: nm.sizes.w,
					height: nm.sizes.h,
					top: (nm.getInternal().fullSize.viewH - nm.sizes.h - nm.sizes.hMargin)/2,
					left: (nm.getInternal().fullSize.viewW - nm.sizes.w - nm.sizes.wMargin)/2
				}, clb);
			}
		}
	});
	// Define fade aniamtions as default
	$.nmObj({anim: {def: 'fade'}});
});