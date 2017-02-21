"use strict";


var base = require('./base-route.js')();

/**
 * This route implements a generic paginated archive page view
 * In order to give you a little bit of flebility in how the structure behaves,
 * It's parameterized by an option object of the following form:
 * {
 *     type: (string) the wordpress post_type that you'd like to resolve.
 *     perPage: (int) the number of objects to be returned per page.
 *     page: (int) the page to navigate to by default.
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
                 routeOptions.resolveArchive || resolveRequestedArchivePage
             ],
             /**
              * Success Handler
              * ===============
              * Receives the resolved post object, and calls the appropriate
              * success handler, rendering the passed template.
              */
             function( req, res, options, archive ) {

                 globals.log.log( 'successful generic request', 'route-generic-paginated-archive:success-handler');

                 res.render( routeOptions.template, (routeOptions.restructure || function(x) {return x;})( archive, options ) );

             },
             /**
              * Error Handler
              * ===============
              * Receives the caught error object, and calls the
              * error handler, rendering the generic error template.
              */
             function( req, res, err ) {

                globals.log.error( err, 'route-generic-paginated-archive:error-handler');

                res.render('error.html', {error_code: err.code, description: err.message });

             }
         );


        /**
        *
        *
        *
        */
        function resolveRequestedArchivePage( callback, req ) {

            wp[ routeOptions.type ]().perPage( routeOptions.perPage || 10 )
                .page( req.params.page || routeOptions.defaultPage || 1 ).embed()
                .then( function( data ) {

                    if ( data.length === 0 ) {

                        var e404 = new Error("404: couldn't find the requested archive page");

                        e404.code = 404;

                        callback( e404 );

                    } else {

                        callback( null, data );

                    }

                })
                .catch( callback );

        }

     };
};
