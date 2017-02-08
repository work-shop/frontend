"use strict";

module.exports = function( $ ) {

	function descriptionToggle(){
		if($('.project-introduction-description').hasClass('open')){
			$('.project-introduction-description').removeClass('open');
			$('.project-description-toggle').text('Show More +');
		}
		else {
			$('.project-introduction-description').addClass('open');
			$('.project-description-toggle').text('Show Less -');
		}		
	}

	function setupDescriptionToggle() {

		$( document ).ready( function() {

			$('.project-description-toggle').click(function(e){
				e.preventDefault();
				descriptionToggle();
			});

			$('.project-introduction-description').click(function(e){
				$('.project-introduction-description').addClass('open');
				$('.project-description-toggle').text('Show Less -');
			});

		});

	}

	return {
		descriptionToggle: descriptionToggle,
		setupDescriptionToggle: setupDescriptionToggle
	};
};