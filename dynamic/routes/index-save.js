"use strict";

var util = require('util');
var base = require('./generic/base-route.js')();
var async = require('async');

var restructureIndex = require('../structures/restructure-index.js');
var mapResources = require('../utilities/resource-map.js');
/**
 *
 *
 */
module.exports = function( wp, config, globals ) {
    return base.route(
        /**
         * Get initial set of resources we need to render the page.
         */
        [ wp.namespace( 'acf/v2' ).options().embed() ],

        /**
         * Process the options to resolve the thoughts that should
         * be embedded on the main page.
         */
        [ getThoughtGroupsForOptions ],
        /**
         * Success Case. All of the needed resources were properly resolved,
         * And the data is available for use immediately in the callback, along
         * with the request and the response.
         *
         * @param req the Express Request Object
         * @param res the Express Response Object
         * @param options JSON, the requested options data
         */
        function( req, res, options ) {

            globals.log.log( 'Successful request to index.', 'route-index:success-handler');

            res.render('index.html', restructureIndex( options ) );

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

            res.render('error.html', {error_code: 500, description: err.message });

        });

        /**
         *
         *
         *
         */
        function getThoughtGroupsForOptions( options, callback ) {

            async.map((options.acf.thought_groups || []), function( group, next ){

                async.map(group.thoughts, function( thought, next ) {

                    wp.thoughts().id( thought.ID ).embed()

                      .then( function( data ) { next( null, data ); })

                      .catch( function( err ) { next( err ); });

                }, function(err, result) {

                    group.thoughts = result;

                    next( err, group );

                });

            }, function( err, result ) {

            // globals.log.log( util.inspect( result[0].thoughts ), 'get-thought-groups' );

                options.acf.thought_groups = result;

                callback( err, options );

            });
        }

};
