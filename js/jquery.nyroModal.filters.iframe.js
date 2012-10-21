/*
 * nyroModal v2.0.0
 * 
 * Iframe filter
 * 
 * Depends:
 * - filters.link
 * 
 * Before: filters.formFile
 */
jQuery(function($, undefined) {
	$.nmFilters({
		iframe: {
			is: function(nm) {
				var	target = nm.opener.attr('target') || '',
					rel = nm.opener.attr('rel') || '',
					opener = nm.opener.get(0);
				return !nm._hasFilter('image') && (target.toLowerCase() == '_blank'
					|| rel.toLowerCase().indexOf('external') > -1
					|| (opener.hostname && opener.hostname.replace(/:\d*$/,'') != window.location.hostname.replace(/:\d*$/,'')));
			},
			init: function(nm) {
				nm.loadFilter = 'iframe';
			},
			load: function(nm) {
				nm.store.iframe = $('<iframe />')
					.attr({
						src: 'javascript:\'\';',
						id: 'nyromodal-iframe-'+(new Date().getTime()),
						frameborder: '0'
					});
				nm._setCont(nm.store.iframe);
			},
			afterShowCont: function(nm) {
				nm.store.iframe.attr('src', nm.opener.attr('href'));
			},
			close: function(nm) {
				if (nm.store.iframe) {
					nm.store.iframe.remove();
					nm.store.iframe = undefined;
					delete(nm.store.iframe);
				}
			}
		}
	});
});