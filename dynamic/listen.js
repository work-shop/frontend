"use strict";

var fs = require('fs');

module.exports = function( app, config, globals ) {

	if ( config.development ) {

		app.listen( config.port, function () {

            globals.log.log( 'Server listening on port ' + config.port, 'configuration' );

		});

	} else {

		try {

			if ( fs.statSync( config.socket ).isSocket() ) {

				fs.unlinkSync( config.socket );

			}

		} catch ( e ) {

            globals.log.log( e.message, 'socket-bind' );

        }

		app.listen( config.socket, function() { fs.chmodSync( config.socket, 777 ); });

		process.on('SIGINT', function( ) { process.exit(0); });

		process.on('SIGTERM', function( ) { process.exit(0); });

		process.on('exit', function( ) { fs.unlinkSync( config.socket ); });

	}

};
