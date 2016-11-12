"use strict";

module.exports = function($, slick) {

	function createSlideshows(){

		$('.slick').slick({
			slidesToShow: 1,
			dots: true,
			autoplay: true,
			autoplaySpeed: 7000,
			speed: 300
		});
		
	}

	function setupSlideshows() {

		$( document ).ready( function() {
			createSlideshows();
		});

	}

	return {
		createSlideshows: createSlideshows,
		setupSlideshows: setupSlideshows
	};
};