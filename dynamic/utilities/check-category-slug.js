"use strict";

module.exports = function() {

	return function ( category, projectCategories ){

		for (var i = 0; i < projectCategories.length; i++) {
			if(category === projectCategories[i].slug){
				console.log(projectCategories[i].slug);
				return true; 
			}
		}

		return false;
	
	};

};
