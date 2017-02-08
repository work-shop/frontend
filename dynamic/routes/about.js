"use strict";

var async = require('async');

var destructure = require('../utilities/destructure-projects-response.js'); //destructure the response

module.exports = function( wp, config, globals ) {

    var urlReplace = require('../utilities/resource-map.js')( config );

    return function( req, res ) {

        wp.namespace( 'acf/v2' ).options().then( function( data ) {

            wp.people().perPage(50).param('_embed', true).then( function( people ) {

                //array to map over, function to transform it, callback
                async.map( data.acf.client_testimonials, resolveProject, function( err, results ) {

                    // DON'T FORGET TO CHECK err

                    if ( err ) {

                        globals.log.error( err, 'about' );
                        res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in client_testimonials map: " + err.message });

                    } else {

                        data.acf.client_testimonials = results;

                        //renders a template file, and exposes an object with whatever data you want in it
                        res.render( 'about.html', {

                            globals: globals,
                            options: data.acf,
                            people: people,
                            featured_image: function( project, size ) {
                                if ( typeof project.featured_media !== "undefined" && typeof project.featured_media[ size ] !== "undefined" ) {
                                    return project.featured_media[ size ].source_url;
                                }
                            }
                        });

                    }

                });//3rd request
            }).catch( function( err ) {

                globals.log.error( err, 'about' );
                res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in people(): " + err.message });

            });//2nd request
        }).catch( function( err ) {

            globals.log.error( err, 'about' );
            res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in options(): " + err.message });

        });//1st request

    };

    function resolveProject( item, callback ) {

        try {

            if( typeof item.associated_project.ID !== 'undefined'  ){

                wp.projects()
                .id( item.associated_project.ID )
                .param( '_embed', true )
                .then( function( data ) {
                   callback( null, {
                    quote: item.quote,
                    name: item.name,
                    associated_project: destructure( urlReplace( data ) )
                }).catch( function( err ) {

                    globals.log.error( err );
                    callback( err );

                });
               });

            } else {

               globals.log.log( 'no associated project', 'resolveProject-about' );
               callback( null, {});

            }

        } catch( err ) {

            globals.log.error( err, 'resolveProject-about' );
            callback( err );

        }

   }

};
