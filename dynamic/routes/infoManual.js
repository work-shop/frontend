"use strict";

var empty = require('../utilities/empty.js');
var destructure = require('../utilities/destructure-projects-response.js');
var http = require('http');

module.exports = function( wp, config, globals ) {

    var urlReplace = require('../utilities/resource-map.js')( options );


    return function( req, res ) {

        var originalUrl = req.originalUrl;
        if (originalUrl.charAt(0) === "/") originalUrl = originalUrl.substr(1);
        if (originalUrl.charAt(originalUrl.length - 1) === "/") originalUrl = originalUrl.substr(0, originalUrl.length - 1);
        
        var pageName = originalUrl;
        var template = pageName + '.html';

        http.get( 'http://cms.dbvw.workshopdesignstudio.org/wp-json/wp/v2/about/49', function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {


            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            console.log(parsed);

            res.render( 'contact.html', { 
                globals: globals,
                //options: options.acf,
                item: parsed
            } );
        });
    });


    };//return function

};
