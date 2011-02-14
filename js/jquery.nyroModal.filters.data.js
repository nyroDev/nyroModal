/*
 * nyroModal v2.0.0
 * 
 * Data filter
 * 
 * Depends:
 * - filters.link
 * 
 * Before: filters.dom
 */
jQuery(function($, undefined) {
	$.nmFilters({
		data: {
			is: function(nm) {
				var ret = nm.data ? true : false;
				if (ret) {
					nm._delFilter('dom');
				}
				return ret;
			},
			init: function(nm) {
				nm.loadFilter = 'data';
			},
			load: function(nm) {
				nm._setCont(nm.data);
			}
		}
	});
});