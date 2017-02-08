"use strict";

module.exports = function( $, Isotope ) {


	var iso;
	var grid = document.querySelector('#grid');	
	var $filters = $('.filters');
	var $categoryTitle = $('.category-title');
	var $categoryDescription = $('.work-statement');
	var $buttonGroup = $('.filters-button-group');
	var $categoryLabel = $('#category-label');
	var $categoryLabelText = $('.category-label-text');
	var stateObj = {};
	var localStorageName = 'dbvwArchitectsCategoryName';
	var localStorageSlug = 'dbvwArchitectsCategorySlug';
	var initialized = false;


	//initialize
	function initialize(){

		resetLocalStorage();

		//when the window is loaded, create isotope
		$(window).on("load", function() {

			//create isotope
			iso = new Isotope( grid, {
				itemSelector: '.grid-item',
				transitionDuration: '.35s',
				masonry: {
					columnWidth: '.grid-sizer',
					gutter: '.gutter-sizer'
				},				
				getSortData: {
					number: '[data-order]',
					featured: function(itemElem) {
						var order = $(itemElem).attr('data-sort');
						return parseInt(order);
					}
				},
				hiddenStyle: {
					opacity: 0
				},
				visibleStyle: {
					opacity: 1
				}
			});

			//get initial category state
			var initialCategoryId = $filters.data('category-start');
			var initialCategory = projectCategories[initialCategoryId];

			//filter to initial category state
			filter( initialCategory );

			bindEvents();

		});

	}


	//filter projects
	function filter( category ){

		//before filtering, clear all filtering and sorting overrides
		$('.featured').removeClass('featured-active');
		$('.featured').attr('data-sort', 2 ); 

		//isotope filtering
		iso.arrange({

			  // item element provided as argument
			  filter: function( itemElem ) {

			  	var $featuredItem = $('.featured-' + category.slug);
			  	var $itemElem = $(itemElem);

			  	if( $featuredItem.attr('id') === $itemElem.attr('id') ){
			  		$featuredItem.addClass('featured-active');
			  		$featuredItem.attr('data-sort', 1 );
			  	}

			  	//check if the element has a class matching the category we're filtering to
			  	var flag = $itemElem.hasClass(category.slug);	
			  	return flag;
			  }
			});		

		sort( category );

	}


	//sort 
	function sort( category ){
		
		iso.updateSortData();
		iso.arrange({
			sortBy: 'featured',
			sortAscending: true
		});		

		update( category );
	}


	//update the view
	function update( category ){

		$categoryTitle.text( category.name );
		$categoryDescription.text( category.description );

		stateObj.category = category;				

		//apply global classes to manage what the specifics of the category we're viewing
		if( category.slug !== 'all' ){
			
			$('body').addClass('category-filtered');

			$categoryLabel.addClass('on');
			$categoryLabelText.text(category.name);			

			var newUrl = '/work/' + category.slug;

			updateUrl(stateObj, newUrl);

		} 
		else if ( category.slug === 'all' ){

			$('body').removeClass('category-filtered');	

			$categoryLabel.removeClass('on');
			$categoryLabelText.text('');

			var newUrl = '/work';			

			updateUrl(stateObj, newUrl);				

		}	

		//jump to the top of the page
		$('html,body').animate( { scrollTop: 0 }, 250 );

		if( !initialized ){
			initialized = true;
			
			setTimeout(function() {
				displayGrid();
			}, 500);

		}			
	}


	//update the URL based on the category
	function updateUrl( stateObj, url ){
		localStorage.setItem(localStorageName, stateObj.category.name);
		localStorage.setItem(localStorageSlug, stateObj.category.slug);	
		history.pushState( stateObj, '', url );
	}


	function toggleMenu(){
		if( $filters.hasClass('open') ){
			$filters.removeClass('open');
		} else {
			$filters.addClass('open');
		}
	}


	function resetLocalStorage(){
		
		//localStorage.setItem(localStorageName, 'all');
		//localStorage.setItem(localStorageSlug, 'all');			
	}

	//bind events
	function bindEvents(){

		$(".filter-button").click(function(e){
			e.preventDefault();
			var categoryId = $( this ).attr('data-category-id');
			var category = projectCategories[categoryId];
			filter( category );
			$buttonGroup.find('.is-checked').removeClass('is-checked');
			$(this).addClass('is-checked');	
			toggleMenu();
		});

		$(".filter-dropdown-button").click(function(e){
			e.preventDefault();
			toggleMenu();
		});	

		$("#category-label").click(function(e){
			e.preventDefault();
			var category = projectCategories[projectCategories.length-1];
			filter( category );
			$buttonGroup.find('.is-checked').removeClass('is-checked');
			if( $filters.hasClass('open') ){
				$filters.removeClass('open');
			}
		});					

		window.onpopstate = function(event){
			filter(event.state.category);
			if( $filters.hasClass('open') ){
				$filters.removeClass('open');
			}
		};

	}

	//remove the work-loading class from the #work element, and hide the loading icon
	function displayGrid(){
		$('#work').removeClass('work-loading').addClass('work-loaded');
	}
	

	//return on object with the initialize function
	return {
		initialize: initialize
	};

};

