"use strict";

module.exports = function( g,f ) { return function( x ) { return g( f( x ) ); }; };
