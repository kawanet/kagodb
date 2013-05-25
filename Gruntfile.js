// Gruntfile.js

module.exports = function(grunt) {

    // Add our custom tasks.
    grunt.loadNpmTasks('grunt-mocha-test');

    // Project configuration.
    grunt.initConfig({
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
    grunt.registerTask('default', 'mochaTest');
};
