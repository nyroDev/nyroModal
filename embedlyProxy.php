<?php

// Directory to cache the results (should be writable !)
$cacheDir = 'cache';

// Embed.ly API key
// If null, the one set in JavaScript will be used
// If not null, this key will replace the one set in JavaScript
$key = 'EMBED.LY API KEY';

// Referer to restrict the call from
$referers = array(
	'*.nyrodev.com/*'
);

// Embed.ly API URL (change only if you know what you're doing)
$urlApi = 'http://api.embed.ly/1/oembed';

// Replace callback used for caching. (change only if you know what you're doing)
$replaceClb = 'DUMMYCALLBACK';


//--------------------------------------------------------------//
// Do not edit under this line ---------------------------------//
//--------------------------------------------------------------//


// Referers checks Start
$continue = false;
$httpReferer = $_SERVER['HTTP_REFERER'];
if ($httpReferer) {
	foreach($referers as $referer) {
		$referer = '`^'.str_replace(
			array('.', '*'),
			array('\\.', '.*'),
			$referer).'$`i';
		$continue = $continue || !!preg_match($referer, $httpReferer);
	}
}

if (!$continue) {
	header('HTTP/1.0 401 Unauthorized');
	echo 'Unauthorized';
	exit;
}
// Referers checks End

$params = $_GET;

$clb = $params['callback'];
unset($params['callback']);
unset($params['_']);

$fileCache = $cacheDir.DIRECTORY_SEPARATOR.md5(serialize($params)).'.json';
if (!file_exists($fileCache)) {
	// File do not exists in cache, get it
	$params['callback'] = $replaceClb;
	if ($key)
		$params['key'] = $key;
	$url = $urlApi.'?'.http_build_query($params);
	$content = file_get_contents($url);
	file_put_contents($fileCache, $content);
} else {
	$content = file_get_contents($fileCache);
}

// Send the json
header('Content-type: application/javascript');
echo str_replace($replaceClb, $clb, $content);