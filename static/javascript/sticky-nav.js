"use strict";

module.exports = function( $ ){

	var stickyNav = {};
	var activated = false;


	function initialize( selector, navHeight, mobileNavHeight ){

		stickyNav.selector = selector;
		stickyNav.navHeight = navHeight;
		stickyNav.mobileNavHeight = mobileNavHeight;
		stickyNav.element = $(stickyNav.selector);

		//stickyNav.previousElement = $(stickyNav.previousElementSelector);

		calculatePositions();

		if( activated === false ){
			activate();
			activated = true;
		}		
	}


	function calculatePositions(){
		stickyNav.offset = stickyNav.element.offset();
		stickyNav.offset = stickyNav.offset.top;

		if( $(window).width() > 768){
			stickyNav.triggerPosition = stickyNav.offset - stickyNav.navHeight;	
		}
		else{
			stickyNav.triggerPosition = stickyNav.offset - stickyNav.mobileNavHeight;				
		}

		//console.log('calculatePositions');
		//console.log('stickyNav.triggerPosition = ' + stickyNav.triggerPosition); 	
	}


	function checkNavPosition(){

		if( $(window).width() > 768){
			console.log('checkNavPosition with stickyNav.triggerPosition: ' + stickyNav.triggerPosition);
			if ( $('body').scrollTop() >= stickyNav.triggerPosition && stickyNav.element.hasClass('static') ){
				toggleNav();
			}else if($('body').scrollTop() < stickyNav.triggerPosition && stickyNav.element.hasClass('fixed') ){
				toggleNav();
			}			
		}

	}


	function toggleNav(){

		if ( stickyNav.element.hasClass('static') ){
			stickyNav.element.removeClass('static').addClass('fixed');
			$('body').addClass('sticky-nav-fixed');
		}else if( stickyNav.element.hasClass('fixed') ){
			stickyNav.element.removeClass('fixed').addClass('static');
			$('body').removeClass('sticky-nav-fixed');			
		}	

	}


	function activate() {

		$('body').on({ 'touchmove': function(e) { 
			window.requestAnimationFrame(checkNavPosition); } 
		});

		$( window ).scroll( function() {
			window.requestAnimationFrame(checkNavPosition);
		});

		$( window ).resize( function() {
			console.log('resize');
			window.requestAnimationFrame(calculatePositions);
			window.requestAnimationFrame(checkNavPosition);
		});		

	}


	//return an object with methods that correspond to above defined functions
	return {
		initialize: initialize,
		checkNavPosition: checkNavPosition,
		activate: activate
	};

};