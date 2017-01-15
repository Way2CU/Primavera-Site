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

	function QualitySwitcher(video){
		var self = this;
		self.video = video;
		self.sources = [];
		self.quality_list = [];
		self.index = 0;
		self.progress = null;
		self.button = null;

		self._init = function(){
			/**
			 *Push video sources into array
			 *Push data-set into array
			 */
			for(var i=0, count=self.video.children.length -1; i <= count; i++) {
				self.sources.push(self.video.children[i].getAttribute('src'));
				self.quality_list.push(self.video.children[i].getAttribute('data-set'));
			}

			/**
			 * Timing function event listener for video
			 */
			self.video.addEventListener('timeupdate', self.handle_video_progress);

			/**
			 * Create button
			 */
			self.button = document.createElement("button");
			var content = document.createTextNode("HD");
			self.button.appendChild(content);
			self.video.parentNode.appendChild(self.button);

			/**
			 * event click listener to handle switch src on video
			 */
			self.button.addEventListener('click', self.handle_switch);

			/**
			 * First source of video
			 */
			self.source = self.video.querySelector('source.low');
			self.index = 0;
		};

		/**
		 *Collectes the currenttime while video is_playing
		 */
		self.handle_video_progress = function(){
			self.progress = self.video.currentTime;
			console.log(self.progress);
		}

		/**
		 * Switches sources on click
		 */
		self.handle_switch = function () {
			self.index ++;
			if(self.index < self.sources.length) {
				self.button.textContent = self.quality_list[self.index - 1];
				self.video.src = self.sources[self.index];
				self.video.currentTime = self.progress;
				self.video.play();
				self.index ++;
			}
			else {
				self.index = 0;
				self.video.src = self.sources[self.index];
				self.button.textContent = self.quality_list[self.index + 1];
			}
		}
		self._init();
	}


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

	//Dialog Form
	Site.dialog_form = new Dialog();
		Site.dialog_form
			.addClass('form')
			.setContentFromDOM('div#floating_form');

	//Dialog Video
	Site.dialog_video = new Dialog();
		Site.dialog_video
			.addClass('video_float')
			.setContentFromDOM('div.video_floating');


	Site.handle_dialog_form = function() {
		event.preventDefault();
		Site.dialog_form.show();
	}

	Site.handle_dialog_video = function() {
		event.preventDefault();
		Site.dialog_video.show();
	}

	Site.handle_dialog = function() {
		event.preventDefault();
		Site.dialog.show();
	}

	if (document.querySelector('a#button_green_action')) {
		Site.green_button = document.querySelector('a#button_green_action');
		Site.green_button.addEventListener('click', Site.handle_dialog_form);
		// create handler for submitting dialog form
		Caracal.ContactForm.list[0].events.connect('submit-success', function(event) {
			Site.dialog_form.hide();
			return true;
		});
	}

	if (!document.querySelector('a#button_green_action')) {
		Site.header_button = document.querySelector('a.play_header');
		Site.header_button.addEventListener('click', 	Site.handle_dialog_video);
		Site.contact_button = document.querySelector('a.contact');
		Site.contact_button.addEventListener('click', Site.handle_dialog_form);

		// create handler for submitting dialog form
		Caracal.ContactForm.list[0].events.connect('submit-success', function(event) {
			Site.dialog_form.hide();
			return true;
		});

		// create handler for submitting dialog form
		Caracal.ContactForm.list[1].events.connect('submit-success', function(event) {
			Site.dialog_form.hide();
			return true;
		});

	}


		Site.whatsapp_button = document.querySelector('a.whatsapp');
		Site.floating_button = document.querySelector('a.floating_clicker');


		Site.whatsapp_button.addEventListener('click', Site.handle_dialog);
		Site.floating_button.addEventListener('click', Site.handle_dialog_form);


	// connect submission to Google Analytics
	var push_event = function(data) {
			dataLayer.push({
				event: "leadSent"
			});
			return true;
		};

	for (var index in Caracal.ContactForm.list)
		Caracal.ContactForm.list[index].events.connect('submit-success', push_event);

	/**
	* Selects all videos on the page and init object QualitySwitcher
	*/
	var video_list = document.querySelectorAll('video');
	for(var i = 0; i<video_list.length; i++) {
		new QualitySwitcher(video_list[i]);
	};
};


// connect document `load` event with handler function
$(Site.on_load);
