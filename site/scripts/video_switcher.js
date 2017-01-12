
function QualitySwitcher(video){

	var self = this;
	self.video = video;
	self.sources = [];
	self.quality_list = [];
	self.index = 0;
	self.progress = null;
	self.button = null;



	self._init = function(){

		//Push video sources into array
		//Push data-set into array
		for(var i = 0; i<= (self.video.children.length -1); i++) {
			self.sources.push(self.video.children[i].getAttribute('src'));
			self.quality_list.push(self.video.children[i].getAttribute('data-set'));
		}

		//Timing function event listener for video
		self.video.addEventListener('timeupdate', self.video_progress);

		//Create button
		self.button = document.createElement("button");
		var content = document.createTextNode("HD");
		self.button.appendChild(content);
		self.video.parentNode.appendChild(self.button);

		//event click listener to handle switch src on video
		self.button.addEventListener('click', self.handle_switch);

		//First source of video
		self.source = self.video.querySelector('source.low');
		self.index = 0;
	};

	//Collectes the currenttime while video is_playing
	self.video_progress = function(){
		self.progress = self.video.currentTime;
		console.log(self.progress);
	}

	//Switches sources on click
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

window.addEventListener('load', function() {

	var video_list = document.querySelectorAll('video');

	for(var i = 0; i<video_list.length; i++) {
		new QualitySwitcher(video_list[i]);
	};

})