"use strict";

module.exports = function($) {

	//open and close the menu
	function menuToggle(){

		if($('body').hasClass('menu-closed')){
			$('#menu').removeClass('closed').addClass('open');
			$('#blanket').removeClass('off').addClass('on');						
			$('body').removeClass('menu-closed').addClass('menu-open');
		}
		else if($('body').hasClass('menu-open')){
			$('#menu').removeClass('open').addClass('closed');
			$('#blanket').removeClass('on').addClass('off');			
			$('body').removeClass('menu-open').addClass('menu-closed');
		}

	}

	//set up the menu and events that interact with it 
	function setupMenus() {

		$( document ).ready( function() {
			$('.menu-toggle').click(function(e) {
				e.preventDefault();
				menuToggle();
			});			
		});

	}

	return {
		menuToggle: menuToggle,
		setupMenus: setupMenus
	};

};