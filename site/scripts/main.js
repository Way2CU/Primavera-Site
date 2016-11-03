/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

	Site.handle_language_load = function(data) {
		Site.dialog
		      .setContent(data['whatsapp_message'])
		      .setSize(600, 200)
		      .setClearOnClose(false)
		      .setTitle(data['dialog_title']);

		if(Site.is_mobile())
		Site.dialog.setSize(300, 280);
	};

/**
 * Function called when document and images have been completely loaded.
 */

Site.on_load = function() {
	if (Site.is_mobile()) {
		Site.mobile_menu = new Caracal.MobileMenu();
	}

	//Page Control for Product_gallery
	Site.product_gallery = new PageControl('section#product_gallery','div.thumb_large');
	Site.product_gallery
		.attachControls($('ul#images li'));

	Site.tabs = new PageControl('section#information','div.content');
	Site.tabs
		.attachControls($('section#information div#tabs a'));

	//create dynamic controls for testimonial page control
	var testimonials = document.querySelectorAll('div.testemonials article');
	var controls_container = document.querySelector('div.control_panel');
	for(var i = 0; i < testimonials.length; i++) {
		var link = document.createElement('a');
		link.classList.add('control')
		link.setAttribute('href', 'javascript:void(0)');
		controls_container.appendChild(link);
	}

	// create page control for site testimonails
	Site.testimonials = new PageControl('div.testemonials', 'article');
	Site.testimonials
		.setWrapAround(true)
		.attachControls($('div.control_panel a.control'))
		.attachPreviousControl($('a.prev'))
		.attachNextControl($('a.next'));

	//Dialog js Whatsapp
    	Site.dialog = new Dialog();
	language_handler.getTextArrayAsync(null, ['whatsapp_message', 'dialog_title'], Site.handle_language_load);


	//Whatsapp Click Handler
	$("a.whatsapp").on("click", function(event){
		event.preventDefault();
		Site.dialog.show();
		console.log("Eat my ass");
	});

	//Scroll Y function
	$("a#scroll_button").on("click", function(event){
		windown.scrollTo(0, 0);
	});
};


// connect document `load` event with handler function
$(Site.on_load);