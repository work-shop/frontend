"use strict";

var fs = require('fs');

module.exports = function( app, config, globals ) {

	if ( config.development ) {

		app.listen( config.port, function () {

            globals.log.log( 'Server listening on port ' + config.port, 'configuration' );

		});

	} else {

		try {

            var exists = fs.existsSync( config.socket );

			if ( exists && fs.statSync( config.socket ).isSocket() ) {

				fs.unlinkSync( config.socket );

			} else if ( exists ) {

                globals.log.error( ['Fatal Error for \'', config.name, '\': Existing non-socket \'', config.socket ,'\'.'].join(''), 'socket-bind' );

                process.exit( 1 );

            }
		} catch ( e ) {

            globals.log.error( e, 'socket-bind' );

            globals.log.error( ['Fatal Error for \'', config.name, '\': Unable to remove existing socket for nginx reverse-proxy.'].join(''), 'socket-bind' );

        }

        process.on('SIGINT', function( ) { process.exit(0); });

        process.on('SIGTERM', function( ) { process.exit(0); });

        process.on('exit', function( ) { fs.unlinkSync( config.socket ); });

		app.listen( config.socket, function() {

            globals.log.log( 'Server listening on socket \'' + config.socket + '\'.', 'configuration' );

            fs.chmodSync( config.socket, 777 );

        });


	}

};
