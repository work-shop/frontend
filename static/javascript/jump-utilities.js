"use strict";

module.exports = function( $ ) {

	function jump(destination, offset, speed){
		if(!speed){
			speed = 1500;
		}

		$('html,body').animate({
			scrollTop: $(destination).offset().top - offset
		},speed);

	}

	function setupJumpEvents( selector, offset, mobileBreakpoint, offsetMobile, preventUrl ) {

		$( document ).ready( function() {

			$(selector).click(function(e){
				
				if(preventUrl){
					e.preventDefault();
				}

				var href = $(this).attr("href").toLowerCase();

				if( $(window).width() > mobileBreakpoint){
					jump(href, offset);	
				} else{
					jump(href, offsetMobile);	
				}
			});

		});

	}

	return {
		jump: jump,
		setupJumpEvents: setupJumpEvents
	};
};