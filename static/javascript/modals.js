"use strict";

module.exports = function($) {

	function closeModal(){

		if($('body').hasClass('modal-on')){
			$('.modal').removeClass('on').addClass('off');
			$('body').removeClass('modal-on').addClass('modal-off');
		}

	}

	function modalToggle(_target, swap){

		var modalTarget = '#' + _target;

		if(swap){
			$('.modal').removeClass('on');
			$(modalTarget).removeClass('off').addClass('on');
		}
		else{
			if($('body').hasClass('modal-off')){
				$(modalTarget).removeClass('off').addClass('on');
				$('body').removeClass('modal-off').addClass('modal-on');
			}	
		}

	}


	function urlCheck(){

		// var hash = window.location.hash;

		// if( hash.includes('#people=') ){
		// 	var person = hash.split('=');
		// 	//console.log(person[1]);
		// 	$('html,body').animate({
		// 		scrollTop: $('#people').offset().top - 75
		// 	},0);
		// 	modalToggle('modal-person-' + person[1]);
		// }
		
	}



	function setupModals() {

		$( document ).ready( function() {

			urlCheck();

			$(".modal-close").click(function(e){
				e.preventDefault();
				closeModal();	
			});

			$(".blanket").click(function(e){
				e.preventDefault();
				closeModal();	
			});			

			$(".modal-toggle").click(function(e){

				if( $(this).hasClass('modal-person-toggle') === false ){
					e.preventDefault();
				}

				var target = $(this).data('modal-target');
				modalToggle(target, false);	
			});

			$(".modal-swap").click(function(e){
				e.preventDefault();
				var target = $(this).data('modal-target');
				modalToggle(target,true);	
			});

		});

	}

	//return an object with methods that correspond to above defined functions
	return {
		closeModal: closeModal,
		modalToggle: modalToggle,
		setupModals: setupModals
	};

};