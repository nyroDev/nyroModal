nyroModal jQuery Plugin
=======================

Tested in all majors browsers:
- Firefox
- Chrome
- Safari
- Internet Explorer

##License

nyroModal is licensed under the MIT License.

##How to use it

Go to http://nyromodal.nyrodev.com/ and download your package.
You need to include jQuery on your page.
Then you can include jquery.nyromodal.custom.js on your page.
Include styles/nyroModal.css. You will also need the images stored in the img folder.
To add compabitibilty with IE6, you have to add the following :
```
<!--[if IE 6]>
  <script type="text/javascript" src="js/jquery.nyroModal-ie6.js"></script>
<![endif]-->
```

Then, add the nyroModal functionnality to your links:
```
$('YOUR SELECTOR').nyroModal();
```
This will work on many kind of elements, depending of what you included as nyroModal filters (see below)

##Functions available

nyroModal comes with a lot of functions that tou could use through your programming.

###$.fn.nyroModal(opts, fullObj);
This is obviously the most useful. It enables the nyroModal functionnality on the element when clicked or submitted for a form.
You have to call it to add the bind. The most usual place might be on a ready page event like:
```
$(function() {
  $('.nyroModal').nyroModal();
});
```
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
```
$(function() {
  $('.nyroModal').nmInit();
});
```
Parameters: 
- opts: the options parameter might be used in order to change the setting for the specified nyroModal objects
- fullObj: a boolean to indicate if the options parameter is actually a fully nyroModal object

###$.fn.nmCall();
This function is used to open the nyroModal on a DOM element that already have been initalised with the nyroModal or nm functions.
Usage example:
```
$('#myLink').nmCall();
```

Note: This code has exaclty the same effect than triggering a nyroModal event like:
```
$('#myLink').trigger('nyroModal');
```

###$.nmManual(url, opts);
This function is used to manually open a nyroModal by giving only an url.
To use it, **the Link Filter is required**.
Example usage:
```
$.nmManual('page.html');
```
Parameters: 
- url: The url to open. it might a DOM selector or anything else
- opts: the options parameter might be used in order to change the setting for the specified nyroModal objects

###$.nmData(data, opts);
This function is used to manually open a nyroModal by giving it's content.
To use it, **the Link Filter and the Data Filter are required**.
Example usage:
```
$.nmData('my content<br />is so greaaaaaaaaaaaat !');
```
Parameters: 
- data: The data to be shown inside the modal
- opts: the options parameter might be used in order to change the setting for the specified nyroModal objects

###$.nmObj(opts);
This is used to overwrite the default function or settings of the nyroModal object created when initialising a nyroModal Object.
This could be used to change the default animations to use or change the default behavior of the nyroModal.
Exemple usage:
```
$(function() {
  $.nmObj({anim: {def: 'fade'}});
});
```

###$.nmInternal(opts);
This is used to overwrite internal object of nyroModal used in many places in the code.
This could be used to change the default behavior of nyroModal.
Exemple usage in jquery.nyroModal-ie6 in order to calculate the size according to this browser:
```
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
```

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
```
$(':nyroModal').nmCall();
```

###:nm
This is an alias for the previous selector, :nyroModal.
they both do exactly the same.

###:nmOpen
This selector retrieves all modals that are curently opened.
This could be useful to close them all at the same time:
```
$(':nmOpen').each(function() {
  $(this).data('nmObj').close();
}):
```


## nyroModal Object
Description of what is, how and when to use it.
List of all of settings and functions


##Filters
Filters are used to provide many basics functionnality like Ajax download, but it alos let you the ability to fully customize the way nyroModal work, by adding as many callbacks as you need.

A filter is a set function that will be called by nyroModal core at many differents points. These functions call be used to do everything needed to make the modal work as you excpet or to add others behaviors needed for your projet: add some elements inside the modal, updating your page content, add some Ajax call, etc...

Here is how filters works:

1. When $('element').nyroModal(); is called, the nyroModal object is created and attached to the DOM element instancied
2. Every available filters are tested again the nyroModal object using the is function

   * If this function returns true, the filters will be used all the time for this element.
   * If it returns false, the filters will not be used anymore for this element.

3. nyroModal core calls every init function of every filters selected for the element

   * These init function should bind the event they need, create their own object if needed.
   * If the filters need to be the one used to load the content, the loadFilter setting of the nyroModal ovject should be defined to its name.

4. Througout the living of nyroModal, every function or callback defined in all selected filters will be called (see the list below)


All function or callbacks receive the same nyroModal object as a unique parameter.


The list of all function or callback that can be called in a filter:

* is: should return true or false to select the filter for the current or element or not. This function is **REQUIRED** !
* initFilters: called just after every filters have been determined to use or not, and just before the init of them. Good place to force filters.
* init: called at the very beggining of the process. This function should bind element or create object needed later
* initElts: called at the beggining of the open process, juste before the load start. After that, all the needed div are created and attached to the DOM
* load: called only for ONE filter defined in nm.loadFilter attribute. This function should load the function and set it's content using the **_setCont** function
* filledContent: called once the content is placed on the hidden div
* error: called in case of error (URL not founr for example)
* size: called after the size has been defined
* close: called at the end of the closing process, regarding only the data (useful for gallery)
* beforeClose: called at the beggining of the closing process, regarding the animation
* afterClose: called at the end of the closing process, regarding the animation
* keyHandle: called when a key is hit if the keyHandle is enable and if the modal is on the top


Like the version 1, there is a bunch of others callback that you can define before and after every animation. The version 2 put it in a new way by letting you the ability to define a function before and after every animation function.

* beforeShowBg: called just before the showBg animation
* afterShowBg: called just after the showBg animation
* beforeHideBg: called just before the hideBg animation
* afterHideBg: called just after the hideBg animation
* beforeShowLoad: called just before the showLoad animation
* afterShowLoad: called just after the showLoad animation
* beforeHideLoad: called just before the hideLoad animation
* afterHideLoad: called just after the hideLoad animation
* beforeShowCont: called just before the showCont animation (also called in case of a transition, before beforeHideTrans)
* afterShowCont: called just after the showCont animation (also called in case of a transition, after afterHideTrans)
* afterReposition: called just after the .nmRepositon have been placed
* afterUnreposition: called just after the .nmRepositon have been replaced on their initial positions
* beforeHideCont: called just before the hideCont animation
* afterHideCont: called just after the hideCont animation
* beforeShowTrans: called just before the showTrans animation (transition)
* afterShowTrans: called just after the showTrans animation (transition)
* beforeHideTrans: called just before the hideTrans animation (transition)
* afterHideTrans: called just after the hideTrans animation (transition)
* beforeResize: called just before the resize animation
* afterresize: called just after the resize animation


nyroModal automatically add 2 filters for every elements:

* basic: used to provide basic functionnality. This filter **shouldn't be modified** unless you know exactly what you're doing
* custom: This filter has absolutely no programming. It's added here juste to provide a quick way to add your filters callback


There is some some basic filters that you can use on your project that enable the basic usage of this kind of plugin.
Here is a list of the filters officially provided:

* Title: Show the title for the modal using the title attribute of the opener element
* Gallery: Enable arrows and navigation keys trough the element with the same rel attribute defined in the DOM (depends on title)
* Link: Bind an anchor element and load the target using Ajax to retrieve content 
* Dom: Instead of using Ajax, it get the content within the page using an id. (exemple link : <a href="#myContent" />) (depends on link)
* Image: Show an image, and resize it if needed (depends on link)
* SWF: Show a SWf animation (depends on link)
* Form: Bind a form and load the target by sending it's data trhough Ajax
* Form file: Same as Form but used when form should send file
* Iframe: Used to show data from an other domain name or when target="_blank" is present (depends on link)
* Iframe form: Used to open a form in an iframe (depends iframe)
* Embedly: Used to show a bunch of different element using [embedly API](http://embed.ly/) ([Examples](http://nyromodal.nyrodev.com/embedly.php)) (depends on link) Embedly requires developers to sign up for an API key at [embedly Pricing](http://embed.ly/pricing)

##Animations


##Debug
In order to enable the debug mode, you should change the debug value of the internal object. You can do it like:
```
$.nmInternal({debug: true});
```

By default, the debug function show function name in the console. If you want do something else, you should overwrite the _debug function like:
```
$.nmInternal({
  _debug: function(msg) {
	if (this.debug && window.console && window.console.log)
	  window.console.log(msg);
  }
});
```


##Help
You can find some useful tips on the [issues labeled with tips](https://github.com/nyroDev/nyroModal/issues?q=label%3Atips+)

If it's still not enought, be free to open an Issue on github.