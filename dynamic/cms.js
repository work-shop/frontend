"use strict";

var WP = require('wordpress-rest-api');

module.exports = function( options ) {

	var wp = new WP({ endpoint: options.api });

	return wp;

};
