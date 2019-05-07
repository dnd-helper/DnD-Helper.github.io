(function(){


/* !-- Global Variables -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	var moduleName = "ark-cover-background";




/* !-- Static Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	CoverBackground.initAll = function() {
		var backgrounds = document.querySelectorAll("." + moduleName + ":not([data-" + moduleName + "-initiated])"),
			i;
		
		for ( i = 0; i < backgrounds.length; i++ ) {
			new CoverBackground(backgrounds[i]);
		}
	};




/* !-- Constructor -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function CoverBackground(__backgroundElement) {
		// Private Variables
		var _context = this,
			_backgroundItem = __backgroundElement.querySelector("video, img");
		
		
		
		
		// Getters and Setters
		this.getBackgroundElement = function() { return __backgroundElement; }
		this.getBackgroundItem = function() { return _backgroundItem; }
		
		
		// Replaces the video for an image on mobile devices 
		if ( window.ark.isMobile() && _backgroundItem.nodeName.toLowerCase() == "video" ) {
			
			var videoImageReplacementSource = _backgroundItem.querySelector("img") ? _backgroundItem.querySelector("img").getAttribute("src") : null || _backgroundItem.getAttribute("placeholder"),
				videoImageReplacement = null;
			
			if (videoImageReplacementSource) {
				videoImageReplacement = document.createElement("img");
				videoImageReplacement.setAttribute("src", videoImageReplacementSource);
				_backgroundItem.parentNode.insertBefore(videoImageReplacement, _backgroundItem);
			}
			
			
			_backgroundItem.parentNode.removeChild(_backgroundItem);
			
			_backgroundItem = videoImageReplacement;
		}
		
		
		// Adds a load event and contains the background element
		if ( _backgroundItem ) {
			if (!__backgroundElement.ark) __backgroundElement.ark = {};
			__backgroundElement.ark.coverBackground = _context;
			__backgroundElement.setAttribute("data-" + moduleName + "-initiated", "true");
			
			if ( !_backgroundItem.videoWidth && !_backgroundItem.naturalWidth ) {
				if (!_backgroundItem.ark) _backgroundItem.ark = {};
				_backgroundItem.ark.coverBackground = _context;
				
				
				if ( _backgroundItem.nodeName.toLowerCase() == "video" ) {
					var sources = _backgroundItem.querySelectorAll("source"),
						j;
					
					for ( j = 0; j < sources.length; j++ ) {
						sources[j].addEventListener("loadedmetadata", backgroundItemLoaded);
					}
					
					_backgroundItem.addEventListener("loadedmetadata", backgroundItemLoaded);
				} else if ( _backgroundItem.nodeName.toLowerCase() == "img" ) {
					_backgroundItem.addEventListener("load", backgroundItemLoaded);
				}
				
			} else {
				containBackgroundItem(_context);
			}
		}
	}




/* !-- Private Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	
	/* -- Background item has loaded -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function backgroundItemLoaded() {
		containBackgroundItem(this.ark.coverBackground);
	}
	
	
	
	
	/* -- Contains all backgrounds -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function containBackgrounds() {
		var backgrounds = document.querySelectorAll("." + moduleName + "[data-" + moduleName + "-initiated]"),
			i;
		
		for ( i = 0; i < backgrounds.length; i++ ) {
			if ( backgrounds[i].ark && backgrounds[i].ark.coverBackground ) {
				containBackgroundItem(backgrounds[i].ark.coverBackground);
			}
		}
	}
	function containBackgroundItem(__coverBackground) {
		var backgroundElement  = __coverBackground.getBackgroundElement(),
			containerRect      = backgroundElement.getBoundingClientRect(),
			backgroundItem     = __coverBackground.getBackgroundItem(),
			backgroundItemSize = { width: backgroundItem.videoWidth || backgroundItem.naturalWidth, height: backgroundItem.videoHeight || backgroundItem.naturalHeight },
			newSize            = { width: containerRect.width, height: containerRect.width / backgroundItemSize.width * backgroundItemSize.height },
			orientation        = "landscape";
			
			if ( newSize.height < containerRect.height ) {
				newSize = { width: containerRect.height / backgroundItemSize.height * backgroundItemSize.width, height: containerRect.height };
				orientation = "portrait";
			}
			
			if ( backgroundElement.getAttribute("data-ark-cover-background-orientation") != orientation ) {
				backgroundElement.setAttribute("data-ark-cover-background-orientation", orientation);
				if (orientation == "landscape") {
					backgroundItem.style.setProperty("width", "100%");
					backgroundItem.style.setProperty("height", "auto");
				} else if (orientation == "portrait") {
					backgroundItem.style.setProperty("height", "100%");
					backgroundItem.style.setProperty("width", "auto");
				}
			}
	}
	
	




/* !-- Public Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	




/* -- Adds the object -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	if (!window.ark) window.ark = {};
	
	if (!window.ark.CoverBackground)
		window.ark.CoverBackground = CoverBackground;
	
	document.addEventListener("DOMContentLoaded", function(){
		window.ark.CoverBackground.initAll();
	});
	
	window.addEventListener("resize", containBackgrounds);


}());