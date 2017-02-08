"use strict";

var url = require('url');
var mapIf = require('./map-if-rec.js');

//
function urlReplace( source, target ) {
    return source.replace( /^.+?[^\/:](?=[?\/]|$)/g, target );
}

module.exports = function( options ) {
    if ( options.development ) {
        return mapIf(
            function( object ) {
                return typeof object.guid !== "undefined" || typeof object.link !== "undefined";
            },
            function( object ) {
                if ( typeof object.guid !== "undefined" ) {
                    object.guid.rendered = urlReplace( object.guid.rendered, ['http://localhost', options.port ].join(':') );
                }

                if ( typeof object.link !== "undefined" ) {
                    object.link = urlReplace( object.link, ['http://localhost', options.port ].join(':') );
                }

                return object;
            }
        );

    } else {

        return function( x ) { return x; };
    }
};
