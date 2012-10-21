/*
 * nyroModal v2.0.0
 * 
 * Dom filter
 * 
 * Depends:
 * - filters.link
 * 
 * Before: filters.link
 */
jQuery(function($, undefined) {
	$.nmFilters({
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
					nm._setCont(nm.domCopy ? nm.store.domEl.html() : nm.store.domEl.contents());
				else
					nm._error();
			},
			close: function(nm) {
				if (!nm.domCopy && nm.store.domEl && nm.elts.cont)
					nm.store.domEl.append(nm.elts.cont.find('.nyroModalDom').contents());
			}
		}
	});
});