/*! Gruntfile.js */

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Project configuration.
    grunt.initConfig({

        // https://github.com/gruntjs/grunt-contrib-jshint
        jshint: {
            all: ['Gruntfile.js', '*.js', 'lib/*.js', 'core/*.js', 'test/*.js'],
            options: {
                // http://www.jshint.com/docs/
                // eqnull: true,
                // proto: true
            }
        },

        // https://github.com/pghalliday/grunt-mocha-test
        mochaTest: {
            files: ['test/*.test.js'],
            options: {
                reporter: 'spec'
            }
        },

        // https://github.com/krampstudio/grunt-jsdoc-plugin
        jsdoc: {
            dist: {
                src: ['core/*.js', 'storage/*.js'],
                options: {
                    destination: 'gh-pages/docs'
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['jshint', 'mochaTest', 'jsdoc']);
};