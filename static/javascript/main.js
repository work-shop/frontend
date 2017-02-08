"use strict";

//configuration
var configuration = require('../../package.json').frontend;


//get third party libraries
var $ = require('jquery');
var slick = require('slick-carousel');

//assign jquery to the window, so it can be accessed in the console
window.$ = $;

//get utilities
var jumpUtilities = require('./jump-utilities.js')($);
var loading = require('./loading.js')($);
var menuUtilities = require('./menu-utilities.js')($);
var slideshows = require('./slideshows.js')($, slick);
var modals = require('./modals.js')($);
var stickyNav = require('./sticky-nav.js')($);


//setup utilities
jumpUtilities.setupJumpEvents('.jump', 75, 567, 50, true);
jumpUtilities.setupJumpEvents('.spy-link', 134, 567, 50, false);
loading.setupLoading();
slideshows.setupSlideshows();
menuUtilities.setupMenus();
modals.setupModals();


//site
var timeline = require('./timeline.js')($);
timeline.setupTimeline();
var awardsToggle = require('./awards-toggle.js')($);
awardsToggle.setupAwardsToggle();


//page specific
if($('body').hasClass('page-about')){
	var scrollSpy = require('./scroll-spy.js')($);	
	scrollSpy.initialize('.spy-start', '.spy-target', '.spy-link', 135);
	var aboutNav = require('./about-nav.js')($);
	aboutNav.setupAboutNav();
}


if($('body').hasClass('page-work')){
	var Isotope = require('isotope-layout');
	var iso = require('./iso.js')($, Isotope);
	iso.initialize();
	stickyNav.initialize('.filters', 75, 50);
}


if($('body').hasClass('page-project')){
	//TEMPORARY
	//var descriptionToggle = require('./description-toggle.js')($);
	//descriptionToggle.setupDescriptionToggle();
	var relatedProjects = require('./related-projects.js')($, configuration);
	relatedProjects.initialize();
}




