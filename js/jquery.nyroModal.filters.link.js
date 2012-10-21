/*
 * nyroModal v2.0.0
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
				nm.opener.off('click.nyroModal').on('click.nyroModal', function(e) {
					e.preventDefault();
					nm.opener.trigger('nyroModal');
				});
			},
			load: function(nm) {
				$.ajax($.extend(true, {}, nm.ajax || {}, {
					url: nm.store.link.url,
					data: nm.store.link.sel ? [{name: nm.selIndicator, value: nm.store.link.sel.substring(1)}] : undefined,
					success: function(data) {
						nm._setCont(data, nm.store.link.sel);
					},
					error: function(jqXHR) {
						nm._error(jqXHR);
					}
				}));
			},
			destroy: function(nm) {
				nm.opener.off('click.nyroModal');
			}
		}
	});
});