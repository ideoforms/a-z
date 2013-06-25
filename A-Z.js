/*---------------------------------------------------------------------------*
 * A-Z.js: Alphabetically sorts the contents of an HTML document, leaving
 *         formatting and sentence structures in place.
 *
 * Daniel Jones <http://www.erase.net/> 2013
 *---------------------------------------------------------------------------*/

var words = [];
function split(t)
{
	var words = t.split(/\s+/);

	// remove trailing or leading punctuation, tabs, etc...
	words = words.map(function (word) { return word.replace(/^[^\w]+/, '').replace(/[^\w]+$/, ''); });

	// filter out empty words, and long words (mostly URLs)
	words = words.filter(function (word) { return /\S/.test(word) && word.length < 20; });

	return words;
}
function read(t)
{
	// recursively parse the contents of t, appending any word tokens to the words array
	if (t.tagName != 'SCRIPT' && t.tagName != 'NOSCRIPT' && t.tagName != 'STYLE')
	{
		if (t.childNodes.length)
		{
			for(var n = 0; n < t.childNodes.length; n++)
				read(t.childNodes[n])
		}
		if (t.nodeType == Node.TEXT_NODE && /\S/.test(t.nodeValue))
		{
			words = words.concat(split(t.nodeValue));
		}
	}
}
function write(t)
{
	if (t.tagName != 'SCRIPT' && t.tagName != 'NOSCRIPT' && t.tagName != 'STYLE')
	{
		if (t.childNodes.length)
		{
			for(var n = 0; n < t.childNodes.length; n++)
				write(t.childNodes[n])
		}
		if (t.nodeType == Node.TEXT_NODE && /\S/.test(t.nodeValue))
		{
			// below works nicely for hashtags etc, but fails on words containing international characters 
			// t.nodeValue = t.nodeValue.replace(/[\w'-]+/g, function (word) { return words.length > 0 ? words.splice(0, 1)[0] : ''; });

			//-----------------------------------------------------------------
			// other edge cases:
			//  - word in brackets
			//  - start of a single quote
			//  - hashtags (would like to retain)
			//  - URLs (are turned into aardvark://abacus.adder/alphabet/...)
			//  - U.S. (think we just have to ignore this one)
			//-----------------------------------------------------------------
			
			// note that the below line isn't compacted properly by the bookmark crunchinator
			// -- must remove the single-quote and re-add manually
			t.nodeValue = t.nodeValue.replace(/[\w'][^\s#@.,/()"]*/g, function (word) { return words.length > 0 ? words.splice(0, 1)[0] : ''; });

			//-----------------------------------------------------------------
			// Uncomment the below to maintain capitalisation
			// t.nodeValue = t.nodeValue.replace(/[\w-]+/g, function (word) {
				// repl = words.splice(0, 1)[0];
				// if (!/[A-Z]/.test(word))
				//  	return repl.toLowerCase();
				// else if (/^[A-Z][^A-Z]+$/.test(word))
				// 	return repl.charAt(0).toUpperCase() + repl.slice(1).toLowerCase();
				// else if (!/[a-z]/.test(word))
				// 	return repl.toUpperCase();
				// else
				// 	return repl;
			// });
			//-----------------------------------------------------------------
		}
	}
}
function az()
{
	read(document.getElementsByTagName('body')[0]);
	words = words.sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()); });
	write(document.getElementsByTagName('body')[0]);
}
az();
