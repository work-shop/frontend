"use strict";

var empty = require('../utilities/empty.js');

module.exports = function( wp, config, globals ) {

    return function( req, res, next ) {

        var postName = req.params.id;

        wp.about().param('_embed', true).filter( 'name', 'careers' ).then( function( careers ) {
            wp.jobs().param('_embed', true).filter( 'name', postName ).then( function( data ) {

                if ( empty( data ) ) {

                    var err = new Error();
                    err.status = 404;
                    next( err );

                } else if ( data.length === 1 ) {

                    res.render( 'job.html', {
                        globals: globals,
                        careers: careers[0],
                        item: data[0]
                    } );

                } else {

                    globals.log.error( "Server returned multiple items for a single postName", 'job' );
                    res.render( '404.html', { error_code: 500, message: "Multiple results are embedded at this endpoint!"});

                }

            }).catch( function( err ) {

                globals.log.error( err, 'job' );
                res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in jobs(): " + err.message });

            });//2nd request
        }).catch( function( err ) {

            globals.log.error( err, 'job' );
            res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in about(): " + err.message });

        });//1st request
    };
};
