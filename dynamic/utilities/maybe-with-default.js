"use strict";

module.exports = function( def ) { 

	return function( value ) { 
		return ( typeof value === "undefined" || value === null ) ? def : value; 
	}; 

};
