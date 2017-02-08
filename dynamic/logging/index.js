"use strict";

require('colors');

module.exports = function Logger( config ) {
    if (!(this instanceof Logger)) { return new Logger( config ); }
    var self = this;

    var debug = true;

    self.log = function( message, prefix ) {
        if ( debug ) {
            console.log( ['['.gray,(new Date()).toISOString().gray,'] '.gray, (typeof prefix !=="undefined") ? ("("+ prefix +") ").green : "", "- ".gray, message ].join('') );
        }

        return self;
    };

    self.error = function( err, prefix ) {
        if ( debug && (err !== null) ) {
            if ( typeof err === "string" ) {
                console.error( ['['.gray,(new Date()).toISOString().gray,'] '.gray, (typeof prefix !=="undefined") ? ("("+ prefix +") ").red : "", "- ".gray, err, '\n'].join('') );
            } else {
                console.error( ['['.gray,(new Date()).toISOString().gray,'] '.gray, (typeof prefix !=="undefined") ? ("("+ prefix +") ").red : "", "- ".gray, err.message, '\n', err.stack.gray, '\n'].join('') );
            }
        }

        return self;
    };

    self.stacktrace = function( err ) {
        if ( debug ) {
            console.error( [ err.stack.gray, '\n' ].join('') );
        }

        return self;
    };
};
