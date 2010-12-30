/*
 * nyroModal v2.0.0
 * 
 * Title filter
 * 
 * Depends:
 * 
 * Before:
 */
jQuery(function($, undefined) {
	$.nmFilters({
		title: {
			is: function(nm) {
				return nm.opener.is('[title]');
			},
			beforeShowCont: function(nm) {
				var offset = nm.elts.cont.offset();
				nm.store.title = $('<h1 />', {
					text: nm.opener.attr('title')
				}).addClass('nyroModalTitle nmReposition');
				nm.elts.cont.prepend(nm.store.title);
			},
			close: function(nm) {
				if (nm.store.title) {
					nm.store.title.remove();
					nm.store.title = undefined;
					delete(nm.store.title);
				}
			}
		}
	});
});