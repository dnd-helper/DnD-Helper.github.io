(function(window){


	/* !-- Static Properties -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		MainMenu.mobileWidth = 1024;
		MainMenu.defaultMenuOffsetTop = null;
		MainMenu.mobileMenuOpenClass = "mobile-menu-open";


	/* !-- Static Methods -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

		/* -- Initializes the menu and the mobile menu -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		MainMenu.init = function() {
			// Sets the offset position of the main menu (MainMenu.defaultMenuOffsetTop)
			setDefaultMenuOffsetTop();

			//Sticks the main menu to the top of the page when scrolling
			stickMenuToTop();
			stickMGTOMenuToTop();

			// Clones necessary elements in the page to create the mobile menu
			cloneForMobileMenu();


			// Adds a click event on the mobile menu toggle button
			var mobileMenuToggleButton = document.querySelector("#mobile-menu .header .toggle-menu-button");
			if ( mobileMenuToggleButton ) {
				mobileMenuToggleButton.addEventListener("click", function() {
					ark.MainMenu.toggleMobileMenu();
				});
			}

			//Append mobile menu directly after the body
			jQuery("#mobile-menu").prependTo("body");

			// Initializes the MMenu object
			jQuery("#mobile-menu nav .menu-wrapper").mmenu();


			// Adds a click event for touch devices on the main nav
			if ( window.ark.isMobile() ) {
				var mainNavItems = document.querySelectorAll("#menu ul.main-menu > li > a:not(.leaf)"),
					i;

				for ( i = 0; i < mainNavItems.length; i++ ) {
					mainNavItems[i].addEventListener("click", mainMenuItemMobileClick);
				}
			}


			if (sectionHasStickyMenuAlwaysOn()) {
				jQuery("#page").addClass("snap-menu");
				jQuery("header").css({"top": ""});
			}


			// Adds scroll and resize events
			window.addEventListener("scroll", function() {
				stickMenuToTop();
				stickMGTOMenuToTop();
			});

			window.addEventListener("resize", function() {
				setDefaultMenuOffsetTop();
				stickMenuToTop();
				stickMGTOMenuToTop();
			});

		};



		/* -- Returns the page element -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		MainMenu.getPage = function() {
			return document.getElementById("page");
		};




		/* -- Returns if the mobile menu is opened -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		MainMenu.mobileMenuIsOpened = function() {
			if ( !MainMenu.getPage() )
				return;

			if ( (new RegExp(MainMenu.mobileMenuOpenClass, "gi")).test(document.querySelector("html").className) )
				return true;
			else
				return false;
		};




		/* -- Opens the mobile menu -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		MainMenu.openMobileMenu = function() {
			if ( !MainMenu.getPage() )
				return;

			if ( !MainMenu.mobileMenuIsOpened() )




				document.querySelector("html").className = MainMenu.mobileMenuOpenClass + " " + document.querySelector("html").className;
		};


		/* -- Closes the mobile menu -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		MainMenu.closeMobileMenu = function() {
			if ( !MainMenu.getPage() )
				return;

			document.querySelector("html").className = document.querySelector("html").className.replace(new RegExp(MainMenu.mobileMenuOpenClass + " ", "gi"), "");
			document.querySelector("html").className = document.querySelector("html").className.replace(new RegExp(MainMenu.mobileMenuOpenClass, "gi"), "");

			// Resets the mobile menu
			var openedItems = document.querySelectorAll(
					".mm-wrapper .mm-opened:not(.main-menu)"
					+ ", .mm-wrapper .mm-subopened:not(.main-menu)"
					+ ", .mm-wrapper .mm-current:not(.main-menu)"
				),
				i;
			for ( i = 0; i < openedItems.length; i++ ) {
				openedItems[i].classList.remove("mm-opened");
				openedItems[i].classList.remove("mm-subopened");
				openedItems[i].classList.remove("mm-current");
				openedItems[i].classList.remove("mm-highest");
				openedItems[i].classList.add("mm-hidden");
			}
			document.querySelector(".mm-wrapper .main-menu").classList.add("mm-current");
			document.querySelector(".mm-wrapper .main-menu").classList.remove("mm-subopened");
			document.querySelector(".mm-wrapper .main-menu").classList.remove("mm-hidden");

			window.jQuery(".mm-wrapper .slick-initialized").slick("slickGoTo", 0, true);
		};




		/* -- Toggles the opening of the mobile menu -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		MainMenu.toggleMobileMenu = function() {
			if ( !MainMenu.getPage() )
				return;

			if (MainMenu.mobileMenuIsOpened())
				MainMenu.closeMobileMenu();
			else
				MainMenu.openMobileMenu();
		};




	/* !-- Constructor -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		function MainMenu() {}





	/* !-- Private Methods -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

		/* -- Sets the offset position of the main menu (MainMenu.defaultMenuOffsetTop) -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		function setDefaultMenuOffsetTop() {
			if (!jQuery("#page").hasClass("snap-menu") && MainMenu.defaultMenuOffsetTop === null && jQuery("#menu").length ) {

				var headerPopinHeight = jQuery('.header-popin').outerHeight();

				if(jQuery("#page").hasClass("breaking-news") || jQuery("#page").hasClass("alert") ) {
					MainMenu.defaultMenuOffsetTop = jQuery("#menu").offset().top + jQuery("#menu").height() - headerPopinHeight;
				} else {
					MainMenu.defaultMenuOffsetTop = jQuery("#menu").offset().top + jQuery("#menu").height();
				}
			}
		}




		/* -- Sticks the main menu to the top of the page when scrolling -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		function stickMenuToTop() {
			if (!sectionHasStickyMenuAlwaysOn()) {
				if ( jQuery(window).scrollTop() >= MainMenu.defaultMenuOffsetTop ) {
					if (!jQuery("#page").hasClass("snap-menu")) {
						jQuery("header").css({"top": -jQuery("#menu").height()});
						setTimeout(function() {
							jQuery("#page").addClass("snap-menu");
							jQuery("header").css({"top": ""});
						}, 1);
					}
				} else {
					jQuery("#page").removeClass("snap-menu");
				}
			}
		}




		/* -- Clones necessary elements in the page to create the mobile menu -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		function cloneForMobileMenu() {
			var logo = document.querySelector("#menu .home") ? document.querySelector("#menu .home").cloneNode(true) : null,
				searchForm = document.querySelector("#utils form") ? document.querySelector("#utils form").cloneNode(true) : null,
				menu = document.querySelector("#menu ul") ? document.querySelector("#menu ul").cloneNode(true) : null,
				utilities = document.querySelector("#utils"),
				utilityListElement,
				utilityLinkElement,
				i;


			// Clones and appends the website's logo/home link
			if (logo) {
				// Changes the element ID if necessary
				if ( logo.getAttribute("id") )
					logo.setAttribute("id", logo.getAttribute("id") + "_clone");

				// Appends the website's logo/home link
				if ( document.querySelector("#mobile-menu .header .logo") )
					document.querySelector("#mobile-menu .header .logo").appendChild(logo);
			}

			// Clones and appends the search form
			if ( searchForm ) {
				// Changes the element ID if necessary
				if ( searchForm.getAttribute("id") )
					searchForm.setAttribute("id", searchForm.getAttribute("id") + "_clone");

				// Appends the search form
				if ( document.querySelector("#mobile-menu nav") )
					document.querySelector("#mobile-menu nav").insertBefore(searchForm, document.querySelector("#mobile-menu nav").firstChild);
			}

			// Clones and appends the menu
			if ( menu && document.querySelector("#mobile-menu .menu-wrapper") ) {

				// Adds utilities to the main menu
				if ( utilities ) {
					for ( i = 0; i < utilities.childNodes.length; i++ ) {
						if ( utilities.childNodes[i].nodeName.toLowerCase() == "a" ) {
							utilityListElement = document.createElement("li");
							utilityListElement.setAttribute("class", "utility-link");

							utilityLinkElement = utilities.childNodes[i].cloneNode("true");

							// Changes the element ID if necessary
							if (utilityLinkElement.getAttribute("id"))
								utilityLinkElement.setAttribute("id", utilityLinkElement.getAttribute("id") + "clone");

							utilityListElement.appendChild(utilityLinkElement);

							// Appends the utility link
							menu.appendChild(utilityListElement);
						}
					}
				}

				// Appends the menu
				document.querySelector("#mobile-menu .menu-wrapper").appendChild(menu);

				//Init Slick Carousel
				initHeaderCarousel();
			}
		}




		/* -- Sticks the MGTO menu to the top of the page when scrolling -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		function stickMGTOMenuToTop() {
			var menu 					= jQuery('nav.subsection');
			var headerPopinHeight		= jQuery('#page').hasClass('breaking-news') || jQuery('#page').hasClass('alert')  ? jQuery('.header-popin').outerHeight() : 0;

			if ( menu.length ) {
				var menuOffSetTop 	   = jQuery("#page-header");
				var menuMgtoHeight     = menuOffSetTop.height() - menu.height();
				window.contentPadding  = window.contentPadding != null ? window.contentPadding : parseInt(jQuery("#content").css("padding-top"));

				if ( jQuery(window).scrollTop() >= ((menuOffSetTop.length ? menuOffSetTop.offset().top : 0) + menuMgtoHeight - headerPopinHeight) ) {
					menu.addClass("snap-menu");
					jQuery("#content").css("padding-top", menu.height() + window.contentPadding);
				} else {
					menu.removeClass("snap-menu");
					jQuery("#content").css("padding-top", window.contentPadding);
				}
			}
		}




		/* -- Returns if pages requests an always on sticky menu -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		function sectionHasStickyMenuAlwaysOn() {
			var alwaysSticky           = false,
				alwaysOnBodyCSSClasses = [
						"node-type-immersive-event-page",
						"node-type-immersive-home-page",
						"use-sticky-menu"
					];

			for ( var i = 0; i < alwaysOnBodyCSSClasses.length; i++ ) {
				if ( (new RegExp("\\b" + alwaysOnBodyCSSClasses[i] + "\\b", "i")).test(document.body.className) ) {
					alwaysSticky = true;
					break;
				}
			}

			return alwaysSticky;
		}


		//Allow multiple slick carousel init in the same page
		function initHeaderCarousel() {

			jQuery('div[class^="slick-menu-carousel"]').each(function() {

				//Init Header Slick Carousel
				jQuery(this).slick({ //Apply if width is bellow lowest breakpoint
					infinite: true,
					respondTo : 'window',
					mobileFirst : true,
					variableWidth: false,
					arrows: false,
					centerMode: false,
					dots: false,
					slidesToShow: 1.2,
					slidesToScroll: 1,
					responsive: [
					{
					  breakpoint: 1023, //Apply if width is above
					  variableWidth: true,
					  settings: {
						infinite: true,
						slidesToShow: 5,
						slidesToScroll: 1,
						arrows: true,
						prevArrow: jQuery(this).parent().find('.slick-prev'),
						nextArrow: jQuery(this).parent().find('.slick-next')
					  }
					}
				  ]
				});

			});

		}




		// Main menu item clicked on touch devices
		function mainMenuItemMobileClick(__event) {
			window.ark.preventDefaultAction(__event);

			var mainMenuItems = document.querySelectorAll("#menu ul.main-menu > li > a:not(.leaf)"),
				i;

			for ( i = 0; i < mainMenuItems.length; i++ ) {
				mainMenuItems[i].parentNode.classList[mainMenuItems[i] === this ? "toggle" : "remove"]("touched");
			}
		}





	/* -- Adds the object -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		if (!window.ark) window.ark = new Object();

		if (!window.ark.MainMenu)
			window.ark.MainMenu = MainMenu;


		document.addEventListener("DOMContentLoaded", function() {
			// Initializes the menu and the mobile menu
			  ark.MainMenu.init();
		})


	}(window));