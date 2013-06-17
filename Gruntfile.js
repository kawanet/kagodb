/*! Gruntfile.js */

module.exports = function(grunt) {

  var pkg = require('./package.json');

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadTasks('./tasks');

  var jshint_src = [
      './*.js',
      './*.json',
      'lib/**/*.js',
      'tasks/**/*.js',
      'test/**/*.js',
      '!test/9-supplement/mongodb/*.js'
  ];

  // Project configuration.
  grunt.initConfig({

    // https://github.com/gruntjs/grunt-contrib-jshint
    jshint: {
      all: {
        src: jshint_src
      },
      options: {
        '-W103': true // The '__proto__' property is deprecated.
      }
    },

    // https://github.com/pghalliday/grunt-mocha-test
    mochaTest: {
      all: {
        src: ['test/**/*.test.js']
      },
      options: {
        reporter: 'spec'
      }
    },

    // https://github.com/krampstudio/grunt-jsdoc-plugin
    jsdoc: {
      all: {
        src: ['lib/**/*.js']
      },
      options: {
        destination: 'gh-pages/docs'
      }
    },

    // https://github.com/jmreidy/grunt-browserify
    browserify: {
      all: {
        files: {
          'public/js/kagodb.browserify.js': ['bundle/browser.js']
        },
        options: {
          standalone: 'KagoDB'
        }
      }
    },

    // https://github.com/gruntjs/grunt-contrib-uglify
    uglify: {
      all: {
        files: {
          'public/js/kagodb.min.js': ['public/js/kagodb.browserify.js']
        },
        options: {
          banner: '/*! ' + pkg.name + ' ' + pkg.version + ' */\n'
        }
      }
    },

    // https://github.com/gruntjs/grunt-contrib-watch
    watch: {
      all: {
        files: jshint_src,
        tasks: ['default'],
        options: {
          interrupt: true,
        }
      }
    },

    // tasks/quote-json.js
    quoteJson: {
      bower: {
        src: 'package.json',
        dest: 'bower.json',
        options: {
          fields: {
            name: 1,
            version: 1,
            homepage: 1,
            description: 1,
            repository: 1
          }
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'mochaTest']);
  grunt.registerTask('bundle', ['quoteJson', 'browserify', 'uglify']);
  grunt.registerTask('all', ['default', 'jsdoc', 'bundle']);
};
