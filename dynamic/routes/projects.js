"use strict";

var destructure = require('../utilities/destructure-projects-response.js');
var compose = require('../utilities/compose.js');

module.exports = function( cms, options ) {

    var urlReplace = require('../utilities/resource-map.js')( options );

    return function( req, res ) {

        cms .projects()
            .param('_embed', true)
            .then( function( data ) {

                res.render( 'projects.html', {
                    projects: data.map( compose( destructure, urlReplace ) )
                });

            });

    };
};
