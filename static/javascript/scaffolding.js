"use strict";

module.exports = function($) {

	//
	function doSomething(){
	
	}

	//
	function setupSomething() {

		$( document ).ready( function() {
			window.requestAnimationFrame(doSomething);	
		});

	}

	//return an object with methods that correspond to above defined functions
	return {
		doSomething: doSomething,
		setupSomething: setupSomething
	};

};