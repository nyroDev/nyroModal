nyroModal jQuery Plugin
=======================

Writted and tested with jQuery 1.4.4

Tested in all majors browsers:
- Firefox 3.6.12 (Windows)
- Chrome 7.0.517 (Windows)
- Opera 10.63 (Windows)
- Safari 5.0.2 (Windows)
- Internet Explorer 8 (Windows)
- Internet Explorer 7 (Windows)
- Internet Explorer 6 (Windows)


##How to use it

You need to include jQuery 1.4.4 on your page.
Then add js/jquery.nyroModal.complete.js
Include styles/nyroModal.css. You will also need the images stored in the img folder.
To add compabitibilty with IE6, you have to add the following :
    <!--[if IE 6]>
      <script type="text/javascript" src="js/jquery.nyroModal-ie6.js"></script>
    <![endif]-->

Then, add the nyroModal functionnality to your links:
    $('YOUR SELECTOR').nyroModal();
This will work on many kind of elements, depending of what you included as nyroModal filters (see below)

##Functions available

nyroModal comes with a lot of functions that tou could use through your programming.

###$.fn.nyroModal(opts, fullObj);
This is obviously the most useful. It enables the nyroModal functionnality on the element when clicked or submitted for a form.
You have to call it to add the bind. The most usual place might be on a ready page event like:
    $(function() {
      $('.nyroModal').nyroModal();
    });
Parameters: 
- opts: the options parameter might be used in order to change the setting for the specified nyroModal objects
- fullObj: a boolean to indicate if the options parameter is actually a fully nyroModal object

###$.fn.nm(opts, fullObj);
This is simply a shortcut for the nyroModal function, they both do exactly the same.
For more information, see description above.

###$.fn.nmInit(opts, fullObj);
This function is used in order to initliaze the nyroModal object as data of DOM node.
This function will result by create a data('nmObj') on the jQuery object representing the DOM node.
This function is used internally, it shouldn't be use in most of case.
Usage example:
    $(function() {
      $('.nyroModal').nmInit();
    });
Parameters: 
- opts: the options parameter might be used in order to change the setting for the specified nyroModal objects
- fullObj: a boolean to indicate if the options parameter is actually a fully nyroModal object

###$.fn.nmCall();
This function is used to open the nyroModal on a DOM element that already have been initalised with the nyroModal or nm functions.
Usage example:
    $('#myLink').nmCall();

Note: This code has exaclty the same effect than triggering a nyroModal event like:
    $('#myLink').trigger('nyroModal');

###$.nmManual(url, opts);
This function is used to manually open a nyroModal by giving only an url.
Example usage:
    $.nmManual('page.html');
Parameters: 
- url: The url to open. it might a DOM selector or anything else
- opts: the options parameter might be used in order to change the setting for the specified nyroModal objects

###$.nmObj(opts);
This is used to overwrite the default function or settings of the nyroModal object created when initialising a nyroModal Object.
This could be used to change the default animations to use or change the default behavior of the nyroModal.
Exemple usage:
    $(function() {
      $.nmObj({anim: {def: 'fade'}});
    });

###$.nmInternal(opts);
This is used to overwrite internal object of nyroModal used in many places in the code.
This could be used to change the default behavior of nyroModal.
Exemple usage in jquery.nyroModal-ie6 in order to calculate the size according to this browser:
    $.nmInternal({
      _calculateFullSize: function() {
        var scrollHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        ),
        offsetHeight = Math.max(
          document.documentElement.offsetHeight,
          document.body.offsetHeight
        ),
        scrollWidth = Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth
        ),
        offsetWidth = Math.max(
          document.documentElement.offsetWidth,
          document.body.offsetWidth
        );
        this.fullSize = {
          wW: $w.width(),
          wH: $w.height()
        };
        this.fullSize.h = scrollHeight < offsetHeight ? $w.height() : scrollHeight;
        this.fullSize.w = scrollWidth < offsetWidth ? $w.width() : scrollWidth;
        this.fullSize.viewW = Math.min(this.fullSize.w, this.fullSize.wW);
        this.fullSize.viewH = Math.min(this.fullSize.h, this.fullSize.wH);
      }
    });

###$.nmAnims(opts);
This is used to add or overwrite animations pack.
See js/jquery.nyroModal.anims.fade.js to see how the code looks like.
See animations section below to learn how it should be written an used.

###$.nmFilters(opts);
This is used to add or overwrite filters pack.
This might be the most useful part of nyroModal as it allow devleopper to create a totally new behavior on it's own, without breaking all others.
See filters section below to learn how it should be written and used.

###$.nmTop();
As nyroModal allow multiple nyroModal to be opened at the same time, this function return the nyroModal Object of the last opened modal, ie the modal at the top.
If nothing is open, undefined will be returned.

##Selectors
nyroModal defines 3 selectors that could be used transparently in your code like any others jQuery selectors.

###:nyroModal
This selector retrieves all elements that was binded using the nyroModal() function.
For instance, if you want to open all modal at the same time (not recommended), you can do:
    $(':nyroModal').nmCall();

###:nm
This is an alias for the previous selector, :nyroModal.
they both do exactly the same.

###:nmOpen
This selector retrieves all modals that are curently opened.
This could be useful to close them all at the same time:
    $(':nmOpen').each(function() {
      $(this).data('nmObj').close();
    }):

##Filters

##Animations
