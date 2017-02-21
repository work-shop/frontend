"use strict";


/**
* This micro-module installs the desired, application-specific routes on
* for the application server.
*
*/

var index = require('./routes/index.js');
var about = require('./routes/about.js');
// var page = require('./routes/page.js');
// var eventsArchive = require('./routes/events.js');
// var alumniDirectory = require('./routes/alumniDirectory.js');
var error404 = require('./routes/error.js')( 404 );

var pageAbout = require('./routes/generic/page.js')( {
    type: "page",
    template: "about.html",
    restructure: require('./structures/restructure-about.js')
});

// var pageMakeRiStronger = require('./routes/generic/page.js')( {
//     type: "page",
//     template: "make-ri-stronger.html",
//     restructure: require('./structures/restructure-makeRiStronger.js')
// });

// var singleNews = require('./routes/generic/single.js')( {
//     type: "news",
//     template: "single-news.html",
//     restructure: require('./structures/restructure-single-news.js')
// });

// var archiveNews = require('./routes/generic/archive.js')( {
//     type: "news",
//     template: "news.html",
//     restructure: require('./structures/restructure-news.js')
// });


module.exports = function( express, app, config, globals ) {

    /**
    * Routes
    */

    app.get('/', index( globals.wp, config, globals ) );

    // app.get('/alumni', page( globals.wp, config, globals ) );
    // app.get('/contact', page( globals.wp, config, globals ) );
    // app.get('/donate', page( globals.wp, config, globals ) );
    // app.get('/history', page( globals.wp, config, globals ) );
    // app.get('/core-program', page( globals.wp, config, globals ) );
    // app.get('/college-program', page( globals.wp, config, globals ) );
    // app.get('/about/history', page( globals.wp, config, globals ) );
    // app.get('/about/people', page( globals.wp, config, globals ) );
    // app.get('/about/opportunities', page( globals.wp, config, globals ) );
    // app.get('/about/partners', page( globals.wp, config, globals ) );
    // app.get('/history', page( globals.wp, config, globals ) );

    // app.get('/make-ri-stronger', pageMakeRiStronger( globals.wp, config, globals ) );
    // app.get('/strength', pageMakeRiStronger( globals.wp, config, globals ) );

    app.get('/about', pageAbout( globals.wp, config, globals ) );

    // app.get('/alumni-directory', alumniDirectory( globals.wp, config, globals ) );

    // app.get('/news', archiveNews( globals.wp, config, globals ));

    // app.get('/news/:id', singleNews( globals.wp, config, globals ));

    // app.get('/events', eventsArchive( globals.wp, config, globals ));

    app.get('*', error404( globals.wp, config, globals ) );

    /**
    * Redirects
    */

};
