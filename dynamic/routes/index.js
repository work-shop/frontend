"use strict";

module.exports = function( cms, options ) {
    return function( req, res ) {

        cms.posts().then( function( data ) {

            res.render( 'index.html', {
                site_title: options.title,
                working: "It's all good, homie.",
                site_description: options.description,
                development: options.development || false
            });

        });

    };
};
