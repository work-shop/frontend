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
	}


	function checkNavPosition(){

		if ( $(window).scrollTop() >= aboutNav.triggerPosition && aboutNav.element.hasClass('static') ){
			toggleNav();
		}else if($(window).scrollTop() < aboutNav.triggerPosition && aboutNav.element.hasClass('fixed') ){
			toggleNav();
		}

	}


	function setupPeople() {

	

	}


	//return an object with methods that correspond to above defined functions
	return {
		setupPeople: setupPeople
	};

};