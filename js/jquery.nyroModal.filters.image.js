/*
 * nyroModal v2.0.0
 * 
 * Image filter
 * 
 * Depends:
 * - filters.link
 * 
 * Before: filters.data
 */
jQuery(function($, undefined) {
	$.nmFilters({
		image: {
			is: function(nm) {
				return (new RegExp(nm.imageRegex, 'i')).test(nm.opener.attr('href'));
			},
			init: function(nm) {
				nm.loadFilter = 'image';
			},
			load: function(nm) {
				var url = nm.opener.attr('href');
				$('<img />')
					.load(function() {
						nm.elts.cont.addClass('nyroModalImg');
						nm.elts.hidden.addClass('nyroModalImg');
						nm._setCont(this);
					}).error(function() {
						nm._error();
					})
					.attr('src', url);
			},
			size: function(nm) {
				if (nm.sizes.w != nm.sizes.initW || nm.sizes.h != nm.sizes.initH) {
					var ratio = Math.min(nm.sizes.w/nm.sizes.initW, nm.sizes.h/nm.sizes.initH);
					nm.sizes.w = nm.sizes.initW * ratio;
					nm.sizes.h = nm.sizes.initH * ratio;
				}
				var img = nm.loading ? nm.elts.hidden.find('img') : nm.elts.cont.find('img');
				img.attr({
					width: nm.sizes.w,
					height: nm.sizes.h
				});
			},
			close: function(nm) {
				if (nm.elts.cont) {
					nm.elts.cont.removeClass('nyroModalImg');
					nm.elts.hidden.removeClass('nyroModalImg');
				}
			}
		}
	});
});