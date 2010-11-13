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