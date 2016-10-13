"use strict";

var path = require('path');
var swig = require('swig');

var pkg = require('../package.json');
var listen = require('./listen.js');
var cms = require('./cms.js');

module.exports = function( express, app, options ) {
	return function() {

		app.engine('html', swig.renderFile );
		app.set('view engine', 'html');
    	app.set('view cache', false);
		app.set('views', path.join(__dirname, '..', 'templates') );

		swig.setDefaults({cache: false});

		app.use('/static', express.static( path.join(__dirname, '..', 'static' )));

		app.get( '/', function( req, res ) {
			res.render( 'index.html', {
				site_title: options.title,
                site_description: options.description,
				development: options.development || false
			});
		});

		cms( options );

		listen( app,  [pkg.name, '.sock' ].join(''), options );

	};

};
