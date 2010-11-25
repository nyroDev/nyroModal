/*
 * nyroModal v2.alpha
 *
 */
jQuery(function($, undefined) {

	var $w = $(window),
		$d = $(document),
		$b = $('body'),
		baseHref = $('base').attr('href'),
		// nyroModal Object
		_nmObj = {
			filters: [],
			loadFilter: undefined,
			closeOnEscape: true,
			closeOnClick: true,
			useKeyHandler: false,

			closeButton: '<a href="#" class="nyroModalClose nyroModalCloseButton nmReposition" title="close">Close</a>',
			galleryLoop: true,
			galleryCounts: true,
			swf:  {
				allowFullScreen: 'true',
				allowscriptaccess: 'always',
				wmode: 'transparent'
			},

			ltr: true, // Left to Right by default. Put to false for Hebrew or Right to Left language
			store: {},
			errorMsg: 'An error occured',
			elts: {
				all: undefined,
				bg: undefined,
				load: undefined,
				cont: undefined,
				hidden: undefined
			},
			sizes: {
				initW: undefined,
				initH: undefined,
				w: undefined,
				h: undefined,
				wMargin: undefined,
				hMargin: undefined
			},
			anim: {
				def: undefined,
				showBg: undefined,
				hideBg: undefined,
				showLoad: undefined,
				hideLoad: undefined,
				showCont: undefined,
				hideCont: undefined,
				showTrans: undefined,
				hideTrans: undefined,
				resize: undefined
			},

			saveObj: function() {
				this.opener.data('nmObj', this);
			},
			open: function() {
				this.getInternal()._pushStack(this.opener);
				this._opened = false;
				this._bgReady = false;
				this._open = true;
				this._initElts();
				this._load();
				this._nbContentLoading = 0;
				this._callAnim('showBg', $.proxy(function() {
					this._bgReady = true;
					if (this._nmOpener) {
						// fake closing of the opener nyroModal
						this._nmOpener._close();
						this._nmOpener._bgReady = false;
						this._nmOpener._loading = false;
						this._nmOpener._animated = false;
						this._nmOpener._opened = false;
						this._nmOpener._open = false;
						this._nmOpener.elts.cont = this._nmOpener.elts.hidden = this._nmOpener.elts.load = this._nmOpener.elts.bg = this._nmOpener.elts.all = undefined;
						this._nmOpener.saveObj();
						this._nmOpener = undefined;
					}
					this._contentLoading();
				}, this));
			},

			size: function() {
				var maxHeight = this.getInternal().fullSize.viewH - this.sizes.hMargin,
					maxWidth = this.getInternal().fullSize.viewW - this.sizes.wMargin;
				if (this.sizes.h > maxHeight || this.sizes.w > maxWidth) {
					// We're gonna resize the modal as it will goes outside the view port
					this.sizes.h = Math.min(this.sizes.h, maxHeight);
					this.sizes.w = Math.min(this.sizes.w, maxWidth);
				}
				this._callFilters('size');
			},

			resize: function() {
				this.sizes.w = this.sizes.initW;
				this.sizes.h = this.sizes.initH;
				this._unreposition();
				this.size();
				this._callAnim('resize', $.proxy(function() {
					this._reposition();
				}, this));
			},
			getForNewLinks: function() {
				var ret = $.extend({}, this);
				ret.filters = [];
				ret.opener = undefined;
				ret._open = false;
				ret._nmOpener = this;
				// @todo what to delete or keep here ?
				// Think about stack or not
				return ret;
			},
			keyHandle: function(e) {
				this.keyEvent = e;
				this._callFilters('keyHandle');
				this.keyEvent = undefined;
				delete(this.keyEvent);
			},
			getInternal: function() {
				return _internal;
			},

			_close: function() {
				this.getInternal()._removeStack(this.opener);
				this._opened = false;
				this._open = false;
				this._callFilters('close');
			},
			close: function() {
				this._close();
				this._callFilters('beforeClose');
				var self = this;
				this._unreposition();
				self._callAnim('hideCont', function() {
					self._callAnim('hideLoad', function() {
						self._callAnim('hideBg', function() {
							self._callFilters('afterClose');
							self.elts.cont.remove();
							self.elts.hidden.remove();
							self.elts.load.remove();
							self.elts.bg.remove();
							self.elts.all.remove();
							self.elts.cont = self.elts.hidden = self.elts.load = self.elts.bg = self.elts.all = undefined;
						});
					});
				});
			},

			_open: false,
			_bgReady: false,
			_opened: false,
			_loading: false,
			_animated: false,
			_nmOpener: undefined,
			_transition: false,
			_nbContentLoading: 0,
			_scripts: '',
			_scriptsShown: '',

			_initElts: function() {
				if (this.elts.all && this.elts.all.closest('body').length == 0)
					this.elts.all = this.elts.bg = this.elts.cont = this.elts.hidden = this.elts.load = undefined;
				if (!this.elts.all)
					this.elts.all = $('<div />').appendTo(this.getInternal()._container);
				if (!this.elts.bg)
					this.elts.bg = $('<div />').hide().appendTo(this.elts.all);
				if (!this.elts.cont)
					this.elts.cont = $('<div />').hide().appendTo(this.elts.all);
				if (!this.elts.hidden)
					this.elts.hidden = $('<div />').hide().appendTo(this.elts.all);
				this.elts.hidden.empty();
				if (!this.elts.load)
					this.elts.load = $('<div />').hide().appendTo(this.elts.all);
				this._callFilters('initElts');
			},

			_error: function() {
				this._callFilters('error');
			},
			_setCont: function(html, selector) {
				if (selector) {
					var tmp = [],
						i = 0;
					// Looking for script to store them
					html = html
						.replace(/\r\n/gi, 'nyroModalLN')
						.replace(/<script(.|\s)*?\/script>/gi, function(x) {
								tmp[i] = x;
								return '<pre class=nyroModalScript rel="'+(i++)+'"></pre>';
							});
					var cur = $('<div>'+html+'</div>').find(selector);
					if (cur.length) {
						html = cur.html()
							.replace(/<pre class="?nyroModalScript"? rel="?(.?)"?><\/pre>/gi, function(x, y, z) { return tmp[y]; })
							.replace(/nyroModalLN/gi, "\r\n");
					} else {
						// selector not found
						this._error();
						return;
					}
				}
				this.elts.hidden
					.append(this._filterScripts(html))
					.wrapInner('<div class="nyroModal'+ucfirst(this.loadFilter)+'" />');

				// Store the size of the element
				this.sizes.initW = this.sizes.w = this.elts.hidden.width();
				this.sizes.initH = this.sizes.h = this.elts.hidden.height();
				var outer = this.getInternal()._getOuter(this.elts.cont);
				this.sizes.hMargin = outer.h.total;
				this.sizes.wMargin = outer.w.total;

				this.size();

				this.loading = false;
				this._callFilters('filledContent');
				this._contentLoading();
			},
			
			// Filter an html content to remove the script[src]
			_filterScripts: function(data) {
				if (typeof data != 'string')
					return data;
				
				this._scripts = [];
				this._scriptsShown = [];
				var start = 0,
					stStart = '<script',
					stEnd = '</script>',
					endLn = stEnd.length,
					pos,
					pos2,
					tmp;
				while ((pos = data.indexOf(stStart, start)) > -1) {
					pos2 = data.indexOf(stEnd)+endLn;
					tmp = $(data.substring(pos, pos2));
					if (!tmp.attr('src') || tmp.attr('rel') == 'forceLoad') {
						if (tmp.attr('rev') == 'shown')
							this._scriptsShown.push(tmp.get(0));
						else
							this._scripts.push(tmp.get(0));
					}
					data = data.substring(0, pos)+data.substr(pos2);
					start = pos;
				}
				return data;
			},

			_hasFilter: function(filter) {
				var ret = false;
				$.each(this.filters, function(i, f) {
					ret = ret || f == filter;
				});
				return ret;
			},
			_delFilter: function(filter) {
				this.filters = $.map(this.filters, function(v) {
					if (v != filter)
						return v;
				});
			},
			_callFilters: function(fct) {
				this.getInternal()._debug(fct);
				var ret = [],
					self = this;
				$.each(this.filters, function(i, f) {
					ret[f] = self._callFilter(f, fct);
				});
				return ret;
			},
			_callFilter: function(f, fct) {
				if (_filters[f] && _filters[f][fct] && $.isFunction(_filters[f][fct]))
					return _filters[f][fct](this);
				return undefined;
			},
			_callAnim: function(fct, clb) {
				this.getInternal()._debug(fct);
				this._callFilters('before'+ucfirst(fct));
				if (!this._animated) {
					this._animated = true;
					if (!$.isFunction(clb)) clb = $.noop;
					var set = this.anim[fct] || this.anim.def || 'basic';
					if (!_animations[set] || !_animations[set][fct] || !$.isFunction(_animations[set][fct]))
						set = 'basic';
					_animations[set][fct](this, $.proxy(function() {
							this._animated = false;
							this._callFilters('after'+ucfirst(fct));
							clb();
						}, this));
				}
			},

			_load: function() {
				this.getInternal()._debug('_load');
				if (!this.loading && this.loadFilter) {
					this.loading = true;
					this._callFilter(this.loadFilter, 'load');
				}
			},
			_contentLoading: function() {
				if (!this._animated && this._bgReady) {
					if (!this._transition && this.elts.cont.html().length > 0)
						this._transition = true;
					this._nbContentLoading++;
					if (!this.loading) {
						if (!this._opened) {
							this._opened = true;
							if (this._transition) {
								var fct = $.proxy(function() {
									this._writeContent();
									this._callFilters('beforeShowCont');
									this._callAnim('hideTrans', $.proxy(function() {
										this._transition = false;
										this.elts.cont.append(this._scriptsShown);
										this._reposition();
										this._callFilters('afterShowCont');
									}, this));
								}, this);
								if (this._nbContentLoading == 1) {
									this._unreposition();
									this._callAnim('showTrans', fct);
								} else {
									fct();
								}
							} else {
								this._callAnim('hideLoad', $.proxy(function() {
									this._writeContent();
									this._callAnim('showCont', $.proxy(function() {
										this.elts.cont.append(this._scriptsShown);
										this._reposition();
									}, this));
								}, this));
							}
						}
					} else if (this._nbContentLoading == 1) {
						var outer = this.getInternal()._getOuter(this.elts.load);
						this.elts.load
							.css({
								position: 'fixed',
								top: (this.getInternal().fullSize.viewH - this.elts.load.height() - outer.h.margin)/2,
								left: (this.getInternal().fullSize.viewW - this.elts.load.width() - outer.w.margin)/2
							});
						if (this._transition) {
							this._unreposition();
							this._callAnim('showTrans', $.proxy(function() {
								this._contentLoading();
							}, this));
						} else {
							this._callAnim('showLoad', $.proxy(function() {
								this._contentLoading();
							}, this));
						}
					}
				}
			},
			_writeContent: function() {
				this.elts.cont
					.empty()
					.append(this.elts.hidden.contents())
					.append(this._scripts)
					.append(this.closeButton)
					.css({
						position: 'fixed',
						width: this.sizes.w,
						height: this.sizes.h,
						top: (this.getInternal().fullSize.viewH - this.sizes.h - this.sizes.hMargin)/2,
						left: (this.getInternal().fullSize.viewW - this.sizes.w - this.sizes.wMargin)/2
					});
			},
			_reposition: function() {
				var elts = this.elts.cont.find('.nmReposition');
				if (elts.length) {
					var space = this.getInternal()._getSpaceReposition();
					elts.each(function() {
						var me = $(this),
							offset = me.offset();
						me.css({
							position: 'fixed',
							top: offset.top - space.top,
							left: offset.left - space.left
						});
					});
					this.elts.cont.after(elts);
				}
				this.elts.cont.css('overflow', 'auto');
			},
			_unreposition: function() {
				this.elts.cont.css('overflow', '');
				var elts = this.elts.all.find('.nmReposition');
				if (elts.length)
					this.elts.cont.append(elts.removeAttr('style'));
			}
		},
		_internal = {
			firstInit: true,
			stack: [],
			fullSize: {
				w: 0,
				h: 0,
				wW: 0,
				wH: 0,
				viewW: 0,
				viewH: 0
			},
			nyroModal: function(opts, fullObj) {
				if (_internal.firstInit) {
					_internal._container = $('<div />').appendTo($b);
					$w.smartresize($.proxy(_internal._resize, _internal));
					$d.bind('keydown.nyroModal', $.proxy(_internal._keyHandler, _internal));
					_internal._calculateFullSize();
					_internal.firstInit = false;
				}
				return this.nmInit(opts, fullObj).each(function() {
					_internal._init($(this).data('nmObj'));
				});
			},
			nmInit: function(opts, fullObj) {
				return this.each(function() {
					var me = $(this);
					if (fullObj)
						me.data('nmObj', $.extend(true, {opener: me}, opts));
					else
						me.data('nmObj',
							me.data('nmObj')
								? $.extend(true, me.data('nmObj'), opts)
								: $.extend(true, {opener: me}, _nmObj, opts));
				});
			},
			nmCall: function() {
				return this.trigger('nyroModal');
			},

			nmManual: function(url, opts) {
				$('<a />', {
					href: url
				}).nyroModal(opts).trigger('nyroModal');
			},
			nmObj: function(opts) {
				$.extend(true, _nmObj, opts);
			},
			nmInternal: function(opts) {
				$.extend(true, _internal, opts);
			},
			nmAnims: function(opts) {
				$.extend(true, _animations, opts);
			},
			nmFilters: function(opts) {
				$.extend(true, _filters, opts);
			},
			nmTop: function() {
				if (_internal.stack.length)
					return $(_internal.stack[_internal.stack.length-1]).data('nmObj');
				return undefined;
			},

			_debug: function(msg) {
				if (window.console && window.console.log)
					window.console.log(msg);
			},

			_container: undefined,

			_init: function(nm) {
				nm.filters = [];
				$.each(_filters, function(f, obj) {
					if ($.isFunction(obj.is) && obj.is(nm)) {
						nm.filters.push(f);
					}
				});
				nm._callFilters('init');
				nm.opener
					.unbind('nyroModal.nyroModal nmClose.nyroModal nmResize.nyroModal')
					.bind({
						'nyroModal.nyroModal': 	function() { nm.open(); },
						'nmClose.nyroModal': 	function() { nm.close(); },
						'nmResize.nyroModal': 	function() { nm.resize(); }
					});
			},

			_scrollWidth: (function() {
				var scrollbarWidth;
				if ($.browser.msie) {
					var $textarea1 = $('<textarea cols="10" rows="2"></textarea>')
							.css({ position: 'absolute', top: -1000, left: -1000 }).appendTo($b),
						$textarea2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>')
							.css({ position: 'absolute', top: -1000, left: -1000 }).appendTo($b);
					scrollbarWidth = $textarea1.width() - $textarea2.width();
					$textarea1.add($textarea2).remove();
				} else {
					var $div = $('<div />')
						.css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000 })
						.prependTo($b).append('<div />').find('div')
							.css({ width: '100%', height: 200 });
					scrollbarWidth = 100 - $div.width();
					$div.parent().remove();
				}
				return scrollbarWidth;
			})(),

			_selNyroModal: function(obj) {
				return $(obj).data('nmObj') ? true : false;
			},

			_selNyroModalOpen: function(obj) {
				var me = $(obj);
				return me.data('nmObj') ? me.data('nmObj')._open : false;
			},

			_keyHandler: function(e) {
				var nmTop = $.nmTop();
				if (nmTop && nmTop.useKeyHandler) {
					return nmTop.keyHandle(e);
				}
			},
			_pushStack: function(obj) {
				this.stack = $.map(this.stack, function(elA) {
					if (elA != obj.get(0))
						return elA;
				});
				this.stack.push(obj.get(0));
			},
			_removeStack: function(obj) {
				this.stack = $.map(this.stack, function(elA) {
					if (elA != obj.get(0))
						return elA;
				});
			},
			_resize: function() {
				var opens = $(':nmOpen').each(function() {
					$(this).data('nmObj')._unreposition();
				});
				this._calculateFullSize();
				opens.trigger('nmResize');
			},
			_calculateFullSize: function() {
				this.fullSize = {
					w: $d.width(),
					h: $d.height(),
					wW: $w.width(),
					wH: $w.height()
				};
				this.fullSize.viewW = Math.min(this.fullSize.w, this.fullSize.wW);
				this.fullSize.viewH = Math.min(this.fullSize.h, this.fullSize.wH);
			},
			_getCurCSS: function(elm, name) {
				var ret = parseInt($.curCSS(elm, name, true));
				return isNaN(ret) ? 0 : ret;
			},
			_getOuter: function(elm) {
				elm = elm.get(0);
				var ret = {
					h: {
						margin: this._getCurCSS(elm, 'marginTop') + this._getCurCSS(elm, 'marginBottom'),
						border: this._getCurCSS(elm, 'borderTopWidth') + this._getCurCSS(elm, 'borderBottomWidth'),
						padding: this._getCurCSS(elm, 'paddingTop') + this._getCurCSS(elm, 'paddingBottom')
					},
					w: {
						margin: this._getCurCSS(elm, 'marginLeft') + this._getCurCSS(elm, 'marginRight'),
						border: this._getCurCSS(elm, 'borderLeftWidth') + this._getCurCSS(elm, 'borderRightWidth'),
						padding: this._getCurCSS(elm, 'paddingLeft') + this._getCurCSS(elm, 'paddingRight')
					}
				};

				ret.h.outer = ret.h.margin + ret.h.border;
				ret.w.outer = ret.w.margin + ret.w.border;

				ret.h.inner = ret.h.padding + ret.h.border;
				ret.w.inner = ret.w.padding + ret.w.border;

				ret.h.total = ret.h.outer + ret.h.padding;
				ret.w.total = ret.w.outer + ret.w.padding;

				return ret;
			},
			_getSpaceReposition: function() {
				var	outer = this._getOuter($b),
					ie7 = $.browser.msie && $.browser.version < 8 && !(screen.height <= $w.height()+23);
				return {
					top: $w.scrollTop() - (!ie7 ? outer.h.border / 2 : 0),
					left: $w.scrollLeft() - (!ie7 ? outer.w.border / 2 : 0)
				};
			},

			_getHash: function(url) {
				if (typeof url == 'string') {
					var hashPos = url.indexOf('#');
					if (hashPos > -1)
						return url.substring(hashPos);
				}
				return '';
			},
			_extractUrl: function(url) {
				var ret = {
					url: undefined,
					sel: undefined
				};

				if (url) {
					var hash = this._getHash(url),
						hashLoc = this._getHash(window.location.href),
						curLoc = window.location.href.substring(0, window.location.href.length - hashLoc.length),
						req = url.substring(0, url.length - hash.length);
					ret.sel = hash;
					if (req != curLoc && req != baseHref)
						ret.url = req;
				}
				return ret;
			}
		},
		_animations = {
			basic: {
				showBg: function(nm, clb) {
					nm.elts.bg.css({opacity: 0.7}).show();
					clb();
				},
				hideBg: function(nm, clb) {
					nm.elts.bg.hide();
					clb();
				},
				showLoad: function(nm, clb) {
					nm.elts.load.show();
					clb();
				},
				hideLoad: function(nm, clb) {
					nm.elts.load.hide();
					clb();
				},
				showCont: function(nm, clb) {
					nm.elts.cont.show();
					clb();
				},
				hideCont: function(nm, clb) {
					nm.elts.cont.hide();
					clb();
				},
				showTrans: function(nm, clb) {
					nm.elts.cont.hide();
					nm.elts.load.show();
					clb();
				},
				hideTrans: function(nm, clb) {
					nm.elts.cont.show();
					nm.elts.load.hide();
					clb();
				},
				resize: function(nm, clb) {
					nm.elts.cont.css({
						width: nm.sizes.w,
						height: nm.sizes.h,
						top: (nm.getInternal().fullSize.viewH - nm.sizes.h - nm.sizes.hMargin)/2,
						left: (nm.getInternal().fullSize.viewW - nm.sizes.w - nm.sizes.wMargin)/2
					});
					clb();
				}
			},
			fade: {
				showBg: function(nm, clb) {
					nm.elts.bg.fadeTo(250, 0.7, clb);
				},
				hideBg: function(nm, clb) {
					nm.elts.bg.fadeOut(clb);
				},
				showLoad: function(nm, clb) {
					nm.elts.load.fadeIn(clb);
				},
				hideLoad: function(nm, clb) {
					nm.elts.load.fadeOut(clb);
				},
				showCont: function(nm, clb) {
					nm.elts.cont.fadeIn(clb);
				},
				hideCont: function(nm, clb) {
					nm.elts.cont.css('overflow', 'hidden').fadeOut(clb);
				},
				showTrans: function(nm, clb) {
					nm.elts.load
						.css({
							position: nm.elts.cont.css('position'),
							top: nm.elts.cont.css('top'),
							left: nm.elts.cont.css('left'),
							width: nm.elts.cont.css('width'),
							height: nm.elts.cont.css('height'),
							marginTop: nm.elts.cont.css('marginTop'),
							marginLeft: nm.elts.cont.css('marginLeft')
						})
						.fadeIn(function() {
							nm.elts.cont.hide();
							clb();
						});
				},
				hideTrans: function(nm, clb) {
					nm.elts.cont.css('visibility', 'hidden').show();
					nm.elts.load
						.css('position', nm.elts.cont.css('position'))
						.animate({
							top: nm.elts.cont.css('top'),
							left: nm.elts.cont.css('left'),
							width: nm.elts.cont.css('width'),
							height: nm.elts.cont.css('height'),
							marginTop: nm.elts.cont.css('marginTop'),
							marginLeft: nm.elts.cont.css('marginLeft')
						}, function() {
							nm.elts.cont.css('visibility', '');
							nm.elts.load.fadeOut(clb);
						});
				},
				resize: function(nm, clb) {
					nm.elts.cont.animate({
						width: nm.sizes.w,
						height: nm.sizes.h,
						top: (nm.getInternal().fullSize.viewH - nm.sizes.h - nm.sizes.hMargin)/2,
						left: (nm.getInternal().fullSize.viewW - nm.sizes.w - nm.sizes.wMargin)/2
					}, clb);
				}
			}
		},
		_filters = {
			basic: {
				is: function(nm) {
					return true;
				},
				init: function(nm) {
					if (nm.closeOnEscape)
						nm.useKeyHandler = true;
				},
				initElts: function(nm) {
					nm.elts.bg.addClass('nyroModalBg');
					if (nm.closeOnClick)
						nm.elts.bg.unbind('click.nyroModal').bind('click.nyroModal', function(e) {
							e.preventDefault();
							nm.close();
						});
					nm.elts.cont.addClass('nyroModalCont');
					nm.elts.hidden.addClass('nyroModalCont nyroModalHidden');
					nm.elts.load.addClass('nyroModalCont nyroModalLoad');
				},
				error: function(nm) {
					nm.elts.hidden.addClass('nyroModalError');
					nm.elts.cont.addClass('nyroModalError');
					nm._setCont(nm.errorMsg);
				},
				beforeShowCont: function(nm) {
					nm.elts.cont
						.find('.nyroModal').nyroModal(nm.getForNewLinks(), true).end()
						.find('.nyroModalClose').bind('click.nyroModal', function(e) {
							e.preventDefault();
							nm.close();
						});
				},
				keyHandle: function(nm) {
					// used for escape key
					if (nm.keyEvent.keyCode == 27 && nm.closeOnEscape) {
						nm.keyEvent.preventDefault();
						nm.close();
					}
				}
			},

			custom: {
				is: function(nm) {
					return true;
				}
			},

			/*
				depends:
			*/
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
				},
				close: function(nm) {
					if (nm.store.title) {
						nm.store.title.remove();
						nm.store.title = undefined;
						delete(nm.store.title);
						delete(nm.store.titleH);
					}
				}
			},

			/*
				depends:
					- filters.title
			*/
			gallery: {
				is: function(nm) {
					var ret = nm.opener.is('[rel]:not([rel=external], [rel=nofollow])');
					if (ret && nm.galleryCounts && !nm._hasFilter('title'))
						nm.filters.push('title');
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
					if (nm.galleryCounts && nm.store.title && nm.store.galleryLinks.length > 1) {
						var curTitle = nm.store.title.html();
						nm.store.title.html((curTitle.length ? curTitle+' - ' : '')+(nm.store.galleryIndex+1)+'/'+nm.store.galleryLinks.length);
					}
				},
				filledContent: function(nm) {
					var link = _filters.gallery._getGalleryLink(nm, -1),
						append = nm.elts.hidden.find(' > div');
					if (link) {
						$('<a />', {
								text: 'previous',
								href: '#'
							})
							.addClass('nyroModalPrev')
							.bind('click', function(e) {
								e.preventDefault();
								nm._callFilters('galleryPrev');
							})
							.appendTo(append);
					}
					link = _filters.gallery._getGalleryLink(nm, 1);
					if (link) {
						$('<a />', {
								text: 'next',
								href: '#'
							})
							.addClass('nyroModalNext')
							.bind('click', function(e) {
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
					_filters.gallery._getGalleryLink(nm, 1).nyroModal(nm.getForNewLinks(), true).click();
				},
				galleryPrev: function(nm) {
					_filters.gallery._getGalleryLink(nm, -1).nyroModal(nm.getForNewLinks(), true).click();
				},
				_getGalleryLink: function(nm, dir) {
					if (nm.store.gallery) {
						if (!nm.ltr)
							dir *= -1;
						var index = nm.store.galleryIndex + dir;
						if (index >= 0 && index < nm.store.galleryLinks.length)
							return nm.store.galleryLinks.eq(index);
						else if (nm.galleryLoop)
							return nm.store.galleryLinks.eq(index<0 ? nm.store.galleryLinks.length-1 : 0);
					}
					return undefined;
				}
			},

			/*
				depends:
			*/
			link: {
				is: function(nm) {
					var ret = nm.opener.is('[href]');
					if (ret)
						nm.store.link = nm.getInternal()._extractUrl(nm.opener.attr('href'));
					return ret;
				},
				init: function(nm) {
					nm.loadFilter = 'link';
					nm.opener.unbind('click.nyroModal').bind('click.nyroModal', function(e) {
						e.preventDefault();
						nm.opener.trigger('nyroModal');
					});
				},
				load: function(nm) {
					$.ajax({
						url: nm.store.link.url,
						success: function(data) {
							nm._setCont(data, nm.store.link.sel);
						},
						error: function() {
							nm._error();
						}
					});
				}
			},

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
			},

			/*
				depends:
			*/
			image: {
				is: function(nm) {
					return (new RegExp('[^\.]\.(jpg|jpeg|png|tiff|gif|bmp)\s*$', 'i')).test(nm.opener.attr('href'));
				},
				init: function(nm) {
					nm.loadFilter = 'image';
				},
				load: function(nm) {
					var url = nm.opener.attr('href');
					$('<img />')
						.load(function() {
							nm.elts.cont.addClass('nyroModalImg');
							nm.elts.hidden.addClass('nyroModalImg');
							nm._setCont(this);
						}).error(function() {
							nm._error();
						})
						.attr('src', url);
				},
				size: function(nm) {
					if (nm.sizes.w != nm.sizes.initW || nm.sizes.h != nm.sizes.initH) {
						var ratio = Math.min(nm.sizes.w/nm.sizes.initW, nm.sizes.h/nm.sizes.initH);
						nm.sizes.w = nm.sizes.initW * ratio;
						nm.sizes.h = nm.sizes.initH * ratio;
					}
					var img = nm.loading ? nm.elts.hidden.find('img') : nm.elts.cont.find('img');
					img.attr({
						width: nm.sizes.w,
						height: nm.sizes.h
					});
				},
				close: function(nm) {
					if (nm.elts.cont) {
						nm.elts.cont.removeClass('nyroModalImg');
						nm.elts.hidden.removeClass('nyroModalImg');
					}
				}
			},

			/*
				depends:
					- filters.link
			*/
			swf: {
				is: function(nm) {
					return nm._hasFilter('link') && nm.opener.is('[href$=.swf]');
				},
				init: function(nm) {
					nm.loadFilter = 'swf';
				},
				load: function(nm) {
					var url = nm.store.link.url,
						cont = '<div><object id="nyroModalSwf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+nm.sizes.w+'" height="'+nm.sizes.h+'"><param name="movie" value="'+url+'"></param>',
						tmp = '';
					$.each(nm.swf, function(name, val) {
						cont+= '<param name="'+name+'" value="'+val+'"></param>';
						tmp+= ' '+name+'="'+val+'"';
					});
					cont+= '<embed src="'+url+'" type="application/x-shockwave-flash" width="'+nm.sizes.w+'" height="'+nm.sizes.h+'"'+tmp+'></embed></object></div>';
					nm._setCont(cont);
				}
			},

			/*
				depends:
			*/
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
					$.ajax({
						url: nm.store.form.url,
						data: nm.opener.serializeArray(),
						type: nm.opener.attr('method') ? nm.opener.attr('method') : 'get',
						success: function(data) {
							nm._setCont(data, nm.store.form.sel);
						},
						error: function() {
							nm._error();
						}
					});
				}
			},

			/*
				depends:
			*/
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
					nm.opener.unbind('submit.nyroModal').bind('submit.nyroModal', function(e) {
						if (!nm.store.formFileIframe) {
							e.preventDefault();
							nm.opener.trigger('nyroModal');
						} else {
							nm.store.formFileLoading = true;
						}
					});
				},
				initElts: function(nm) {
					function rmIframe() {
						nm.store.formFileIframe.attr('src', 'about:blank').remove();
						nm.store.formFileIframe = undefined;
						delete(nm.store.formFileIframe);
					}
					nm.store.formFileIframe = $('<iframe name="nyroModalFormFile" src="javascript:\'\';"></iframe>')
						.hide()
						.load(function() {
							if (nm.store.formFileLoading) {
								nm.store.formFileLoading = false;
								var content = nm.store.formFileIframe
										.unbind('load error')
										.contents().find('body').not('script[src]');
								if (content && content.html() && content.html().length) {
									rmIframe();
									nm._setCont(content.html(), nm.store.form.sel);
								} else {
									// Not totally ready, try it in a few secs
									var nbTry = 0;
										fct = function() {
											nbTry++;
											var content = nm.store.formFileIframe
													.unbind('load error')
													.contents().find('body').not('script[src]');
											if (content && content.html() && content.html().length) {
												nm._setCont(content.html(), nm.store.form.sel);
												rmIframe();
											} else if (nbTry < 5) {
												setTimeout(fct, 25);
											} else {
												rmIframe();
												nm._error();
											}
										};
									setTimeout(fct, 25);
								}
							}
						})
						.error(function() {
							rmIframe();
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
				}
			},

			/*
				depends:
			*/
			iframe: {
				is: function(nm) {
					var	target = nm.opener.attr('target') || '',
						rel = nm.opener.attr('rel') || '',
						opener = nm.opener.get(0);
					return !nm._hasFilter('image') && (target.toLowerCase() == '_blank'
						|| rel.toLowerCase().indexOf('external') > -1
						|| (opener.hostname && opener.hostname.replace(/:\d*$/,'') != window.location.hostname.replace(/:\d*$/,'')));
				},
				init: function(nm) {
					nm.loadFilter = 'iframe';
				},
				load: function(nm) {
					nm.store.iframe = $('<iframe src="javascript:\'\';"></iframe>');
					nm._setCont(nm.store.iframe);
				},
				afterShowCont: function(nm) {
					nm.store.iframe.attr('src', nm.opener.attr('href'));
				},
				close: function(nm) {
					if (nm.store.iframe) {
						nm.store.iframe.remove();
						nm.store.iframe = undefined;
						delete(nm.store.iframe);
					}
				}
			},

			/*
				depends:
					- filters.iframe
			*/
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
					nm.store.iframeFormIframe = $('<iframe name="nyroModalIframeForm" src="javascript:\'\';"></iframe>');
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
			},

			/*
				depends:
					- filters.swf
			*/
			youtube: {
				is: function(nm) {
					var ret = nm._hasFilter('link') && nm.opener.attr('href').indexOf('http://www.youtube.com/watch?v=') == 0;
					if (ret) {
						nm.filters.push('swf');
						nm._delFilter('iframe');
					}
					return ret;
				},
				initElts: function(nm) {
					nm.store.link.url = nm.store.link.url.replace(new RegExp("watch\\?v=", "i"), 'v/')+'&fs=1';
					nm.sizes.w = 480;
					nm.sizes.h = 385;
				}
			}
		};

	// Add jQuery call fucntions
	$.fn.extend({
		nm: _internal.nyroModal,
		nyroModal: _internal.nyroModal,
		nmInit: _internal.nmInit,
		nmCall: _internal.nmCall
	});

	// Add global jQuery functions
	$.extend({
		nmManual: _internal.nmManual,
		nmObj: _internal.nmObj,
		nmInternal: _internal.nmInternal,
		nmAnims: _internal.nmAnims,
		nmFilters: _internal.nmFilters,
		nmTop: _internal.nmTop
	});

	// Add jQuery selectors
	$.expr[':'].nyroModal = $.expr[':'].nm = _internal._selNyroModal;
	$.expr[':'].nmOpen = _internal._selNyroModalOpen;
});

// Smartresize plugin
(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  };
	// smartresize
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
// ucFirst
function ucfirst(str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: ucfirst('kevin van zonneveld');
    // *     returns 1: 'Kevin van zonneveld'
    str += '';
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
}
