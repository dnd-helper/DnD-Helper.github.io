// Arketype Object
if (!window.ark) window.ark = new Object();




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */




/* !-- Universal Event Listeners -- */
/*
	ark.Events.add(obj, evt, func{, capture})
	ark.Events.remove(obj, evt, func{, capture})
*/
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function(window){

	// Constructor
	function Events() {}


	// Adds an event to an object
	Events.add = function(obj, evt, func, capture) {
		if ( typeof obj  == "object" ) {
			if ( capture != true ) capture = false;
			if ( obj.addEventListener )
				obj.addEventListener(evt, func, capture);
			else if ( obj.attachEvent )
				obj.attachEvent("on" + evt, func);
		}
	};


	// Removes an event from an object
	Events.remove = function(obj, evt, func, capture) {
		if ( typeof obj  == "object" ) {
			if ( capture != true ) capture = false;
			if ( obj.removeEventListener )
				obj.removeEventListener(evt, func, capture);
			else if ( obj.detachEvent )
				obj.detachEvent("on" + evt, func);
		}
	};


	// Detects touch events
	Events.touchSupported = "ontouchstart" in window;


	// Adds the object
	if (!window.ark) window.ark = new Object();

	if (!window.ark.Events)
		window.ark.Events = Events;


}(window));




/* !-- Cookies -- */
/*
	ark.Cookies.get({cookieName})
	ark.Cookies.remove({cookieName}, path, domain)
	ark.Cookies.set(cookieName, cookieValue{, expires, path, domain})
*/
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function(window){
	var _agreementCookieName = "cookie-agreed";


	// Constructor
	function Cookies() {}


	Cookies.setAgreementCookieValue = function(__value) {
		window.ark.Cookies.set(_agreementCookieName, String(__value), "10y");
	}


	Cookies.getAgreementCookieValue = function() {
		return Cookies.get(_agreementCookieName);
	}


	Cookies.getAgreement = function() {
		var agreementValue = Cookies.getAgreementCookieValue();
		return agreementValue != "-1" && agreementValue!= "0";
	}


	// Gets the main domain
	Cookies.getMainDomain = function() {
		var hostName   = window.location.hostname,
			hostParts  = hostName.split("."),
			mainDomain = "",
			i;

		for ( i = hostParts.length - 1; i >= 0 && i >= hostParts.length - 2; i-- ) {
			mainDomain = hostParts[i] + (i != hostParts.length - 1 ? "." : "") + mainDomain;
		}

		return mainDomain;
	};

	// Gets the requested cookie
	Cookies.get = function(cookieName) {
		var allCookies = {};

		var cookiesValues = document.cookie.split("; ");
		for ( var i = 0; i < cookiesValues.length; i++ ) {
			var key   = cookiesValues[i].split("=")[0];
			var value = window.unescape(cookiesValues[i].split("=")[1]);

			if (key) {
				allCookies[key] = value;
			}
		}

		if (cookieName) {
			return allCookies[cookieName];
		} else {
			return allCookies;
		}
	};


	// Remove the requested cookie
	Cookies.remove = function(cookieName, path, domain) {
		var allCookies = {};

		if ( cookieName ) {
			allCookies[cookieName] = "";
		} else {
			allCookies = Cookies.get();
		}

		for ( var key in allCookies ) {
			if ( key != _agreementCookieName && key != "language" ) {
				Cookies.set(key, "", "-1y", path, domain, true);
			}
		}
	};


	// Expiration is a string with an integer that ends with a character ( d = days, m = months, y = years )
	Cookies.set = function(cookieName, cookieValue, expires, path, domain, removing) {
		if ( cookieName ) {
			if ( cookieName === "cookie-agreed" || cookieName === "language" || removing === true || window.ark.Cookies.getAgreement() ) {
				var strExpires = "";
				if (expires) {
					var duration = parseInt(expires.substring(0, expires.length - 1));
					var period = expires.substring(expires.length - 1).toLowerCase();

					if ( !isNaN(duration) && (period === "d" || period === "m" || period === "y" ) ) {
						var periodFunction;
						if ( period === "d" ) {
							periodFunction = "Date";
						} else if ( period === "m" ) {
							periodFunction = "Month";
						} else if ( period === "y" ) {
							periodFunction = "FullYear";
						}

						var expirationDate = new Date();
						expirationDate["set" + periodFunction]( expirationDate["get" + periodFunction]() + duration );

						strExpires = "; expires=" + expirationDate.toGMTString();
					}
				}

				var strPath = "",
					strDomain = "";

				if ( !removing || domain ) {
					strPath = "; path=" + (path ? path : "/");
					strDomain = "; domain=" + (domain ? domain : ark.Cookies.getMainDomain());
				}

				document.cookie = cookieName + "=" + window.escape(cookieValue) + strExpires + strPath + strDomain;
			}
		}
	};


	// Adds the object
	if (!window.ark) window.ark = new Object();

	if (!window.ark.Cookies)
		window.ark.Cookies = Cookies;


	/* !-- Remove all cookies if needed -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	if ( Cookies.getAgreementCookieValue() === "-1" ) {
		window.addEventListener("load", function() {
			Cookies.remove();
			Cookies.remove(null, null, Cookies.getMainDomain());
		});
	}
}(window));




/* !-- Location Query -- */
/*
	ark.locationQuery['someUrlProperty']
	ark.LocationQuery.keyValuePairs()
	ark.LocationQuery.convertURL(url)
*/
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function(window){

	// Constructor
	function LocationQuery() {
		var _convertedURL = LocationQuery.convertURL(location.href);
		var _keyValuePairs = _convertedURL.keyValuePairs;

		// Creates a getter for each key found
		for ( var i in _convertedURL.properties ) {
			eval('this[i] = function(){ return "' + _convertedURL.properties[i] + '"; }');
		}

		// Returns all the key value pairs
		this.keyValuePairs = function() { return _keyValuePairs; };
	}


	// Converts into an object from a provided URL
	LocationQuery.convertURL = function() {
		var keyValuePairs = [];
		var properties    = {};

		var query = location.search.replace(/^\?/, "");

		if (query.length) {
			var pairs = query.split("&");
			var key, value;

			for ( var i = 0; i < pairs.length; i++ ) {
				key = pairs[i].substring(0, pairs[i].indexOf("="));
				value = pairs[i].substring(pairs[i].indexOf("=") + 1);

				keyValuePairs.push({ key: key, value: value });
				properties[key] = value;
			}
		}

		return { keyValuePairs: keyValuePairs, properties: properties };
	};


	// Adds the object
	if (!window.ark) window.ark = new Object();

	if (!window.ark.LocationQuery)
		window.ark.LocationQuery = LocationQuery;

	if (!window.ark.locationQuery)
		window.ark.locationQuery = new LocationQuery();

}(window));




/* !-- Locale -- */
/*
	ark.Locale.get()
*/
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function(window){

	// Constructor
	function Locale() { }


	// Returns the document locale
	Locale.get = function() {
		var locale = { lang: "en", country: null, iso: "en" },
			localeAttr = document.documentElement.lang;

		if (localeAttr) {
			localeAttr = localeAttr.split("-");

			if (localeAttr[0])
				locale.lang = localeAttr[0];

			if (localeAttr[1])
				locale.country = localeAttr[1].toUpperCase();

			if ( document.getElementById("ddl-countries-dev") )
				locale.country = document.getElementById("ddl-countries-dev").value;
		}

		locale.iso = locale.lang + (locale.country ? "-" + locale.country : "");

		return locale;
	};

	// Adds the object
	if (!window.ark) window.ark = new Object();

	if (!window.ark.Locale)
		window.ark.Locale = Locale;


}(window));




/* !-- Ajax -- */
/*
	(new ark.Ajax()).send(url, parserFunction {, responseMethod, method, data, sendMethod})
*/
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function(window){

	// Constructor
	function Ajax() {}


	// Handles the Ajax request
	function requestHandler(request, parserFunction, responseMethod, sendMethod) {
		var response = null;

		if ( request.readyState == 4 ) {
			var status = parseInt(request.status);

			if ( (status >= 200) && (status < 300) ) {
				if ( responseMethod == "XML" ) {
					for ( var cNodes = 0; cNodes < request.responseXML.childNodes.length; cNodes++) {
						var treeNode = request.responseXML.childNodes[cNodes];
						if (treeNode.nodeType == 1) {
							response = treeNode;
							cNodes = request.responseXML.childNodes.length;
						}
					}
				} else {
					if ( sendMethod == "JSON" ) {
						response = request.responseText ? eval("(" + request.responseText + ")") : null;
					} else
						response = request.responseText;
				}
			} else {
				response = { error: { errorCode: request.status, message: request.statusText, errorID: request.responseText } }
			}

			if ( parserFunction )
				parserFunction(response);
		}
	}


	// Sends the Ajax request
	Ajax.prototype.send = function(url, parserFunction, responseMethod, method, data, sendMethod) {
		if (responseMethod == null) responseMethod = "JSON";
		if (sendMethod == null) sendMethod = "JSON";

		if (method == null) method = "GET";

		var request = null;

		if ( window.XMLHttpRequest )
			request = new XMLHttpRequest();
		else if (window.ActiveXObject)
			request = new window.ActiveXObject("Microsoft.XMLHTTP");

		if ( request ) {
			var obj = { ajax: this, request: request, parserFunction: parserFunction, responseMethod: responseMethod, sendMethod: sendMethod };

			request.onreadystatechange = function () { requestHandler(obj.request, obj.parserFunction, obj.responseMethod, obj.sendMethod); };

			request.open(method, url, true);
			if (request.setRequestHeader) {
				request.setRequestHeader("Content-type", responseMethod == "JSON" ? "application/json" : "application/x-www-form-urlencoded");
				if (sendMethod == "JSON")
					request.setRequestHeader("Accept", "application/json");
				else
					request.setRequestHeader("Accept", "text/plain");
			}

			request.send(responseMethod == "JSON" ? JSON.stringify(data) : data);
		}
	};


	// Adds the object
	if (!window.ark) window.ark = new Object();

	if (!window.ark.Ajax)
		window.ark.Ajax = Ajax;


}(window));




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */




/* !-- Returns 'true' if device is mobile -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.isMobile = function() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};




/* !-- Tries to activate menu items for the current page based on the body tag classes -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.activateCurrentMenuButton = function() {
	if (!document.getElementById("page"))
		return;

	var menuPrefix = ".mn_",
		classes = document.getElementById("page").className.split(" "),
		menuButtons;

	for ( var i = 0; i < classes.length; i++ ) {
		menuButtons = document.querySelectorAll(menuPrefix + classes[i]);
		for ( var j = 0; j < menuButtons.length; j++ ) {
			if ( !(/current/i).test(menuButtons[j].className) ) {
				menuButtons[j].className = "current " + menuButtons[j].className;
			}
		}
	}
};




/* !-- Handles the Retina Display -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.handleRetinaDisplay = function() {
	if ( window.devicePixelRatio > 1 ) {

		// Appends a retina class to the body
		if ( !(/retina/i).test(document.body.className) )
			document.body.className = "retina" + (document.body.className.length ? " " + document.body.className : "");

		// Replaces images that should to be replaced for retina ( with an "@1x" )
		var images = document.getElementsByTagName("img"),
			regexp = new RegExp("@1x", "gi");

		for ( var i = 0; i < images.length; i++ ) {
			if ( regexp.test(images[i].src) )
				images[i].src = images[i].src.replace(regexp, "@2x");
		}
	}
};




/* !-- Empties an HTML element -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.emptyElement = function() {
	for ( var el in arguments ) {
		if (arguments[el]) {
			while (arguments[el].firstChild)
				arguments[el].removeChild(arguments[el].firstChild);
		}
	}
};




/* !-- Prevents a default action on an event handler -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.preventDefaultAction = function(evt) {
	var _evt = evt ? evt:window.event;

	if (_evt.preventDefault) {
		_evt.preventDefault();
	}

	_evt.returnValue = false;

	return false;
};




/* !-- Trims the whitespaces at the beginning and the end of a string -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
if ( !String.prototype.trim ) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g,'');
	};
}




/* !-- Shuffles the content of an array -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
if ( !Array.prototype.shuffle ) {
	Array.prototype.shuffle = function() {
		for (var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
		return this;
	};
}




/* !-- Test methods for Storage (localStorage, sessionStorage) -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function(){
	function testStorage(__storage) {
		var enabled = true,
			testString = "__-__ARK-STORAGE-TEST__-__";

		try {
			__storage.setItem(testString, "true");
			__storage.removeItem(testString);
		} catch(e) {
			enabled = false;
		}

		return enabled;
	}

	if (!Storage.prototype.testLocalStorage) {
		Storage.prototype.testLocalStorage = function() {
			return testStorage(localStorage);
		};


		Storage.prototype.testSessionStorage = function() {
			return testStorage(sessionStorage);
		};
	}
})();




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */




/* !-- Creates HTML5 tags for MSIE 8 and older -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
if ( navigator.userAgent.indexOf("Trident") != -1 ) {
	var version = parseFloat( navigator.userAgent.substring(navigator.userAgent.indexOf("Trident/") + 8) );

	if (version < 5) {
		var aElements = ["article", "aside", "audio", "bdi", "canvas", "command", "datalist", "details", "embed", "figcaption", "figure", "footer", "header", "keygen", "mark", "meter", "nav", "output", "progress", "rp", "rt", "ruby", "section", "source", "summary", "time", "track", "video", "wbr"];
		for (var i = 0; i < aElements.length; i++) {
			document.createElement(aElements[i]);
		}
	}
}




/* !-- Arketype page load event -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.Events.add(window, "load", function() {
	ark.activateCurrentMenuButton();

	// Adds a "loaded" class to the body
	document.body.classList.add("loaded");

	// Adds a mobile class to the body
	if ( ark.isMobile() ) {
		document.body.classList.add("mobile");
	}


	// Adds a touchSupported class to the body
	if ( ark.Events.touchSupported ) {
		document.body.classList.add("touch-supported");
	}

	// Handles the Retina display
	// ark.handleRetinaDisplay();


	/* -- Handles SVG inclusion elements -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	(function(){
		if (!window.ark) window.ark = {};
		window.ark.SVGUtilies = {
			replaceImage: function(_placeholder) {
				(function() {
					(new ark.Ajax()).send(_placeholder.getAttribute(svgURLAttribute), function(response) {
						replaceImage(response, _placeholder);
					}, "XML", "GET", null, null, true, true);
				})();
			}
		};

		var svgURLAttribute = "data-svg-url",
			placeholders = document.querySelectorAll("*[" + svgURLAttribute + "]"),
			i = 0;

		function replaceImage(__svg, __placeholder) {
			var _attributes = __placeholder.attributes,
				_svgTitle = __svg.querySelector("title"),
				_i = 0;

			for (  _i = 0; _i < _attributes.length; _i++ ) {
				if (_attributes[_i].name != "src" &&
					_attributes[_i].name != "alt" &&
					_attributes[_i].name != svgURLAttribute) {
					__svg.setAttribute(_attributes[_i].name, _attributes[_i].value);

					if ( _attributes[_i].name.toLowerCase() === "title" ) {
						if (!_svgTitle) {
							_svgTitle = document.createElement("title");
							__svg.insertBefore(_svgTitle, __svg.firstChild);
						}

						_svgTitle.textContent = _attributes[_i].value;
					}
				}
			}

			__placeholder.parentNode.insertBefore(__svg, __placeholder);
			__placeholder.parentNode.removeChild(__placeholder);
		}

		for ( i = 0; i < placeholders.length; i++ ) {
			ark.SVGUtilies.replaceImage(placeholders[i]);
		}
	})();


});
