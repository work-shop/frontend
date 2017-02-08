"use strict";

module.exports = function( $ ){

	var activated = false;

	function checkEvents(){
		
		console.log('timeline.js checkEvents');
		
		$('.event').each(function(){
			
			if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.85 ) {
				$(this).addClass('activated');
			}
		});

	}

	function setupTimeline() {		
		$( window ).scroll( function() {
			if( !activated && $(window).width() >= 1200 ){			
				window.requestAnimationFrame(checkEvents);	
			}
		});
	}

	//return an object with methods that correspond to above defined functions
	return {
		checkEvents: checkEvents,
		setupTimeline: setupTimeline
	};

};