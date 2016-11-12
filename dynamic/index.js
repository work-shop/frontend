"use strict";

var http = require('http');
var path = require('path');
var swig = require('swig');
var parseResponse = require('parse-json-response');

var pkg = require('../package.json');
var listen = require('./listen.js');
var cms = require('./cms.js');

module.exports = function( express, app, options ) {
	return function() {

        http.get( options.remote_api, parseResponse( function( err, schema ) {

            if ( err ) { throw err; }

            app.engine('html', swig.renderFile );
            app.set('view engine', 'html');
            app.set('view cache', false);
            app.set('views', path.join(__dirname, '..', 'templates') );

            swig.setDefaults({cache: false});

            var wp = cms( schema, options );

            app.use('/public', express.static( path.join(__dirname, '..', 'public' )));

            app.get( '/', require('./routes/index.js')( wp, options ) );

            app.get( '/projects', require('./routes/projects.js')( wp, options ));

            app.get( '/projects/:id', require('./routes/project.js')( wp, options ) );

            app.use( require('./routes/error-404.js')( wp, options ) );

            app.get('*', require('./routes/404.js')( wp, options ) );

            listen( app,  [pkg.name, '.sock' ].join(''), options );


        }));

	};

};
