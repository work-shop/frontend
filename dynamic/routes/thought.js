"use strict";

var util = require('util');
var base = require('./generic/base-route.js')();

var restructureThought = require('../structures/restructure-thought.js');
//var mapResources = require('../utilities/resource-map.js');
/**
 *
 *
 */
module.exports = function( wp, config, globals ) {
    return base.route(
        /**
         * Get initial set of resources we need to render the page.
         */
        [
            wp.namespace( 'acf/v2' ).options().embed(),
            resolveRequestedThought
        ],

        /**
         * Success Case. All of the needed resources were properly resolved,
         * And the data is available for use immediately in the callback, along
         * with the request and the response.
         *
         * @param req the Express Request Object
         * @param res the Express Response Object
         * @param options JSON, the requested options data
         */
        function( req, res, options, thought ) {

            globals.log.log( 'Successful request to index.', 'route-index:success-handler');
            globals.log.log( util.inspect( thought ), 'route-index:requested-thought');

            res.render('thought.html', restructureThought( thought ) );

        },
        /**
         * Error Case. Something went wrong reconciling one or all of the
         * requested resources. The error is supplied to the callback
         * and *you* handle the problem.
         *
         * @param req the Express Request Object
         * @param res the Express Response Object
         * @param err Error the reason for failure.
         */
        function( req, res, err ) {

            globals.log.error( err, 'route-index:error-handler');

            res.render('error.html', {error_code: err.code, description: err.message });

        });

        /**
         *
         *
         *
         */
        function resolveRequestedThought( callback, req ) {

            wp.thoughts().embed().filter('name', req.params.id )
              .then( function( thought ) {

                  if ( thought.length === 0 ) {

                      var e404 = new Error("404: couldn't find the requested resource");

                      e404.code = 404;

                      callback( e404 );

                  } else if ( thought.length > 1 ) {

                      var e500 = new Error("500: ConsistencyError: the API returned multiple posts with the same slug.");

                      e500.code = 500;

                      callback( e500 );

                  } else {

                      callback( null, thought[0] );

                  }



              })
              .catch( function( err )  {

                  callback( err );

              });

        }

};
