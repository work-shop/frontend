"use strict";


var base = require('./base-route.js')();

var async = require('async');

/**
 * This route gets the full archive for a given wordpress post-type.
 *
 * {
 *     type: (string) the wordpress post_type that you'd like to resolve.
 *     template: (string) the name of the template to be rendered
 *     restructure: (function) the restructuring function that maps this post-type's API results to usable template contexts.
 *     resolveArchive: [optional] a (function) that implements custom route resolution logic.
 * }
 */
 module.exports = function( routeOptions ) {

     return function( wp, config, globals ) {
         return base.route(
             [
                 wp.namespace( 'acf/v2' ).options().embed(),
                 routeOptions.resolveArchive || resolveRequestedArchive
             ],
             /**
              * Success Handler
              * ===============
              * Receives the resolved post object, and calls the appropriate
              * success handler, rendering the passed template.
              */
             function( req, res, options, archive ) {

                 globals.log.log( 'successful generic request', 'route-generic-unpaginated-archive:success-handler');

                 res.render( routeOptions.template, (routeOptions.restructure || function(x) {return x;})( archive, options ) );

             },
             /**
              * Error Handler
              * ===============
              * Receives the caught error object, and calls the
              * error handler, rendering the generic error template.
              */
             function( req, res, err ) {

                globals.log.error( err, 'route-generic-unpaginated-archive:error-handler');

                res.render('error.html', {error_code: err.code, description: err.message });

             }
         );


        /**
        * This routine implements the logic of retrieving all of the posts
        * associated to a given post-type. The maximum API response quantity is
        * 100, so, *just to be sure*, we'll want to continue to request more posts
        * until we receive less than 100 in response.
        */
        function resolveRequestedArchive( callback ) {

            var targetLength = 100;
            var page = 2;

            wp[ routeOptions.type ]().embed().perPage( targetLength )
                .then( function( data ) {

                    var results = data;
                    var resultSet = [];

                    async.whilst(

                        /**
                         * This routine tests to check if data there are at least `targetLength`
                         * results in `results`. If this is the case, it returns true, so as to
                         * instigate a further request.
                         *
                         * @return boolean if there are potentially more results to get.
                         */
                        function() {
                            return results.length >= targetLength;
                        },

                        /**
                         * This routine implements a request to get the next page of posts from
                         * the API, so as to continue populating the total number of responses.
                         * it receives a result from the API, concats it into `resultSet`, places
                         * its value in `results`, and continues the loop.
                         */
                        function( next ) {
                            wp[ routeOptions.type ]().embed().perPage( targetLength ).page( page )
                            .then( function( data ) {

                                resultSet.concat( data );
                                results = data;

                                next( null, resultSet );

                            })
                            .catch( function( err ) {

                                next( err );

                            });
                        },

                        /**
                         * This function is invoked when the loop has terminated. It passes all of the data
                         * back to the calling route.
                         */
                        callback
                    );

                })
                .catch( callback );

        }

     };
};
