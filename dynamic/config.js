"use strict";

var path = require('path');
var swig = require('swig');

var cms = require('./cms.js');

/**
 * This micro-module instantiates some global control parameters
 * on the server, and builds a global variables object to be utilized
 * on the various server routes. The globals object contains a Number
 * of `package.json` settings and background parameters for the server.
 *
 * @param express the express library.
 * @param app the express instance for this server.
 * @param config JSON the config object for this server
 * @param log Logger a logger object to install on the globals
 * @return an object of global parameters to use in the server's routes.
 */
module.exports = function( express, app, config, schema, log ) {

    /**
     * We start by instantiating a number of
     * global configuration parameters for the server.
     */
    app.engine('html', swig.renderFile );
    app.set('view engine', 'html');
    app.set('view cache', !config.development );
    app.set('views', path.join( __dirname, '..', 'templates' ) );
    swig.setDefaults({ cache: (!config.development) ? "memory" : false });

    //create a route where static files are served from
    //app.use is to install a middleware on that route
    app.use('/public', express.static( path.join(__dirname, '..', 'public' )));


    /**
     * We'll return a set of global configuration parameters
     * which every route will have access to.
     */
    return {
        site_title: schema.name,
        site_description: schema.description,
        site_url: schema.home,
        development: config.development || false,
        log: log,
        wp: cms( schema, config )
    };

};
