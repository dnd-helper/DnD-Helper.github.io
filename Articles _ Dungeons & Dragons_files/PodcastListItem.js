/* -- Podcasts List Item -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function(){




/* -- Global Varialbles -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	var globals = {
		cssClasses: {
			listItem                : "ark-podcast-list-item",
			openToPlayButton        : "ark-podcast-list-item--open-to-play",
			playerWindow            : "ark-podcast-list-item--player-window",
			playerWindowOpened      : "ark-podcast-list-item--player-window-opened",
			closePlayerWindowButton : "ark-podcast-list-item--player-window--close",
			audioPlayer             : "ark-audio-player"
		},
		dataAttributes: {
			listItemInitialized : "data-ark-podcast-list-item-initialized"
		}
	};




/* !-- Public Static Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	PodcastListItem.initAll = function() {
		var podcastListItems = document.querySelectorAll("." + globals.cssClasses.listItem + ":not([" + globals.dataAttributes.listItemInitialized + "])"),
			podcastListItem,
			i;
		
		for ( i = 0; i < podcastListItems.length; i++ ) {
			podcastListItems[i].setAttribute(globals.dataAttributes.listItemInitialized, "true");
			podcastListItem = new window.ark.PodcastListItem(podcastListItems[i]);
		}
	};


/* !-- Constructor -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function PodcastListItem(__podcastListItem) {
		// Private Variables
		var _context                 = this,
			_podcastListItem         = __podcastListItem,
			_openToPlayButton        = _podcastListItem.querySelector("." + globals.cssClasses.openToPlayButton),
			_playerWindow            = _podcastListItem.querySelector("." + globals.cssClasses.playerWindow),
			_closePlayerWindowButton = _podcastListItem.querySelector("." + globals.cssClasses.closePlayerWindowButton);
		
		
		
		// Public Properties
		
		
		
		// Getters and Setters
		this.getOpenToPlayButton = function(){ return _openToPlayButton; };
		this.getPlayerWindow     = function(){ return _playerWindow; };
		this.getAudioPlayer      = function(){ return _playerWindow.querySelector("." + globals.cssClasses.audioPlayer); };
		
		_openToPlayButton.addEventListener("click", function() { openPlayerWindow(_context); });
		_closePlayerWindowButton.addEventListener("click", function() { closePlayerWindow(_context); });
	}




/* !-- Private Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	
	/* -- Opens the player window -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function openPlayerWindow(__context) {
		if ( (__context.getAudioPlayer() === null) ) {
			createAudioPlayer(__context);
		}
		
		__context.getPlayerWindow().classList.add(globals.cssClasses.playerWindowOpened);
		__context.getAudioPlayer().ark.audioPlayer.play();
	}
	
	
	
	
	/* -- Closes the player window -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function closePlayerWindow(__context) {
		__context.getPlayerWindow().classList.remove(globals.cssClasses.playerWindowOpened);
		
		if ( (__context.getAudioPlayer() !== null) ) {
			__context.getAudioPlayer().ark.audioPlayer.pause();
		}
	}
	
	
	
	
	/* -- Creates the audio player -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function createAudioPlayer(__context) {
		if (__context.getAudioPlayer() == null) {
			var audioPlayer = document.createElement("div"),
				i;
				
			audioPlayer.classList.add("ark-audio-player");
			
			for ( i = 0; i < __context.getOpenToPlayButton().attributes.length; i++) {
				if ( (/^data\-ark\-audio\-player/).test(__context.getOpenToPlayButton().attributes[i].name) ) {
					audioPlayer.setAttribute(__context.getOpenToPlayButton().attributes[i].name, __context.getOpenToPlayButton().attributes[i].value);
				}
			}
			
			__context.getPlayerWindow().appendChild(audioPlayer);
			
			window.ark.AudioPlayer_V2.initAll();
		}
	}




/* !-- Public Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	




/* -- Adds the object -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	if (!window.ark) window.ark = {};
	
	if (!window.ark.PodcastListItem) {
		window.ark.PodcastListItem = PodcastListItem;
	}
	
	
	document.addEventListener("DOMContentLoaded", function(){
		window.ark.PodcastListItem.initAll();
	});


}());