/*
 * umVideoPlayer - jQuery plugin 1.0.0
 *
 * Copyright (c) 2011 Unicorn Media, Inc.
 *
 * www.unicornmedia.com
 *
 */

(function($) {
	// plugin definition
	$.fn.umVideo = function(options) {		
		
		// build main options before element iteration		
		var defaults = {
			theme: 'umchrome',
			childtheme: '',
			src:'',
			autoplay: false 
		};
		
		var options = $.extend(defaults, options);
		
		// iterate and reformat each matched element
		return this.each(function() {
			var $umVideo = $(this);
			
			var videoIsFullScreen = false;
			var viewportwidth;
			var viewportheight;
			var videoContainerOrigWidth;
			var videoContainerOrigHeight;
			var videoOrigWidth;
			var videoOrigHeight;
			var containerHeight;
			var containerWidth;
			var controlsHeight;
			var controlsWidth;
			var controlPostion;
			
			//Get innerWidth & innHeight for fullscreen mode
			var getViewPortSize = function()
			{
				// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
				if (typeof window.innerWidth != 'undefined')
				{
				     viewportwidth = window.innerWidth,
				     viewportheight = window.innerHeight
				}
				
				// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
				else if (typeof document.documentElement != 'undefined'
				    && typeof document.documentElement.clientWidth !=
				    'undefined' && document.documentElement.clientWidth != 0)
				{
				      viewportwidth = document.documentElement.clientWidth,
				      viewportheight = document.documentElement.clientHeight
				}
				
				// older versions of IE				
				else
				{
				      viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
				      viewportheight = document.getElementsByTagName('body')[0].clientHeight
				}
			}
			
			getViewPortSize();
			
			//create html structure
			//main wrapper
			var $video_wrap = $('<div></div>').addClass('um-video-player').addClass(options.theme).addClass(options.childtheme);
			//controls wraper
			var $video_controls = $('<div class="um-video-controls"><a class="um-video-play" title="Play/Pause"></a><div class="um-video-timer">00:00</div><div class="um-video-seek"></div><div class="um-video-duration">00:00</div><div class="um-volume-box"><div class="um-volume-slider"></div><a class="um-volume-button" title="Mute/Unmute"></a></div><a class="um-video-fullscreen" title="Full Screen Toggle"></a></div>');						
			
			$umVideo.wrap($video_wrap);
			$umVideo.after($video_controls);
			
			//get new elements
			var $video_container = $umVideo.parent('.um-video-player');
			var $video_controls = $('.um-video-controls', $video_container);
			var $um_play_btn = $('.um-video-play', $video_container);
			var $um_video_seek = $('.um-video-seek', $video_container);
			var $um_video_timer = $('.um-video-timer', $video_container);
			var $um_video_duration = $('.um-video-duration', $video_container);
			var $um_volume = $('.um-volume-slider', $video_container);
			var $um_volume_btn = $('.um-volume-button', $video_container);
			var $um_fullscreen_btn = $('.um-video-fullscreen', $video_container);
			
			$umVideo[0].src = defaults.src;
			$umVideo[0].autoplay = defaults.autoplay;
			
			$video_controls.hide(); // keep the controls hidden
			
			//Sets media item duration
			$umVideo.bind('loadedmetadata', function() {
				var contentDuration = $umVideo.attr('duration');
				$um_video_duration.text(umTimeFormat(contentDuration));
			});			
			
			//Handles play/pause toggle
			var umPlay = function() {
				if($umVideo.attr('paused') == false) {
					$umVideo[0].pause();					
				} else {					
					$umVideo[0].play();				
				}
			};
			
			$um_play_btn.click(umPlay);
			$umVideo.click(umPlay);
			
			//Bind() for play/pause toggle
			$umVideo.bind('play', function() {
				$um_play_btn.addClass('um-paused-button');
			});
			
			$umVideo.bind('pause', function() {
				$um_play_btn.removeClass('um-paused-button');
			});
			
			$umVideo.bind('ended', function() {
				$um_play_btn.removeClass('um-paused-button');
			});
			
			//Bind() for mute/unmute toggle
			$umVideo.bind('volumechange', function() {
				if($umVideo.attr('muted'))
				{
					$um_volume_btn.removeClass('um-volume-button');
					$um_volume_btn.addClass('um-volume-off-button');	
				}
				else
				{
					$um_volume_btn.removeClass('um-volume-off-button');
					$um_volume_btn.addClass('um-volume-button');	
				}	
			});
			
			
			//Handles play/pause toggle
			var umFullScreen = function() {
				if(!videoIsFullScreen) {
					if(defaults.childtheme)
					{
						videoIsFullScreen = true;
						videoContainerOrigWidth = $video_container.attr('offsetWidth') - 4;
						videoContainerOrigHeight = $video_container.attr('offsetHeight') - 4;
						
						videoOrigWidth = $umVideo.attr('offsetWidth');
						videoOrigHeight = $umVideo.attr('offsetHeight');
						
						$umVideo.width((viewportwidth - 6) + 'px');
						$umVideo.height((viewportheight - 6) + 'px');
						
						$video_container.width((viewportwidth - 8) + 'px');
						$video_container.height((viewportheight - 8) + 'px');
						
						positionControls();
						
						$um_fullscreen_btn.removeClass('um-video-fullscreen');
						$um_fullscreen_btn.addClass('um-video-exit-fullscreen');
					}
					else{
						videoIsFullScreen = true;
						videoContainerOrigWidth = $video_container.attr('offsetWidth') - 8;
						videoContainerOrigHeight = $video_container.attr('offsetHeight') - 8;
						
						videoOrigWidth = $umVideo.attr('offsetWidth');
						videoOrigHeight = $umVideo.attr('offsetHeight');
						
						$video_container.width((viewportwidth - 12) + 'px');
						$video_container.height((viewportheight - 12) + 'px');
						
						$umVideo.width((viewportwidth - 8) + 'px');
						$umVideo.height((viewportheight - 42) + 'px');
						
						positionControls();
						
						$um_fullscreen_btn.removeClass('um-video-fullscreen');
						$um_fullscreen_btn.addClass('um-video-exit-fullscreen');	
					}
				} else {
					if(defaults.childtheme)
					{
						videoIsFullScreen = false;
						$video_container.width(videoContainerOrigWidth + "px");
						$video_container.height(videoContainerOrigHeight + "px");
						
						$umVideo.width((videoOrigWidth - 2) + "px");
						$umVideo.height((videoOrigHeight - 2) + "px");
						
						positionControls();
						
						$um_fullscreen_btn.removeClass('um-video-exit-fullscreen');
						$um_fullscreen_btn.addClass('um-video-fullscreen');	
					}
					else{
						videoIsFullScreen = false;
						$video_container.width(videoContainerOrigWidth + "px");
						$video_container.height(videoContainerOrigHeight + "px");
						
						$umVideo.width(videoOrigWidth + "px");
						$umVideo.height(videoOrigHeight + "px");
						
						positionControls();
						
						$um_fullscreen_btn.removeClass('um-video-exit-fullscreen');
						$um_fullscreen_btn.addClass('um-video-fullscreen');	
					}
				}
			
			};
			
			$um_fullscreen_btn.click(umFullScreen);
			
			var positionControls = function()
			{
				if(videoIsFullScreen)
				{
					if(defaults.childtheme)
					{
						
						$video_controls.css('position', 'absolute');
						$video_controls.css('bottom', 0);
						sizeProgressBar();
					}
					else
					{
						var controlPosition = $video_container.attr('offsetHeight')- $video_controls.attr('offsetHeight');
						$video_controls.css('position', 'absolute');
						$video_controls.css('top', (controlPosition - 4) + 'px');
						$video_controls.width($video_container.attr('offsetWidth') - 10 + 'px');
						sizeProgressBar();	
						
					}
					
				}
				else
				{
					if(defaults.childtheme)
					{
						$video_controls.css('position', 'absolute');
						$video_controls.css('bottom', 0);
						sizeProgressBar();
					}
					else
					{
						$video_controls.css('position', 'relative');
						$video_controls.css('top', 0);
						$video_controls.width($video_container.attr('offsetWidth') - 8 + 'px');
						sizeProgressBar();
						
					}
					
				}
			}
			
			var sizeProgressBar = function()
			{
				if(videoIsFullScreen)
				{
					var seekWidth = $video_container.attr('offsetWidth') - 220 + 'px';
					$um_video_seek.width(seekWidth);
				}
				else
				{
					var seekWidth = $video_container.attr('offsetWidth') - 200 + 'px';
					$um_video_seek.width(seekWidth);
				}
			}
			
			//Handling seek/scrubing 
			var seeksliding;			
			var createSeek = function() {
				if($umVideo.attr('readyState')) {
					sizeProgressBar();
					var video_duration = $umVideo.attr('duration');
					$um_video_seek.slider({
						value: 0,
						step: 0.01,
						orientation: "horizontal",
						range: "min",
						max: video_duration,
						animate: true,					
						slide: function(){							
							seeksliding = true;
						},
						stop:function(e,ui){
							seeksliding = false;						
							$umVideo.attr("currentTime",ui.value);
						}
					});
					$video_controls.show();					
				} else {
					setTimeout(createSeek, 150);
				}
			};

			createSeek();
		
			//Converts time to human readable format
			var umTimeFormat=function(seconds){
				var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
				var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
				return m+":"+s;
			};
			
			//Handles seeking/current time display updates 
			var seekUpdate = function() {
				var currenttime = $umVideo.attr('currentTime');
				if(!seeksliding) $um_video_seek.slider('value', currenttime);
				$um_video_timer.text(umTimeFormat(currenttime));
			};
			
			$umVideo.bind('timeupdate', seekUpdate);	
			
			//Handling volume slider
			var video_volume = .5;
			$um_volume.slider({
				value: .5,
				orientation: "vertical",
				range: "min",
				max: 1,
				step: 0.05,
				animate: true,
				slide:function(e,ui){
						$umVideo.attr('muted',false);
						video_volume = ui.value;
						$umVideo.attr('volume',ui.value);
					}
			});
			
			//Handles mute/unmute toggle
			var muteVolume = function() {
				if($umVideo.attr('muted')==true) {
					$umVideo.attr('muted', false);
					$um_volume.slider('value', video_volume);
					
					$um_volume_btn.removeClass('um-volume-mute');					
				} else {
					$umVideo.attr('muted', true);
					$um_volume.slider('value', '0');
					
					$um_volume_btn.addClass('um-volume-mute');
				};
			};
			
			$um_volume_btn.click(muteVolume);
			
			//Removes default controls
			$umVideo.removeAttr('controls');
			
		});
	};

	//
	// plugin defaults
	//
	$.fn.umVideo.defaults = {
		
	};

})(jQuery);