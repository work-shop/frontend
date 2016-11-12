"use strict";


module.exports = function( wp, options ) {

    var page404 = require('./404.js')( wp, options );

    return function( err, req, res, next ) {
        if ( err.status === 404 ) {

            page404( req, res, next );

        } else {

            next( err );

        }
    };
};
