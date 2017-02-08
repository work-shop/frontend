"use strict";

module.exports = function( ){
    return function( req, res ) {
        res.render( '404.html', { error_code: 404 });
    };
};
