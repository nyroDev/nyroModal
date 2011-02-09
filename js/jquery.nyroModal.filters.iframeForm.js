/*
 * nyroModal v2.0.0
 * 
 * Iframe form filter
 * 
 * Depends:
 * - filters.iframe
 * 
 * Before: filters.iframe
 */
jQuery(function($, undefined) {
	$.nmFilters({
		iframeForm: {
			is: function(nm) {
				var ret = nm._hasFilter('iframe') && nm.opener.is('form');
				if (ret) {
					nm._delFilter('iframe');
					nm._delFilter('form');
				}
				return ret;
			},
			init: function(nm) {
				nm.loadFilter = 'iframeForm';
				nm.store.iframeFormLoading = false;
				nm.store.iframeFormOrgTarget = nm.opener.attr('target');
				nm.opener.unbind('submit.nyroModal').bind('submit.nyroModal', function(e) {
					if (!nm.store.iframeFormIframe) {
						e.preventDefault();
						nm.opener.trigger('nyroModal');
					} else {
						nm.store.iframeFormLoading = true;
					}
				});
			},
			load: function(nm) {
				nm.store.iframeFormIframe = $('<iframe name="nyroModalIframeForm" src="javascript:\'\';" id="nyromodal-iframe-'+(new Date().getTime())+'"></iframe>');
				nm._setCont(nm.store.iframeFormIframe);
			},
			afterShowCont: function(nm) {
				nm.opener
					.attr('target', 'nyroModalIframeForm')
					.submit();
			},
			close: function(nm) {
				nm.store.iframeFormOrgTarget ? nm.opener.attr('target', nm.store.iframeFormOrgTarget) : nm.opener.removeAttr('target');
				delete(nm.store.formFileLoading);
				delete(nm.store.iframeFormOrgTarget);
				if (nm.store.iframeFormIframe) {
					nm.store.iframeFormIframe.remove();
					nm.store.iframeFormIframe = undefined;
					delete(nm.store.iframeFormIframe);
				}
			}
		}
	});
});