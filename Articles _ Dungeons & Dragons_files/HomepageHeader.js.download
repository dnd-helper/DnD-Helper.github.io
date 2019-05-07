/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* -- Homepage Header -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function(){

/* !-- Global Variables -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	var _cssClasses = {
			module          : "module_homepage-header",
			carousel        : "module_homepage-header--carousel",
			slide           : "module_homepage-header--carousel--slide",
			activeSlide     : "slick-active",
			videoPoster     : "module_homepage-header--carousel--slide--content--aside--video--poster",
			videoPlayer     : "module_homepage-header--carousel--slide--content--aside--video--player",
			backgroundImage : "module_homepage-header--carousel--slide--background",
			playing         : "playing"
		},
		_dataAttributes = {
			initialized : "data-homepage-header-initialized",
			autoplay    : "data-autoplay",
			videoType   : "data-video-type",
			videoId     : "data-video-id"
		};




/* !-- Static Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	/**
	 * Initializes all uninitialized homepage headers.
	 */
	HomepageHeader.initAll = function() {
		var homepageHeaders = document.querySelectorAll("." + _cssClasses.module + ":not([" + _dataAttributes.initialized + "])"),
			i;

		for ( i = 0; i < homepageHeaders.length; i++ ) {
			new HomepageHeader(homepageHeaders[i]);
		}
	}




/* !-- Constructor -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	/**
	 * HomepageHeader instance constructor.
	 *
	 * @param {HTMLElement} __element - HHTML element for the homepage header.
	 */
	function HomepageHeader(__element) {
		// Getters and Setters
		this.getElement  = function() { return __element };
		this.getCarousel = function() { return __element.querySelector("." + _cssClasses.carousel) };
		this.getCurrentSlide = function() { return __element.querySelector("." + _cssClasses.carousel + " ." + _cssClasses.slide + "." + _cssClasses.activeSlide); };



		// Initializes the object
		__element.setAttribute(_dataAttributes.initialized, "true");

		var context = this,
			carousel = context.getCarousel();


		if (!carousel.ark) carousel.ark = {};
		carousel.ark.homepageHeader = context;


		function initPosterButtons() {
			var posterButtons = carousel.querySelectorAll("." + _cssClasses.videoPoster),
				i;

			for ( i = 0; i < posterButtons.length; i++ ) {
				if ( !posterButtons[i].ark ) posterButtons[i].ark = {};
				posterButtons[i].ark.homepageHeader = context;
				posterButtons[i].addEventListener("click", posterButtonClicked)
			}
		}




		window.jQuery(carousel).on("afterChange", slideChanged);
		window.jQuery(carousel).on("init", initPosterButtons);
		window.jQuery(carousel).on("init", slideChanged);

		window.jQuery(carousel).slick({
			adaptiveHeight : true,
			arrows         : false,
			autoplay       : context.getCarousel().getAttribute(_dataAttributes.autoplay) === "true",
			autoplaySpeed  : 1000 * 5,
			dots           : context.getCarousel().querySelectorAll("." + _cssClasses.slide).length > 1,
			draggable      : false,
			infinite       : true,
			pauseOnFocus   : false,
			pauseOnHover   : false
		});
	}




/* !-- Private Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function slideChanged() {
		var context = this.ark.homepageHeader;


		setTimeout(function() {
			stopAllVideos(context);
			autoplayVideo(context);
		}, 1);
	}




	function stopAllVideos(__context) {
		var videos = __context.getCarousel().querySelectorAll("." + _cssClasses.videoPlayer + " iframe"),
			i;

		for ( i = 0; i < videos.length; i++ ) {
			videos[i].parentNode.classList.remove("playing");
			videos[i].parentNode.removeChild(videos[i]);
		}
	}




	function autoplayVideo(__context) {
		var currentSlide = __context.getCurrentSlide(),
			videoPoster = currentSlide.querySelector("." + _cssClasses.videoPoster),
			backgroundVideo = currentSlide.querySelector("." + _cssClasses.backgroundImage + " video");

		if ( videoPoster && videoPoster.getAttribute(_dataAttributes.autoplay) === "true" ) {
			videoPoster.click();
		}

		if ( backgroundVideo ) {
			backgroundVideo.play();
		}
	}




	function posterButtonClicked() {
		var videoPlayer = this.parentNode.querySelector("." + _cssClasses.videoPlayer);

		window.jQuery(this.ark.homepageHeader.getCarousel()).slick("slickPause");

		addVideoElement(
			this.getAttribute(_dataAttributes.videoType),
			this.getAttribute(_dataAttributes.videoId),
			this.getAttribute(_dataAttributes.autoplay) === "true",
			videoPlayer
		);

		videoPlayer.classList.add(_cssClasses.playing)
	}




	/**
	 * Adds the a video element to the video player HTML container
	 *
	 * @param {HTMLAnchorElement} __videoType - The type of the video to display [youtube|twitch-channel|twitch-video].
	 * @param {HTMLAnchorElement} __videoId - The ID of the video.
	 */
	function addVideoElement(__videoType, __videoId, __autoplay, __videoContainer) {
		var videoURL = "";

		switch ( __videoType ) {
			case "facebook":
				videoURL = "https://www.facebook.com/plugins/video.php?href={VIDEO_ID}&show_text=0&autoplay=" + (__autoplay ? "1" : "0");
				break;

			case "mixer":
				videoURL = "https://mixer.com/embed/player/{VIDEO_ID}?disableLowLatency=1";
				break;

			case "twitch-channel":
			case "twitch":
				videoURL = "https://player.twitch.tv/?channel={VIDEO_ID}&autoplay=true" + (__autoplay ? "&muted=true" : "");
				break;

			case "twitch-video":
				videoURL = "https://player.twitch.tv/?video=v{VIDEO_ID}&autoplay=true" + (__autoplay ? "&muted=true" : "");
				break;

			case "twitch-clip":
				videoURL = "https://clips.twitch.tv/embed?clip={VIDEO_ID}&autoplay=true" + (__autoplay ? "&muted=true" : "");
				break;

			case "youtube":
			case "youtube-live":
				videoURL = "https://www.youtube.com/embed/{VIDEO_ID}?rel=0&autoplay=" + (__autoplay ? "1" : "0");
				break;

			default:
				break;
		}

		videoURL = videoURL.replace(/\{VIDEO_ID\}/gi, encodeURIComponent(__videoId));

		__videoContainer.innerHTML = '<iframe src="' + videoURL + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowTransparency="true" allowfullscreen="true"></iframe>';
	}





/* !-- Public Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */





/* -- Adds the object -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	if (!window.ark) window.ark = {};

	if (!window.ark.HomepageHeader)
		window.ark.HomepageHeader = HomepageHeader;


	document.addEventListener("DOMContentLoaded", function() {
		HomepageHeader.initAll();
	});


}());