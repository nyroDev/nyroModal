/*
 * nyroModal v2.0.0
 * 
 * Embedly filter
 * 
 * Depends:
 * - filters.link
 * 
 * Before: filters.iframeForm
 */
jQuery(function($, undefined) {
	$.nmObj({
		embedlyUrl: 'http://api.embed.ly/1/oembed',
		embedly: {
			key: undefined,
			wmode: 'transparent',
			allowscripts: true,
			format: 'json'
			
			/*
			maxwidth: 400,
			maxheight: 400,
			width: 400,
			nostyle: false,
			autoplay: false,
			videosrc: false,
			words: 50,
			chars: 100
			*/
		}
	});
	var cache = [];
	$.nmFilters({
		embedly: {
			is: function(nm) {
				if (nm._hasFilter('link') && nm._hasFilter('iframe') && nm.opener.attr('href') && nm.embedly.key) {
					if (cache[nm.opener.attr('href')]) {
						nm.store.embedly = cache[nm.opener.attr('href')];
						nm._delFilter('iframe');
						return true;
					}
					nm.store.embedly = false;
					var data = nm.embedly;
					data.url = nm.opener.attr('href');
					$.ajax({
						url: nm.embedlyUrl,
						dataType: 'jsonp',
						data: data,
						success: function(data) {
							if (data.type != 'error' && data.html) {
								nm.store.embedly = data;
								cache[nm.opener.attr('href')] = data;
								nm._delFilter('iframe');
								nm.filters.push('embedly');
								nm._callFilters('initFilters');
								nm._callFilters('init');
							}
						}
					});
				}
				return false;
			},
			init: function(nm) {
				nm.loadFilter = 'embedly';
			},
			load: function(nm) {
				if (nm.store.embedly.type == 'photo') {
					nm.filters.push('image');
					$('<img />')
						.load(function() {
							nm.elts.cont.addClass('nyroModalImg');
							nm.elts.hidden.addClass('nyroModalImg');
							nm._setCont(this);
						}).on('error', function() {
							nm._error();
						})
						.attr('src', nm.store.embedly.url);
				} else {
					nm._setCont('<div>'+nm.store.embedly.html+'</div>');
				}
			},
			size: function(nm) {
				if (nm.store.embedly.width && !nm.sizes.height) {
					nm.sizes.w = nm.store.embedly.width;
					nm.sizes.h = nm.store.embedly.height;
				}
			}
		}
	});
});