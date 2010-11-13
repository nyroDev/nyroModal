/*
 * nyroModal v2.alpha
 *
 */
jQuery(function($, undefined) {
	$.nmFilters({
		/*
			depends:
				- filters.link
		*/
		dom: {
			is: function(nm) {
				return nm._hasFilter('link') && !nm.store.link.url && nm.store.link.sel;
			},
			init: function(nm) {
				nm.loadFilter = 'dom';
			},
			load: function(nm) {
				nm.store.domEl = $(nm.store.link.sel);
				if (nm.store.domEl.length)
					nm._setCont(nm.store.domEl.contents());
				else
					nm._error();
			},
			close: function(nm) {
				if (nm.store.domEl && nm.elts.cont)
					nm.store.domEl.append(nm.elts.cont.find('.nyroModalDom').contents());
			}
		}
	});
});