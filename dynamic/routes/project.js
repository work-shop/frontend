"use strict";

var empty = require('../utilities/empty.js');
var destructure = require('../utilities/destructure-projects-response.js');

module.exports = function( wp, config, globals ) {

    var urlReplace = require('../utilities/resource-map.js')( config );

    return function( req, res, next ) {

        var postName = req.params.id;

        wp.projects().param('_embed', true).filter( 'name', postName ).then( function( data ) {
            wp.namespace( 'acf/v2' ).options().then( function( dataOptions ) {

                if ( empty( data ) ) {

                    var err = new Error();
                    err.status = 404;
                    next( err );

                } else if ( data.length === 1 ) {

                    res.render( 'project.html', {
                       globals: globals,
                       options: dataOptions.acf,
                       item: destructure( urlReplace( data[0] ) )
                   } );

                } else {

                    globals.log.error( "Server returned multiple items for a single postName" );
                    res.render( '404.html', { error_code: 500, message: "Multiple results are embedded at this endpoint!"});

                }

            }).catch( function( err ) {

                globals.log.error( err, 'project' );
                res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in options(): " + err.message });

            });
        }).catch( function( err ) {

            globals.log.error( err, 'project' );
            res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in projects(): " + err.message });

        });

    };
};
