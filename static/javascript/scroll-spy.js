"use strict";

module.exports = function($){

	//this spy function is goverened by the targets, and if there is a corresponding link, it will become active

	var scrollSpy = {};

	var activated = false;
	var firstPass = true;


	function initialize(startElement, targetElements, linkElements, offset){

		$(window).on("load", function() {		

			scrollSpy.targets = $(targetElements);
			scrollSpy.links = $(linkElements);
			scrollSpy.offset = offset;

			if( startElement ){
				startElement = $(startElement);
				startElement.addClass('active');
				scrollSpy.currentElement = startElement;
			}else{
				scrollSpy.currentElement = scrollSpy.targets[0];
			}		

			scrollSpy.spyMap = [];

			update();

			setTimeout(function() {	update(); setTimeout(function() { update(); }, 5000); }, 2500);

		});

	}


	function update(){

		//console.log('scrollspy update');

		scrollSpy.targets.each(function( i ) {

			//create an object to store the necessary data for this target
			scrollSpy.spyMap[i] = {};
			scrollSpy.spyMap[i].target = $(this); 
			var offset = $(this).offset();
			scrollSpy.spyMap[i].targetOffset = Math.round(offset.top);


			//take the ID of this target element, and see if there is a link that matches it

			//if there is a link that pairs with this target, store that as well
			var elementId = $(this).attr('id');
			var link = checkLinks(elementId);

			if( link !== undefined ){
				scrollSpy.spyMap[i].hasLink = true;
				scrollSpy.spyMap[i].link = link;
			} else{
				scrollSpy.spyMap[i].hasLink = false;
			}


			//console.log('target:');
			//console.log('#' + scrollSpy.spyMap[i].target.attr('id') + ': ' + scrollSpy.spyMap[i].targetOffset);
			//console.log('targetOffset: ' + scrollSpy.spyMap[i].targetOffset);
			//console.log('hasLink: ' + scrollSpy.spyMap[i].hasLink);
			//console.log('link: ' + scrollSpy.spyMap[i].link);

		});

		spy();

	}


	function checkLinks( targetId ){

		var link;

		scrollSpy.links.each(function( j ){

			var linkHref = $(this).attr('href');
			var linkId = linkHref.replace('#','');

			if( linkId === targetId){
				link = $(this);
			}

		});

		if( link ){
			return link;
		} else{
			return;
		}

	}


	function spy(){

		var nElements = scrollSpy.spyMap.length;

		for(var i = 0; i < nElements; i++ ){

			var userLocation, targetOffsetPosition, tolerance, targetPosition, nextTargetOffsetPosition, nextTargetPosition;

			userLocation = $(window).scrollTop() + scrollSpy.offset;

			targetOffsetPosition = scrollSpy.spyMap[i].targetOffset;
			//tolerance = ($(window).height() - scrollSpy.offset) / 2;
			tolerance = scrollSpy.offset;
			targetPosition = targetOffsetPosition - tolerance;

			if( i < (nElements - 1) ){
				nextTargetOffsetPosition = scrollSpy.spyMap[i+1].targetOffset;
				nextTargetPosition = nextTargetOffsetPosition - tolerance;
			}

			//if the user's window.scrollTop is greater than or equal to the offsetTop of the element we're currently checking AND it's not the last targetable element OR the user's window.scrollTop is less than the next element then we think this element should be active
			if( userLocation >= targetPosition && ( ( i === nElements - 1 ) || (userLocation < nextTargetPosition) ) || firstPass ) {

				//if the element we think should be active is not the current element
				if(scrollSpy.currentElement !== (scrollSpy.spyMap[i].target) || firstPass ){

					if( firstPass ){
						firstPass = false;
					}

					scrollSpy.currentElement.removeClass('active');

					scrollSpy.spyMap[i].target.addClass('active');
					scrollSpy.spyMap[i].target.addClass('activated');

					if( scrollSpy.spyMap[i].hasLink ){

						scrollSpy.links.filter('.active').removeClass('active');
						scrollSpy.spyMap[i].link.addClass('active');
						//scrollSpy.spyMap[i].link.parent.addClass('active');

					}

					scrollSpy.currentElement = scrollSpy.spyMap[i].target;

				}

			}

		}

		if( activated === false ){
			activate();
			activated = true;
		}

	}


	function activate(){

		var spyTrigger = debounce(function() {
			window.requestAnimationFrame(spy);
		}, 10);

		var spyUpdate = debounce(function() {
			window.requestAnimationFrame(update);	
		}, 50);		

		window.addEventListener('scroll', spyTrigger);
		window.addEventListener('resize', spyUpdate);

	}


	// Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for N milliseconds. If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}

	return{
		initialize : initialize,
		update : update,
		spy : spy,
		activate : activate
	};

};