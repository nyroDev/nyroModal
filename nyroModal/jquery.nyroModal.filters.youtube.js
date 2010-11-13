/*
 * nyroModal v2.alpha
 *
 */
jQuery(function($, undefined) {
	$.nmFilters({
		/*
			depends:
				- filters.swf
		*/
		youtube: {
			is: function(nm) {
				var ret = nm._hasFilter('link') && nm.opener.attr('href').indexOf('http://www.youtube.com/watch?v=') == 0;
				if (ret) {
					nm.filters.push('swf');
					nm._delFilter('iframe');
				}
				return ret;
			},
			initElts: function(nm) {
				nm.store.link.url = nm.store.link.url.replace(new RegExp("watch\\?v=", "i"), 'v/')+'&fs=1';
				nm.sizes.w = 480;
				nm.sizes.h = 385;
			}
		}
	});
});