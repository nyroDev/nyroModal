/*
 * nyroModal v2.0.0
 * 
 * Youtube filter
 * 
 * Depends:
 * - filters.link
 * 
 * Before: filters.embedly
 */
jQuery(function($, undefined) {
	$.nmFilters({
		youtube: {
			is: function(nm) {
				if (nm._hasFilter('link') && nm._hasFilter('iframe') && nm.opener.attr('href').indexOf('www.youtube.com/watch?v=') > -1) {
					nm._delFilter('iframe');
					return true;
				}
				return false;
			},
			init: function(nm) {
				nm.loadFilter = 'youtube';
			},
			load: function(nm) {
				nm.store.youtubeIframe = $('<iframe />')
					.attr({
						src: 'javascript:\'\';',
						id: 'nyromodal-iframe-'+(new Date().getTime()),
						frameborder: '0'
					});
				nm._setCont(nm.store.youtubeIframe);
			},
			afterShowCont: function(nm) {
				nm.store.youtubeIframe.attr('src', nm.opener.attr('href').replace(/watch\?v=/i, 'embed/'));
			},
			close: function(nm) {
				if (nm.store.youtubeIframe) {
					nm.store.youtubeIframe.remove();
					nm.store.youtubeIframe = undefined;
					delete(nm.store.youtubeIframe);
				}
			}
		}
	});
});