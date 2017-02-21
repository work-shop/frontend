"use strict";

var async = require('async');

/**
 * the base route is a powerful tool for mashalling dependency networks of
 * asynchronously resolvable resources. In plain terms, it provides an interface
 * for getting a series of resources (from the filesystem, over a network, etc),
 * possibly doing a series of subsequent gets based on the results of those resources,
 * and so on, until all asynchronous resources are full resolved. Once this occurs,
 * control is passed to a user-determined success handler if all the resources were
 * successfully retrieved.
 *
 *
 */
module.exports = function BaseRoute() {
    if ( !(this instanceof BaseRoute) ) { return new BaseRoute(); }
    var self = this;

    /**
     * The route function created a new route based on asynchronously
     * required data. It takes some number of arrays containing either
     * promises or callback functions, followed by a succes handler, and
     * an error handler. You *must* pass both a success and an error handler
     * to this routine: failure to do so will crash the routine. We want to
     * make sure that errors are fully covered on these routes.
     *
     * @param variable
     * @return (req, res) -> void A route handler to be installed at this location.
     */
    self.route = function( ) {

        var len = arguments.length;

        var parameters = Array
            /**
             * Transform the passed array-like set of arguments
             * into a workable Array instance for iteration.
             */
            .from( arguments )
            /**
             * Map across the arguments, transforming them into a workable set of
             * asynchronously reconcilable actions.
             *
             * @param arg Array | Callback, if Array, then process the elements as a parallel stream of requests
             * @param i integer index
             */
            .map( function( arg, i ) {
                return {
                    action: determineValidType( arg, i, len ), callback: arg
                };
            });

        /**
         * Divide the set of arguments into the action sets, the success handler, and the error handler.
         */
        var actionset = parameters.filter( function( parameter ) { return parameter.action === "actions"; }),
            success = parameters.filter( function( parameter ) { return parameter.action === "success"; }),
            failure = parameters.filter( function( parameter ) { return parameter.action === "failure"; });

        if ( success.length !== 1 || failure.length !== 1 ) { throw new Error('Route Syntax Error: Somehow managed to supply more than one success or error handler.'); }

        success = success[ 0 ];
        failure = failure[ 0 ];

        /**
         * Initial conditions are defined at this point.
         * Here we go.
         *
         * This returns a route handler to be installed on an endpoint. Given
         * a request and a response, this routine resolves all the specified asynchronous
         * resources as efficiently as possible, catches any errors generated in that process
         * and invokes the appropriate handler.
         *
         *
         * @param req the incoming request object
         * @param res the incoming response object
         */
        return function( req, res ) {

            async.waterfall(

                actionset.map( function( actions ) {

                    return function( previousData, waterfallCB ) {

                        if ( typeof waterfallCB === "undefined" ) {
                            waterfallCB = previousData;
                            previousData = [];
                        }

                        async.parallel( actions.callback.map(
                            function( action ) {

                                if ( typeof action === "object" ) {
                                    /**
                                     * We've encountered an action object. This means
                                     * We should treat the callback parameter as a wp query
                                     * future, and should invoke it's asynchronous task.
                                     */
                                    return function( parallelCB ) {
                                        action
                                            .then( function( result ) { parallelCB( null, result ); })
                                            .catch( function( err ) { parallelCB( err ); });
                                    };

                                } else if ( typeof action === "function" ) {
                                    /**
                                     * We've encountered a function object. This means
                                     * we should treat the callback parameter as a genuine callback
                                     * and invoke it, passing along any previous data we've accumulated to this point.
                                     */
                                    return function( parallelCB ) {

                                        try {

                                            action.apply( null, previousData.concat( [ parallelCB, req, res ] ) );

                                        } catch ( err ) {

                                            parallelCB( err );

                                        }

                                    };

                                } else {
                                    /**
                                     * we've found an action that's neither an object, which we're assuming is a promise-like object
                                     * or a function, which we're assuming is an asynchronous processing step expecting the previousData, a callback
                                     * and possibily the request and response object. Panic.
                                     */

                                     return function( parallelCB ) {

                                         parallelCB( new Error("Route Syntax Error: a route was instantiated with a bad action – neither a function nor a (.then/.catch) promise.") );

                                     };

                                }

                            }),
                            function( err, result ) { waterfallCB( err, result ); }
                    );

                    };
                }),
                function( err, result ) {
                    if ( err === null ) {

                        try {

                            success.callback.apply( null, [req, res].concat( result ) );

                        } catch ( error ) {

                            failure.callback.apply( null, [req, res].concat( [ error ] ) );

                        }

                    } else {

                        failure.callback.apply( null, [req, res].concat( [ err ] ) );

                    }
                }
            );
        };
    };

};


/**
 * This routine determines whether a valid set of arguments
 * was passed to the BaseRoute.route routine.
 *
 * @throws Error this routine throws an error is a bad set
 *               of arguments was passed to the BaseRoute.route routine.
 *
 * @param arg an argument passed to BaseRoute.route
 * @param i int an index in the arguments array
 * @param len int the number of arguments passed
 * @return string the argument type
 *
 */
function determineValidType( arg, i, len ) {
    /**
     * If there were less than two arguments passed, then the contract of the base-route
     * route has been violated. Panic with an Error and crash loudly.
     */
    if ( len < 2 ) { throw new Error('Route Syntax Error: a route was instantiated with less than two handlers. Add an success or error handler to the route.'); }
    if ( Array.isArray( arg ) && i < len - 2 ) {
        /**
         * in this case, we've been passed a valid set of actions, and still have enough room
         * to fit in both of the required callbacks.
         */
         return "actions";

    } else if ( typeof arg === "function" && i === len - 2 ) {
        /**
         * in this case, we've been a function callback, and it's in the
         * position we'd expect a success callback to be in.
         */
         return "success";

    } else if ( typeof arg === "function" && i === len - 1 ) {
        /**
         * in this case, we've been a function callback, and it's in the
         * position we'd expect an error callback to be in. By default a single
         */
         return "failure";

    } else {
        /**
         * Uh oh. We fell through into an error case. The contract of the base-route
         * route has been violated. Panic with an Error and crash loudly.
         */
        throw new Error('Route Syntax Error: The route is improperly structured. Ensure you\'re including all of the dependencies up front, and then specifying two route handlers.');
    }
}
