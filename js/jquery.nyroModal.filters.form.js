/*
 * nyroModal v2.alpha
 * 
 * Form filter
 * 
 * Depends:
 * 
 * Before: filters.swf
 */
jQuery(function($, undefined) {
	$.nmFilters({
		form: {
			is: function(nm) {
				var ret = nm.opener.is('form');
				if (ret)
					nm.store.form = nm.getInternal()._extractUrl(nm.opener.attr('action'));
				return ret;
			},
			init: function(nm) {
				nm.loadFilter = 'form';
				nm.opener.unbind('submit.nyroModal').bind('submit.nyroModal', function(e) {
					e.preventDefault();
					nm.opener.trigger('nyroModal');
				});
			},
			load: function(nm) {
				$.ajax({
					url: nm.store.form.url,
					data: nm.opener.serializeArray(),
					type: nm.opener.attr('method') ? nm.opener.attr('method') : 'get',
					success: function(data) {
						nm._setCont(data, nm.store.form.sel);
					},
					error: function() {
						nm._error();
					}
				});
			}
		}
	});
});