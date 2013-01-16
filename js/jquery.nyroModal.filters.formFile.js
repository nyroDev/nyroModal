/*
 * nyroModal v2.0.0
 * 
 * Form file filter
 * 
 * Depends:
 * 
 * Before: filters.form
 */
jQuery(function($, undefined) {
	$.nmFilters({
		formFile: {
			is: function(nm) {
				var ret = nm.opener.is('form[enctype="multipart/form-data"]');
				if (ret) {
					nm._delFilter('form');
					if (!nm.store.form)
						nm.store.form = nm.getInternal()._extractUrl(nm.opener.attr('action'));
				}
				return ret;
			},
			init: function(nm) {
				nm.loadFilter = 'formFile';
				nm.store.formFileLoading = false;
				nm.opener.off('submit.nyroModal').on('submit.nyroModal', function(e) {
					if (!nm.store.formFileIframe) {
						e.preventDefault();
						nm.opener.trigger('nyroModal');
					} else {
						nm.store.formFileLoading = true;
					}
				});
			},
			initElts: function(nm) {
				var inputSel;
				if (nm.store.form.sel)
					inputSel = $('<input type="hidden" />', {
						name: nm.selIndicator,
						value: nm.store.form.sel.substring(1)
					}).appendTo(nm.opener);
				function rmFormFileElts() {
					if (inputSel) {
						inputSel.remove();
						inputSel = undefined;
						delete(inputSel);
					}
					nm.store.formFileIframe.attr('src', 'about:blank').remove();
					nm.store.formFileIframe = undefined;
					delete(nm.store.formFileIframe);
				}
				nm.store.formFileIframe = $('<iframe />')
					.attr({
						name: 'nyroModalFormFile',
						src: 'javascript:\'\';',
						id: 'nyromodal-iframe-'+(new Date().getTime()),
						frameborder: '0'
					})
					.hide()
					.load(function() {
						if (nm.store.formFileLoading) {
							nm.store.formFileLoading = false;
							var content = nm.store.formFileIframe
									.off('load error')
									.contents().find('body').not('script[src]');
							if (content && content.html() && content.html().length) {
								rmFormFileElts();
								nm._setCont(content.html(), nm.store.form.sel);
							} else {
								// Not totally ready, try it in a few secs
								var nbTry = 0,
									fct = function() {
										nbTry++;
										var content = nm.store.formFileIframe
												.off('load error')
												.contents().find('body').not('script[src]');
										if (content && content.html() && content.html().length) {
											nm._setCont(content.html(), nm.store.form.sel);
											rmFormFileElts();
										} else if (nbTry < 5) {
											setTimeout(fct, 25);
										} else {
											rmFormFileElts();
											nm._error();
										}
									};
								setTimeout(fct, 25);
							}
						}
					})
					.on('error', function() {
						rmFormFileElts();
						nm._error();
					});
				nm.elts.all.append(nm.store.formFileIframe);
				nm.opener
					.attr('target', 'nyroModalFormFile')
					.submit();
			},
			close: function(nm) {
				nm.store.formFileLoading = false;
				if (nm.store.formFileIframe) {
					nm.store.formFileIframe.remove();
					nm.store.formFileIframe = undefined;
					delete(nm.store.formFileIframe);
				}
			},
			destroy: function(nm) {
				nm.opener.off('submit.nyroModal')
			}
		}
	});
});