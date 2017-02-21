"use strict";

var messages = require('../structures/error-message-structure.js');

/**
 *
 *
 *
 */
module.exports = function( errorNumber ) {
    return function( wp, config, globals ) {
        return function( req,res ) {

            var response = messages["" + errorNumber + ""];

            if ( typeof response === "function" ) {

                res.render('error.html',  {error_code: errorNumber, description: response( req ) });

            } else {

                res.render('error.html', {error_code: errorNumber, description: response} );

            }

        };
    };
}
