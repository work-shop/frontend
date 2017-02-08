"use strict";

module.exports = function($, slick) {

	function createSlideshows(){

		$('.slick-default').slick({
			slidesToShow: 1,
			dots: true,
			autoplay: true,
			autoplaySpeed: 7000,
			speed: 400
		});

		$('.slick-project').slick({
			slidesToShow: 1,
			//centerMode: true,
			//centerPadding: '60px',
			dots: true,
			autoplay: false,
			autoplaySpeed: 7000,
			speed: 100
		});		

		$('.slick-default').on('afterChange', function(){
			$('.slick-default').slick('slickPause');
		});

		$('.slick-project').on('afterChange', function(){
			$('.slick-project').slick('slickPause');
		});

		$('.project-slideshow-toggle').click(function(e){
			e.preventDefault();
			if( $('#project-slideshow').hasClass('expanded') ){
				$('#project-slideshow').removeClass('expanded');
			} else{
				$('#project-slideshow').addClass('expanded');
			}
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