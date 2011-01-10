/*
 * nyroModal v2.0.0
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
				var data = nm.opener.serializeArray();
				if (nm.store.form.sel)
					data.push({name: nm.selIndicator, value: nm.store.form.sel.substring(1)});
				$.ajax({
					url: nm.store.form.url,
					data: data,
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