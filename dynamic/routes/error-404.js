"use strict";


module.exports = function( wp, config, globals ) {

    var page404 = require('./404.js')( wp, config );

    return function( err, req, res, next ) {
        if ( err.status === 404 ) {

            page404( req, res, next );

        } else {

            next( err );

        }
    };
};
