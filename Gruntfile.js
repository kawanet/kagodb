/*! Gruntfile.js */

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');

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

        mochaTest: {
            files: ['test/*.test.js']
        },

        mochaTestConfig: {
            options: {
                reporter: 'spec'
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['jshint', 'mochaTest']);
};