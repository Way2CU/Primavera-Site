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
		self.button = document.createElement("select");
		for(var i = 0, count=self.quality_list.length; i<count; i++) {
			var option = document.createElement("option");
			option.value = self.quality_list[i];
			option.text = self.quality_list[i];
			self.button.appendChild(option);
		};

		/**
		 * check curerent source
		 */
		self.video.oncanplay = function (event){
			var source = this.currentSrc;
			if (self.sources.indexOf(source)) {
				self.index = self.sources.indexOf(source);
				self.button.option = self.quality_list[self.index];
			};
		};

		self.video.parentNode.appendChild(self.button);
		/**
		 * event click listener to handle switch src on video
		 */
		self.button.addEventListener('change', self.handle_switch);

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
	}

	/**
	 * Switches sources on click
	 */
	self.handle_switch = function () {
 		self.index++;
	  	if (self.index > self.video.children.length -1)
	  	self.index = 0;

	   	self.button.option = self.quality_list[self.index];
	   	self.video.src = self.sources[self.index];
	};

	self._init();
}


window.addEventListener('load', function(){
	/**
	* Selects all videos on the page and init object QualitySwitcher
	*/
	var video_list = document.querySelectorAll('video');
	for(var i = 0; i<video_list.length; i++) {
		new QualitySwitcher(video_list[i]);
	};
});