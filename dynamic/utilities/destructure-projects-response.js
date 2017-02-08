"use strict";

var maybeRendered = require('../utilities/maybe-with-default.js')( { rendered: undefined } ); //use the maybe pattern to check if something is defined
var maybeSourceUrl = require('../utilities/maybe-with-default.js')( { 'wp:featuredmedia': [ {media_details: { sizes: undefined } }]} );
var maybeCategories = require('../utilities/maybe-with-default.js')( {'wp:term':[] });
var getCategories = require('../utilities/get-categories.js')();

module.exports = function ( r ) {

    try {

        var x = {
            title: maybeRendered( r.title ).rendered, //if r has a field called title, we can use it
            slug: r.slug,
            type: r.type,
            modified: r.modified,
            id: r.id,
            link: r.link,
            categories: getCategories( maybeCategories(r._embedded)['wp:term'][0] ),
            featured_media: maybeSourceUrl( r._embedded )['wp:featuredmedia'][0].media_details.sizes,
            featured_image: maybeSourceUrl( r._embedded )['wp:featuredmedia'][0].media_details,
            content: maybeRendered( r.content ).rendered,
            short_description: r.acf.short_description,
            long_description:  r.acf.long_description,
            client: r.acf.client,
            location: r.acf.location,
            timeline: r.acf.timeline,
            services: r.acf.services,
            slideshow: r.acf.slideshow,
            stories: r.acf.stories
        };

        return x;

    } catch ( e ) {

        console.error( (new Date()).toISOString() );
        console.error( e.message );
        console.error( e.stack );
        return {};

    }

};
