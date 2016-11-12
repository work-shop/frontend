"use strict";

/**
 * given a predicate defined on objects of arbitrary shape and a transformation
 * to update an arbitrary object in place, returns a function that will recursively
 * descend into an object and modify it in place.
 *
 */
function mapIf( predicate, transformation ) {
    return function decideObjectClassAndAct( object ) {
        if ( Array.isArray( object ) ) {

            return object.map( decideObjectClassAndAct );

        } else if ( typeof object === "object" ) {

            if ( predicate( object ) ) {

                object = transformation( object );
            }

            for ( var key in object ) {
                if ( object.hasOwnProperty( key ) ) {

                    object[ key ] = decideObjectClassAndAct( object[ key ] );

                }
            }

            return object;

        } else {

            return object;

        }

    };

}

module.exports = mapIf;
