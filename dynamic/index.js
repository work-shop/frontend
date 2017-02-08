"use strict";


var http = require('http'); //allow node.js to make http requests
var path = require('path'); //tools for manipulating OS path strings
var swig = require('swig'); //templating engine
var parseResponse = require('parse-json-response'); //transform stream libary

var listen = require('./listen.js'); //listen is responsible for actually starting the server
var cms = require('./cms.js'); //create an instance of the WP api for our site

var Logger = require('./logging/index.js');

module.exports = function( express, app, config ) {
    return function() {

        //lets do an http get request to the remote API endpoint, if we can parse it as JSON, we get the wordpress schema, if its unsuccessful, we crash the server
        http.get( config.remote_api, parseResponse( function( err, schema ) {

            if ( err ) { throw err; }

            //set up templating
            app.engine('html', swig.renderFile );
            app.set('view engine', 'html');
            app.set('view cache', false);
            app.set('views', path.join(__dirname, '..', 'templates') );
            swig.setDefaults({cache: false});

            //create an instance of the WP api, localized to the specific schema of our site
            var wp = cms( schema, config );

            //global configuration to be included on all routes
            var globals = {
                //global data
                site_title: schema.name,
                site_description: schema.description,
                site_url: schema.home,
                development: config.development || false,
                log: new Logger( config )
            };

            //create a route where static files are served from
            //app.use is to install a middleware on that route
            app.use('/public', express.static( path.join(__dirname, '..', 'public' )));


            //TODO - can we have a get request that happens on all routes no matter what that sets up the global information?

            //app.get is to make a get request
            app.get( '/', require('./routes/index.js')( wp, config, globals ) );
            app.get( '/work', require('./routes/work.js')( wp, config, globals ));

            app.get( '/work/:category', require('./routes/work.js')( wp, config, globals ));
            app.get( '/projects', require('./routes/work.js')( wp, config, globals ));

            app.get( '/projects/:id', require('./routes/project.js')( wp, config, globals ) );

            // app.get( '/news', require('./routes/news.js')( wp, config, globals ));
            // app.get( '/news/:id', function(req, res){
            //     if( isNormalInteger(req.params.id)  ){
            //         require('./routes/news.js')( wp, config, globals )(req, res);
            //     } else{
            //          require('./routes/news-item.js')( wp, config, globals )(req, res);
            //     }
            // });
            //
            // //app.get( '/news/:id', require('./routes/news-item.js')( wp, config, globals ));
            // //app.get( '/news/:page', require('./routes/news.js')( wp, config, globals ));
            //
            // app.get( '/sharing', require('./routes/info.js')( wp, config, globals ));
            // app.get( '/careers', require('./routes/info.js')( wp, config, globals ));
            // app.get( '/jobs/:id', require('./routes/job.js')( wp, config, globals ));
            //
            // app.get( '/about', require('./routes/about.js')( wp, config, globals ));
            // app.get( '/contact', require('./routes/info.js')( wp, config, globals ));
            //
            // app.use( require('./routes/error-404.js')( wp, config, globals ) );
            // app.get('*', require('./routes/404.js')( wp, config, globals ) );

            //start the server
            listen( app,  [config.name, '.sock' ].join(''), config, globals );

        }));

    };

};


function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return String(n) === str && n >= 0;
}
