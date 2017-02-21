"use strict";

var baseStructure = require('./base-structure.js');
var log = require('../logging/index.js')();

module.exports = function ( thought, options ) {



    try {

        return baseStructure({

            title: {
                short: thought.title.rendered,
                long: thought.acf.longname
            },
            slug: thought.slug,
            link: thought.link,
            hero: determineHeroStructure( thought.acf ),
            color: thought.acf.color,
            summary: thought.acf.summary,
            metadata: thought.acf.metadata,
            overview: thought.acf.overview,
            sections: restructureSections( thought.acf.sections )

        }, options);

    } catch ( err ) {

        log.error( err, 'restructure-thought');

        return {};

    }

};

function restructureSections( sections ) {
    return sections;
}

function determineHeroStructure( acf ) {
    if ( acf.hero_type === "image" ) {

        return {
            type: "image",
            image: acf.hero_image
        };

    } else if ( acf.hero_type === "gallery" ) {

        return {
            type: "gallery",
            image: acf.hero_images
        };

    } else if ( acf.hero_type === "video" ) {

        return {
            type: "video",
            image: acf.hero_video
        };

    } else {

        throw new Error('determineHeroStructure: Encountered an unrecognized hero type: \'' + acf.hero_type + '\'');

    }
}
