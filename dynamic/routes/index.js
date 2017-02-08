"use strict";

var async = require('async');

var destructure = require('../utilities/destructure-projects-response.js'); //destructure the response

module.exports = function( wp, config, globals ) {

    var urlReplace = require('../utilities/resource-map.js')( config );

    return function( req, res ) {

        wp.namespace( 'acf/v2' ).options().then( function( data ) {

            //array to map over, function to transform it, callback
            async.map( data.acf.client_testimonials, resolveProject, function( err, results ) {

                // DON'T FORGET TO CHECK err
                globals.log.error( err, 'index' );
                data.acf.client_testimonials = results;

                //renders a template file, and exposes an object with whatever data you want in it
                res.render( 'index.html', {

                    globals: globals,
                    options: data.acf,
                    featured_media: function( project, size ) {
                        if ( typeof project.featured_media !== "undefined" && typeof project.featured_media[ size ] !== "undefined" ) {
                            return project.featured_media[ size ].source_url;
                        }
                    },
                    featured_image: function( project, size ) {
                        if ( typeof project.featured_media !== "undefined" && typeof project.featured_media[ size ] !== "undefined" ) {
                            return project.featured_media[ size ].source_url;
                        }
                    }

                });

            });

        }).catch( function( err ) {

            globals.log.error( err, 'index' );
            res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in options(): " + err.message });


        });

    };

    function resolveProject( item, callback ) {

        try {

            wp.projects()
            .id( item.associated_project.ID )
            .param( '_embed', true )
            .then( function( data ) {

                callback( null, {
                    quote: item.quote,
                    name: item.name,
                    override_image: item.override_image,
                    associated_project: destructure( urlReplace( data ) )
                });

            }).catch( function( err ) {

                globals.log.error( err, 'resolveProject-index' );
                callback( err );

            });

        } catch ( err ) {

            globals.log.error( err, 'resolveProject-index' );
            callback( err );

        }

    }

};
