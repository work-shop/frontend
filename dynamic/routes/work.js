"use strict";


var route404 = require('./404.js');
var compose = require('../utilities/compose.js'); //helper to compose functions *magic
var destructure = require('../utilities/destructure-projects-response.js'); //destructure the response
var checkCategorySlug = require('../utilities/check-category-slug.js')(); //check if the category is valid

module.exports = function( wp, config, globals ) {

    var urlReplace = require('../utilities/resource-map.js')( config );

    return function( req, res ) {

        wp.projects().perPage(100).param('_embed', true).then( function( data ) {

            wp.namespace( 'acf/v2' ).options().then( function( dataOptions ) {

                wp.project_categories().perPage(15).then( function( project_categories ) {

                    project_categories.push({
                        name: 'Work',
                        description: dataOptions.acf.work_statement,
                        slug: 'all'
                    });

                    function serveWork( category ){
                        res.render( 'work.html', {
                            globals: globals,
                            options: dataOptions.acf,
                            projects: data.map( compose( destructure, urlReplace ) ),
                            project_categories: project_categories,
                            routeCategory: category,

                            featured_image: function( project, size ) {
                                if ( typeof project.featured_media !== "undefined" && typeof project.featured_media[ size ] !== "undefined" ) {
                                    return project.featured_media[ size ].source_url;
                                }
                            },

                            project_featured_category: function( project, categories ) {
                                var match = false;
                                var classes, supplementalImage;
                                //loop through the featured categories, checking to see if the current project(passed into this function) matches with any of them
                                //there may be more than one match, so we need to concatenate classes onto a string that is written onto the project
                                for (var i = 0; i < categories.length; i++) {
                                    if ( project.id === categories[i].featured_project.ID ){
                                        if( match === false){
                                            match = true;
                                            classes = 'featured ';
                                        }
                                        classes += 'featured-' + categories[i].category.slug + ' ';
                                        supplementalImage = categories[i].supplemental_featured_image.sizes.category;
                                    }

                                }
                                if( match ){
                                    return {
                                        classes: classes,
                                        supplemental_image: supplementalImage
                                    };
                                } else {
                                    return {
                                        classes: "",
                                        supplementalImage: ""
                                    };
                                }
                            }
                        });
                    }

                    if( typeof(req.params.category) === 'undefined' ){

                        serveWork();

                    } else{
                        var category = req.params.category;

                        if( checkCategorySlug(category, project_categories) ){
                            serveWork( category );
                        } else{
                            route404()(req, res);
                        }

                    }

                }).catch( function( err ) {

                    globals.log.error( err, 'work' );
                    res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in project_categories(): " + err.message });

                });//3rd request

            }).catch( function( err ) {

                globals.log.error( err, 'work'  );
                res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in options(): " + err.message });

            });//2nd request

        }).catch( function( err ) {

            globals.log.error( err, 'work'  );
            res.render( '404.html', { error_code: 500, message: "Backend server returned an error response in projects(): " + err.message });

        });//1st request

    };
};
