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
				nm.opener.off('submit.nyroModal').on('submit.nyroModal', function(e) {
					e.preventDefault();
					nm.opener.trigger('nyroModal');
				});
			},
			load: function(nm) {
				var data = {};
				$.map(nm.opener.serializeArray(), function(d){
					data[d.name] = d.value;
				});
				if (nm.store.form.sel)
					data[nm.selIndicator] = nm.store.form.sel.substring(1);

				var ajax = $.extend(true, { type : 'get', dataType : 'text' }, nm.ajax || {}, {
					url: nm.store.form.url,
					data: data,
					type: nm.opener.attr('method') ? nm.opener.attr('method') : undefined,
					success: function(data) {
						nm._setCont(data, nm.store.form.sel);
					},
					error: function(jqXHR) {
						nm._error(jqXHR);
					}
				});

				$.ajax(ajax);
			},
			destroy: function(nm) {
				nm.opener.off('submit.nyroModal');
			}
		}
	});
});