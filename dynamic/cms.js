"use strict";

var WP = require('wpapi');

module.exports = function( schema, options ) {

	return new WP({
        endpoint: options.remote_api,
        routes: schema.routes
    });

};
