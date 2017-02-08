"use strict";

module.exports = function( $ ) {

	function awardsToggle(){
		if($('.awards').hasClass('closed')){
			$('.awards').removeClass('closed').addClass('open');
			$('.awards-toggle').text('Show Fewer Awards -');
		}
		else if($('.awards').hasClass('open')){
			$('.awards').removeClass('open').addClass('closed');
			$('.awards-toggle').text('Show More Awards +');
		}		
	}

	function setupAwardsToggle() {

		$( document ).ready( function() {

			$('.awards-toggle').click(function(e){
				e.preventDefault();
				awardsToggle();
			});
		});

	}

	return {
		awardsToggle: awardsToggle,
		setupAwardsToggle: setupAwardsToggle
	};
};