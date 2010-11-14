/*
 * nyroModal v2.alpha
 * 
 * SWF filter
 * 
 * Depends:
 * - filters.link
 * 
 * Before: filters.image
 */
jQuery(function($, undefined) {
	$.nmFilters({
		swf: {
			is: function(nm) {
				return nm._hasFilter('link') && nm.opener.is('[href$=.swf]');
			},
			init: function(nm) {
				nm.loadFilter = 'swf';
			},
			load: function(nm) {
				var url = nm.store.link.url,
					cont = '<div><object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+nm.sizes.w+'" height="'+nm.sizes.h+'"><param name="movie" value="'+url+'"></param>',
					tmp = '';
				$.each(nm.swf, function(name, val) {
					cont+= '<param name="'+name+'" value="'+val+'"></param>';
					tmp+= ' '+name+'="'+val+'"';
				});
				cont+= '<embed src="'+url+'" type="application/x-shockwave-flash" width="'+nm.sizes.w+'" height="'+nm.sizes.h+'"'+tmp+'></embed></object></div>';
				nm._setCont(cont);
			}
		}
	});
});