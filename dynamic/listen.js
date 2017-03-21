"use strict";

var fs = require('fs');

module.exports = function( app, config, globals ) {

	if ( config.development ) {

        /**
         * We're in development mode.
         * ==========================
         * We're expecting experimentation.
         * set up a local HTTP server on localhost, at the port
         * specified during startup, and start listening for HTTP traffic.
         */
		app.listen( config.port, function () {

            globals.log.log( 'Server listening on port ' + config.port, 'configuration' );

		});

	} else {

        /**
         * We're in production mode.
         * ========================
         * We run all HTTP traffic to the application through a unix domain socket
         * in production, so do the following:
         *
         * 1. Check to see if a socket for this application currently exists.
         *    if it does, go ahead and unlink it. If it doesn't, that's fine too.
         */
		try {

			if ( fs.statSync( config.socket ).isSocket() ) {

				fs.unlinkSync( config.socket );

			}

		} catch ( e ) {

            if ( e.code === "ENOENT" ) {

                globals.log.log( ['no existing ', config.socket].join(''), 'socket-bind' );

            } else {

                globals.log.error( e.message, 'socket-bind' );

            }

        }


        /**
         * 2. Go ahead and start the HTTP server on that socket.
         *    The NGINX reverse-proxy needs to be able to talk to this socket as
         *    as its upstream server, so set up the server, create the socket, and
         *    modify its permissions appropriately.
         */
         app.listen( config.socket, function() {

             globals.log.log( ['server listening on \'', config.socket, '\''].join(''), 'socket-bind' );

             fs.chmod( config.socket, '777', function( err ) {

                 if ( err ) {

                     globals.log.error( err, 'socket-chmod' );
                     process.exit(1);

                 } else {

                     globals.log.log( 'changed socket permissions to 777.', 'socket-chmod' );

                 }

             });

         });


        /**
         * 3. Finally, we want to exit gracefully and clean up our resources
         *    when we're done. set up exit handlers for SIGINT and SIGTERM,
         *    and destroy the socket when we're done.
         */
		process.on('SIGINT', function( ) { process.exit(0); });

		process.on('SIGTERM', function( ) { process.exit(0); });

		process.on('exit', function( ) {

            globals.log.log( 'received exit signal.', 'server-exit' );

            fs.unlinkSync( config.socket );

            globals.log.log( 'unlinked socket.', 'server-exit' );

            globals.salesforce.logout( function( err ) {

                if ( err ) { globals.log.error( err, 'salesforce-authentication'); }

            });

        });


	}

};
