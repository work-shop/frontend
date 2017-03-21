"use strict";


/**
* This micro-module installs the desired, application-specific routes on
* for the application server.
*
*/

var index = require('./routes/index.js');

var error404 = require('./routes/error.js')( 404 );

var pageAbout = require('./routes/generic/page.js')( {
    type: "page",
    template: "about.html",
    restructure: require('./structures/restructure-about.js')
});


module.exports = function( express, app, config, globals ) {

    /**
    * Routes
    */
    app.get('/', index( globals.wp, config, globals ) );

    app.get('/about', pageAbout( globals.wp, config, globals ) );

    app.get('*', error404( globals.wp, config, globals ) );
    
    /**
    * Redirects
    */

};
