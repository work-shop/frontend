"use strict";

module.exports = function( $, configuration ) {

	var $rpNames = $('.rp-name');
	var $rpNamesAll = $('.rp-name-all');	
	var $rpSlugs = $('.rp-slug');
	var $rpProjects = $('.filters-button-group');
	var localStorageName = 'dbvwArchitectsCategoryName';
	var localStorageSlug = 'dbvwArchitectsCategorySlug';
	var rpCategory = {};
	var projectId = $('#project-header').data('id');


	//initialize
	function initialize(){

		$( document ).ready( function() {
			rpCategory = getCategory();
			updateLabels();
			updateLinks();
			getRelatedProjects();
		});

	}


	function getCategory(){
		var name = localStorage.getItem(localStorageName);
		var slug = localStorage.getItem(localStorageSlug);
		var nameAll, categoryUrl;
		console.log('category: ' + name);

		if( name === 'all' || name === null || name === 'Work'){
			name = 'Projects';
			nameAll = 'All Projects'
			categoryUrl = '/work';
		} else{
			name = name + ' Projects';
			nameAll = name;
			categoryUrl = '/work/' + slug;
		}

		var rpCategory = {
			name: name,
			nameAll: nameAll,
			categoryUrl,
			slug: slug
		};

		return rpCategory;
	}


	function updateLabels(){
		$rpNames.each(function(index, el) {
			$(this).text(rpCategory.name);
		});
		$rpNamesAll.each(function(index, el) {
			$(this).text(rpCategory.nameAll);
		});		
	}


	function updateLinks(){
		$rpSlugs.each(function(index, el) {
			$(this).attr('href', rpCategory.categoryUrl);
		});
	}	


	function getRelatedProjects(){
		var endpoint;

		if( rpCategory.name === 'Projects' ){
			endpoint = configuration.remote_api + '/projects?per_page=3&_embed=true&exclude=' + projectId;
		} else{
			endpoint = configuration.remote_api + '/projects?filter[project_categories]=' + rpCategory.slug + '&_embed=true&per_page=3' + '&exclude=' + projectId;
		}

		$.ajax({
			url: endpoint,
			dataType: 'json'
		})
		.done(function(data) {
			//console.log("success loading related projects");
			renderRelatedProjects(data);
		})
		.fail(function() {
			console.log("error loading related projects");
		})
		.always(function() {
			//console.log("completed request for related projects");
		});
		
	}


	function renderRelatedProjects( projects ){

		for( var i = 0; i < projects.length; i++ ){
			var _project = '#rp-' + i;
			var projectLink = projects[i].link;
			var currentUrl = window.location.hostname;

			if( currentUrl == 'localhost' ){
				projectLink = projectLink.replace('http://dbvw.workshopdesignstudio.org', 'http://localhost:8080');
			}

			$(_project).find('.rp-project-title').text(projects[i].title.rendered);
			$(_project).find('.rp-project-image').attr('src', projects[i]._embedded['wp:featuredmedia'][0].media_details.sizes.large.source_url);	
			$(_project).find('.rp-project-link').attr('href', projectLink );			
		}

	}


	//return on object with the initialize function
	return {
		initialize: initialize
	};

};

