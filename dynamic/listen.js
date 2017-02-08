"use strict";

var fs = require('fs');

module.exports = function( app, socket, config, globals ) {

	if ( config.development ) {

		app.listen( config.port, function () {

            globals.log.log( 'Server listening on port ' + config.port, 'configuration' );

		});

	} else {

		try {

			if ( fs.statSync( socket ).isSocket() ) {

				fs.unlinkSync( socket );

			}

		} catch ( e ) {

            globals.log.error( e, 'socket-bind' );

            console.error( ['Fatal Error for \'', config.name, '\': Unable to remove existing socket for nginx reverse-proxy.'].join('') );

        }

		app.listen( socket, function() { fs.chmodSync( socket, 777 ); });

		process.on('SIGINT', function( ) { process.exit(0); });

		process.on('SIGTERM', function( ) { process.exit(0); });

		process.on('exit', function( ) { fs.unlinkSync( socket ); });

	}

};
