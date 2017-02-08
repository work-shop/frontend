"use strict";

var empty = require('../utilities/empty.js');
//var destructure = require('../utilities/destructure-projects-response.js');

module.exports = function( wp, config, globals ) {

    var urlReplace = require('../utilities/resource-map.js')( config );

    return function( req, res, next ) {

        var postName = req.params.id;

        wp.news().param('_embed', true).filter( 'name', postName ).then( function( data ) {
            wp.namespace( 'acf/v2' ).options().then( function( dataOptions ) {

                var postId = data[0].id;

                wp.news().perPage( 3 ).param('_embed', true).param('exclude', postId).then( function( relatedNews ) {

                    if ( empty( data ) ) {

                        var err = new Error();
                        err.status = 404;
                        next( err );

                    } else if ( data.length === 1 ) {

                        res.render( 'news-item.html', {
                               globals: globals,
                               options: dataOptions.acf,
                               item: data[0],
                               relatedNews: relatedNews.map( urlReplace ),
                               featured_image: function( item, size ) {
                                    if ( typeof item._embedded['wp:featuredmedia'][0] !== "undefined" && typeof item._embedded['wp:featuredmedia'][0].media_details.sizes[size] !== "undefined" ) {
                                        return item._embedded['wp:featuredmedia'][0].media_details.sizes[size].source_url;
                                    }
                                }
                        });

                    } else {
                        globals.log.error( "Server returned multiple items for a single postName" , 'news-item');
                        res.render( '404.html', { error_code: 500, message: "Multiple results are embedded at this endpoint!"});
                    }

                }).catch( function( err ) {

                    globals.log.error( err, 'news-item' );
                    res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in inner news(): " + err.message });

                });
            }).catch( function( err ) {

                globals.log.error( err, 'news-item' );
                res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in options(): " + err.message });

            });
        }).catch( function( err ) {

            globals.log.error( err, 'news-item' );
            res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in outer news(): " + err.message });

        });
    };

};
