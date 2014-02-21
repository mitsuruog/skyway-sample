var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    watch: {
      options: {
        nospawn: true,
        livereload: true
      },
      site: {
        files: ['*.html', 'css/*.css', 'js/*.js']
      }
    },
    connect: {
      options: {
        port: 9001,
        hostname: 'localhost'
      },
      dev: {
        options: {
          middleware: function(connect) {
            return [
              require('connect-livereload')(),
              mountFolder(connect, '')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:9001'
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['connect', 'open', 'watch']);

};