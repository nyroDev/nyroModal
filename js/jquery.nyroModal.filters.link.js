/*
 * nyroModal v2.alpha
 * 
 * Link filter
 * 
 * Depends:
 * 
 * Before: filters.gallery
 */
jQuery(function($, undefined) {
	$.nmFilters({
		link: {
			is: function(nm) {
				var ret = nm.opener.is('[href]');
				if (ret)
					nm.store.link = nm.getInternal()._extractUrl(nm.opener.attr('href'));
				return ret;
			},
			init: function(nm) {
				nm.loadFilter = 'link';
				nm.opener.unbind('click.nyroModal').bind('click.nyroModal', function(e) {
					e.preventDefault();
					nm.opener.trigger('nyroModal');
				});
			},
			load: function(nm) {
				$.ajax({
					url: nm.store.link.url,
					success: function(data) {
						nm._setCont(data, nm.store.link.sel);
					},
					error: function() {
						nm._error();
					}
				});
			}
		}
	});
});