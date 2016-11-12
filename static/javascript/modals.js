"use strict";

module.exports = function($) {

	function closeModal(){

		if($('body').hasClass('modal-on')){
			$('.modal').removeClass('on').addClass('off');
			$('body').removeClass('modal-on').addClass('modal-off');
		}

	}

	function modalToggle(_target,swap){

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

	function setupModals() {

		$( document ).ready( function() {

			$(".modal-close").click(function(e){
				e.preventDefault();
				closeModal();	
			});

			$(".modal-toggle").click(function(e){
				var target = $(this).data('modal-target');
				modalToggle(target);	
			});

			$(".modal-swap").click(function(e){
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