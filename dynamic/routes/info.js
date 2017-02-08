"use strict";

var empty = require('../utilities/empty.js');
var destructure = require('../utilities/destructure-projects-response.js');

module.exports = function( wp, config, globals ) {

    var urlReplace = require('../utilities/resource-map.js')( config );


    return function( req, res ) {

        var originalUrl = req.originalUrl;
        if (originalUrl.charAt(0) === "/") originalUrl = originalUrl.substr(1);
        if (originalUrl.charAt(originalUrl.length - 1) === "/") originalUrl = originalUrl.substr(0, originalUrl.length - 1);

        var pageName = originalUrl;
        var template = pageName + '.html';

        wp.namespace( 'acf/v2' ).options().then( function( options ) {
            wp.about().param('_embed', true).filter( 'name', pageName ).then( function( data ) {

                if( pageName === 'careers'){
                    wp.jobs().param('_embed', true).then( function( jobs ) {
                        res.render( template, {
                            globals: globals,
                            options: options.acf,
                            item: data[0],
                            jobs: urlReplace(jobs)
                        } );
                    });
                }else{
                    res.render( template, {
                        globals: globals,
                        options: options.acf,
                        item: data[0]
                    } );
                }

            }).catch( function( err ) {

                globals.log.error( err, 'info' );
                res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in about(): " + err.message });

            });//2nd request
        }).catch( function( err ) {

            globals.log.error( err, 'info' );
            res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in options(): " + err.message });

        });//1st request

    };//return function

};
