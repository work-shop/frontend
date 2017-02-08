"use strict";

module.exports = function( $ ){

	var aboutNav = {};
	aboutNav.element = $('#about-nav');
	aboutNav.referenceElement = $('#introduction');
	var offset = aboutNav.referenceElement.height();
	var navHeight = 75;
	aboutNav.triggerPosition = offset;


	function calculateNavPosition(){
		offset = aboutNav.referenceElement.height();
		aboutNav.triggerPosition = offset;

		//console.log('calculateNavPosition');
	}


	function checkNavPosition(){

		//console.log('checkNavPosition');

		if ( $(window).scrollTop() >= aboutNav.triggerPosition && aboutNav.element.hasClass('static') ){
			toggleNav();
		}else if($(window).scrollTop() < aboutNav.triggerPosition && aboutNav.element.hasClass('fixed') ){
			toggleNav();
		}

	}


	function toggleNav(){

		if ( aboutNav.element.hasClass('static') ){
			aboutNav.element.removeClass('static').addClass('fixed');
			$('body').addClass('about-nav-fixed');
		}else if( aboutNav.element.hasClass('fixed') ){
			aboutNav.element.removeClass('fixed').addClass('static');
			$('body').removeClass('about-nav-fixed');			
		}	

	}


	function setupAboutNav() {

		$('body').on({ 'touchmove': function(e) { 
			window.requestAnimationFrame(checkNavPosition); 
		}});

		$( window ).scroll( function(e) {
			window.requestAnimationFrame(checkNavPosition);	
		});

		$( window ).resize( function() {
			window.requestAnimationFrame(calculateNavPosition);	
			window.requestAnimationFrame(checkNavPosition);	
		});		

	}


	//return an object with methods that correspond to above defined functions
	return {
		checkNavPosition: checkNavPosition,
		setupAboutNav: setupAboutNav
	};

};