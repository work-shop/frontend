"use strict";

var WP = require('wpapi'); //a module to support wordpress API

module.exports = function( schema, config ) {

	//returning an instance of the API, including the schema or information architecture
	return new WP({
        endpoint: config.remote_api, 
        routes: schema.routes
    });

};
