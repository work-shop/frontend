"use strict";

var baseStructure = require('./base-structure.js');
var restructureThought = require('./restructure-thought.js');

/**
 *
 *
 *
 */
module.exports = function( options ) {

    return baseStructure({

        statement: options.site_statement,
        introduction: options.site_introduction,
        thought_groups: options.acf.thought_groups.map( restructureThoughtGroup )

    }, options);

    /**
     *
     *
     */
    function restructureThoughtGroup( group ) {

        group.thoughts = group.thoughts.map( function( thought ) { restructureThought( thought, options ); } );

        return group;
    }

};
