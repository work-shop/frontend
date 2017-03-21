"use strict";


var request = require('requestretry');

var generateConfig = require('./config.js');
var routes = require('./routes.js');
var listen = require('./listen.js'); //listen is responsible for actually starting the server
var Logger = require('./logging/index.js');

module.exports = function( express, app, config ) {
    return function() {

        /**
         * The front-end makes a lot of HTTP requests to the same address.
         * Let's only hit the DNS stack once. The module below defines
         * an in-application cache for the response from the DNS stack.
         */
        require('dnscache')({
            'enable': true,
            'ttl': 300,
            'cachesize': 1000
        });

        /** prettier logging... */
        var log = new Logger( config );

        /**
         * The DNS system, and http in general, is fickle. Let's use a retry-library
         * to handle network errors and ENOTFOUND from the DNS. These are usually transient
         * errors that we can bypass. This library attempts to resolve the passed cms
         * name `config.retries.delay` times, and will cache the physical address of the
         * target machine off of DNS is success is acheived. The speed and consistency increase obtained
         * through request-retry + dnscache is noticable.
         */
        request({
                url: config.external_api,
                json: true,
                maxAttempts: config.retries.attempts,
                retryDelay: config.retries.delay,
                retryStrategy: request.RetryStrategies.HTTPOrNetworkError,
                fullResponse: false
            })
            /**
             * The initial API request should result in the set of available namespaces
             * Installed on WordPress' rest endpoint. We request this schema to instantiate
             * the `wp-api` library.
             *
             * @param schema JSON
             */
            .then( function( schema ) {

                var globals = generateConfig( express, app, config, schema, log );

                routes( express, app, config, globals );

                listen( app, config, globals );

            })
            /**
             * If the initial API Request fails, there's not much we can do to recover,
             * beyond backing off, and retrying. In this case, it's better for us
             * to fail noisily, and wait for the administrator to relaunch the
             * application server later.
             *
             * @param error Error
             */
            .catch( function( error ) {

                log.error( error, 'initial-api-schema-request' );
                process.exit( 1 );

            });

    };

};
