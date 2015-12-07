<!--
/*
WM_setCookie(), WM_readCookie(), WM_killCookie()
A set of functions that eases the pain of using cookies.

Source: Webmonkey Code Library
(http://www.hotwired.com/webmonkey/javascript/code_library/)
Author: Nadav Savio
Author Email: nadav@wired.com

Usage:
WM_setCookie('name', 'value'[, hours, 'path', 'domain', secure]);
where name, value, and path are strings, and secure is either true or null. Only name and value are required. Note: hours can be either a number of hours until the cookie expires or a GMT-formatted date string such as 'Fri, 13-Apr-1970 00:00:00 GMT'.

WM_readCookie('name');
Returns the value associated with name.

WM_killCookie('name'[, 'path', 'domain']);
Remember that path and domain must be supplied if they were set with the cookie.
*/

// This next little bit of code tests whether the user accepts cookies.
var WM_acceptsCookies = false;
if(document.cookie == '') {
    document.cookie = 'WM_acceptsCookies=yes'; // Try to set a cookie.
    if(document.cookie.indexOf('WM_acceptsCookies=yes') != -1) {
	WM_acceptsCookies = true;
    }// If it succeeds, set variable
} else { // there was already a cookie
  WM_acceptsCookies = true;
}

function WM_setCookie (name, value, hours, path, domain, secure) {
    if (WM_acceptsCookies) { // Don't waste your time if the browser doesn't accept cookies.
	var not_NN2 = (navigator && navigator.appName
		       && (navigator.appName == 'Netscape')
		       && navigator.appVersion
		       && (parseInt(navigator.appVersion) == 2))?false:true;

	if(hours && not_NN2) { // NN2 cannot handle Dates, so skip this part
	    if ( (typeof(hours) == 'string') && Date.parse(hours) ) { // already a Date string
		var numHours = hours;
	    } else if (typeof(hours) == 'number') { // calculate Date from number of hours
		var numHours = (new Date((new Date()).getTime() + hours*3600000)).toGMTString();
	    }
	}
	document.cookie = name + '=' + escape(value) + ((numHours)?(';expires=' + numHours):'') + ((path)?';path=' + path:'') + ((domain)?';domain=' + domain:'') + ((secure && (secure == true))?'; secure':''); // Set the cookie, adding any parameters that were specified.
    }
} // WM_setCookie

function WM_readCookie(name) {
    if(document.cookie == '') { // there's no cookie, so go no further
	return false;
    } else { // there is a cookie
	var firstChar, lastChar;
	var theBigCookie = document.cookie;
	firstChar = theBigCookie.indexOf(name);	// find the start of 'name'
	var NN2Hack = firstChar + name.length;
	if((firstChar != -1) && (theBigCookie.charAt(NN2Hack) == '=')) { // if you found the cookie
	    firstChar += name.length + 1; // skip 'name' and '='
	    lastChar = theBigCookie.indexOf(';', firstChar); // Find the end of the value string (i.e. the next ';').
	    if(lastChar == -1) lastChar = theBigCookie.length;
	    return unescape(theBigCookie.substring(firstChar, lastChar));
	} else { // If there was no cookie of that name, return false.
	    return false;
	}
    }
} // WM_readCookie

function WM_killCookie(name, path, domain) {
  var theValue = WM_readCookie(name); // We need the value to kill the cookie
  if(theValue) {
      document.cookie = name + '=' + theValue + '; expires=Fri, 13-Apr-1970 00:00:00 GMT' + ((path)?';path=' + path:'') + ((domain)?';domain=' + domain:''); // set an already-expired cookie
  }
} // WM_killCookie

// Use a global JS value is case no cookies
var defaultFontSize = 62;
var globalFontSize;
var globalFontSizeMax = 110;
var globalFontSizeMin = 56;

// Initialization function
function setFont(){
	if(WM_acceptsCookies && WM_readCookie('fontSize') && !isNaN(WM_readCookie('fontSize') ) ) {
		setFontSize(WM_readCookie('fontSize'));
	}else{
		//default font size is set here
		//default should also be set in style in case no JavaScript
		setFontSize(defaultFontSize);
	}
	//also set Google search text
	initSearch();
}
function changeFontSize(pct){
	globalFontSize = parseInt(globalFontSize) + parseInt(pct);
	setFontSize(globalFontSize);
}
function setFontSize(pct){
	//must change any styles at the highest or "base" level to make the page work correctly
	if( pct >= globalFontSizeMin && pct <= globalFontSizeMax ){
	var bod = document.getElementsByTagName('body')[0];
	bod.style.fontSize = pct+"%";
	globalFontSize = pct;
	WM_killCookie("fontSize","/",".yourdomain");
	//one year
	WM_setCookie("fontSize",pct,8760,"/",".yourdomain",false);
	}

}

// Fill search box code.
	function clearGoogle(){
		var q = document.getElementsByName("q")[0];
		if(q.value == "Search" && q.className=="googlite" ){
			q.className="goog";
			q.value = "";
		}
	}
	function fillGoogle(){
		var q = document.getElementsByName("q")[0];
		q.className="googlite";
		q.value="Search";
	}
	function checkGoogle(){
		var q = document.getElementsByName("q")[0];
		if(q.value == "" && q.className=="goog" ){
			fillGoogle();
		}else if(q.value == "Search" && q.className=="googlite" ){
			clearGoogle();
		}
	}
	function initSearch(){
		var q = document.getElementsByName("q")[0];
		q.onfocus=checkGoogle;
		q.onblur=checkGoogle;
		fillGoogle();
	}

// Check for search box
function search(value) {
	if ((value == "Search" || value == "") || (value == "Enter Search Term" || value == "")) {
		return false;
	}
		else {
			return true;
		}
}

// Dropdown menu code
function dropDownMenu(navItems) {
    navItems = navItems || '#navBar .navItem';
    var $element = $(navItems);

	$element.hoverIntent({
		interval: 50, // milliseconds delay before onMouseOver
		over: drops_show,
		timeout: 150, // milliseconds delay before onMouseOut
		out: drops_hide
	});

	$.ajax({
    	type: "GET",
    	url: "files/drop_menus.xml",
    	dataType: "xml",
    	success: parseMenu
	});

  	var menuCounter = -1;

  	function parseMenu(xml) {
		$(xml).find("menu").each(function(i) {

			if ($(this).find("item").text() != "empty") {
                $element.filter(":eq("+i+")")
                    .addClass('with-js')
				    .append("<div class='navDrop'></div>");
				menuCounter = menuCounter + 1
			}
            else {
				return true;
			}
			$(this).find("item").each(function(j) {
				var label = $(this).find("label").text();
				var linky = $(this).find("link").text();
		   		$(".navDrop:eq("+menuCounter+")").append("<div><a href="+linky+">"+label+"</a></div>");
  			});
	  	});
	}

	function drops_show(){ $(this).addClass('show'); $(this).removeClass('with-js'); }
	function drops_hide(){ $(this).removeClass('show'); $(this).addClass('with-js'); }
}

// -->
