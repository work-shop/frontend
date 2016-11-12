"use strict";

module.exports = function( $ ) {

	function jump(destination,speed){
		if(!speed){
			speed = 1500;
		}
		$('html,body').animate({
			scrollTop: $(destination).offset().top - 0
		},speed);
	}

	function setupJumpEvents( selector ) {

		$( document ).ready( function() {

			$(selector).click(function(e){
				e.preventDefault();
				var href = $(this).attr("href");
				href = href.toLowerCase();
				jump(href);	
			});

		});

	}

	return {
		jump: jump,
		setupJumpEvents: setupJumpEvents
	};
};