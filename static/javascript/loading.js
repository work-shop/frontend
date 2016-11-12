"use strict";

module.exports = function( $ ) {

	function loadPage(){
		setTimeout(function(){
			$('.loading').addClass('loaded');
		},500);
	}

	function setupLoading( selector ) {

		$( document ).ready( function() {
			loadPage();
		});

	}

	return {
		loadPage: loadPage,
		setupLoading: setupLoading
	};
};