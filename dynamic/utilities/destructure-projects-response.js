"use strict";

var maybeRendered = require('../utilities/maybe-with-default.js')( { rendered: undefined } );
var maybeSourceUrl = require('../utilities/maybe-with-default.js')( { 'wp:featuredmedia': [ {source_url: undefined }]} );

module.exports = function ( r ) {

    try {

        console.log( r.acf );

        var x = {
            title: maybeRendered( r.title ).rendered,
            slug: r.slug,
            type: r.type,
            modified: r.modified,
            id: r.id,
            link: r.link,
            featured_media: maybeSourceUrl( r._embedded )['wp:featuredmedia'][0].source_url,
            content: maybeRendered( r.content ).rendered,
            description: {
                short: r.acf.description,
                long:  r.acf.description_long,
            },
            client: r.acf.client,
            timeline: r.acf.timeline,
            services: r.acf.services,
            gallery: r.acf.gallery
        };

        return x;

    } catch ( e ) {

        console.error( e.message );
        return {};

    }

};
