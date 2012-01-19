/*
 * nyroModal v2.0.0
 * 
 * Gallery filter
 * 
 * Depends:
 * - filters.title
 * 
 * Before: filters.title
 */
jQuery(function($, undefined) {
	$.nmFilters({
		gallery: {
			is: function(nm) {
				var ret = nm.opener.is('[rel]:not([rel=external], [rel=nofollow])');
				if (ret) {
					var rel = nm.opener.attr('rel'),
						indexSpace = rel.indexOf(' '),
						gal = indexSpace > 0 ? rel.substr(0, indexSpace) : rel,
						links = $('[href][rel="'+gal+'"], [href][rel^="'+gal+' "]');
					if (links.length < 2)
						ret = false;
					if (ret && nm.galleryCounts && !nm._hasFilter('title'))
						nm.filters.push('title');
				}
				return ret;
			},
			init: function(nm) {
				nm.useKeyHandler = true;
			},
			keyHandle: function(nm) {
				// used for arrows key
				if (!nm._animated && nm._opened) {
					if (nm.keyEvent.keyCode == 39 || nm.keyEvent.keyCode == 40) {
						nm.keyEvent.preventDefault();
						nm._callFilters('galleryNext');
					} else if (nm.keyEvent.keyCode == 37 || nm.keyEvent.keyCode == 38) {
						nm.keyEvent.preventDefault();
						nm._callFilters('galleryPrev');
					}
				}
			},
			initElts: function(nm) {
				var rel = nm.opener.attr('rel'),
					indexSpace = rel.indexOf(' ');
				nm.store.gallery = indexSpace > 0 ? rel.substr(0, indexSpace) : rel;
				nm.store.galleryLinks = $('[href][rel="'+nm.store.gallery+'"], [href][rel^="'+nm.store.gallery+' "]');
				nm.store.galleryIndex = nm.store.galleryLinks.index(nm.opener);
			},
			beforeShowCont: function(nm) {
				if (nm.galleryCounts && nm.store.title && nm.store.galleryLinks && nm.store.galleryLinks.length > 1) {
					var curTitle = nm.store.title.html();
					nm.store.title.html((curTitle.length ? curTitle+' - ' : '')+(nm.store.galleryIndex+1)+'/'+nm.store.galleryLinks.length);
				}
			},
			filledContent: function(nm) {
				var link = this._getGalleryLink(nm, -1),
					append = nm.elts.hidden.find(' > div');
				if (link) {
					$('<a />', {
							text: 'previous',
							href: '#'
						})
						.addClass('nyroModalPrev')
						.on('click', function(e) {
							e.preventDefault();
							nm._callFilters('galleryPrev');
						})
						.appendTo(append);
				}
				link = this._getGalleryLink(nm, 1);
				if (link) {
					$('<a />', {
							text: 'next',
							href: '#'
						})
						.addClass('nyroModalNext')
						.on('click', function(e) {
							e.preventDefault();
							nm._callFilters('galleryNext');
						})
						.appendTo(append);
				}
			},
			close: function(nm) {
				nm.store.gallery = undefined;
				nm.store.galleryLinks = undefined;
				nm.store.galleryIndex = undefined;
				delete(nm.store.gallery);
				delete(nm.store.galleryLinks);
				delete(nm.store.galleryIndex);
				if (nm.elts.cont)
					nm.elts.cont.find('.nyroModalNext, .nyroModalPrev').remove();
			},
			galleryNext: function(nm) {
				this._getGalleryLink(nm, 1).nyroModal(nm.getForNewLinks(), true).click();
			},
			galleryPrev: function(nm) {
				this._getGalleryLink(nm, -1).nyroModal(nm.getForNewLinks(), true).click();
			},
			_getGalleryLink: function(nm, dir) {
				if (nm.store.gallery) {
					if (!nm.ltr)
						dir *= -1;
					var index = nm.store.galleryIndex + dir;
					if (nm.store.galleryLinks && index >= 0 && index < nm.store.galleryLinks.length)
						return nm.store.galleryLinks.eq(index);
					else if (nm.galleryLoop && nm.store.galleryLinks)
						return nm.store.galleryLinks.eq(index<0 ? nm.store.galleryLinks.length-1 : 0);
				}
				return undefined;
			}
		}
	});
});