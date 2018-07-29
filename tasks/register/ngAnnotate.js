// tasks/config/handlebars.js
// --------------------------------
// handlebar task configuration.

module.exports = function(grunt) {

  // We use the grunt.config api's set method to configure an
  // object to the defined string. In this case the task
  // 'handlebars' will be configured based on the object below.
  grunt.config.set('ngAnnotate', {
    options: {
        singleQuotes: true,
    },
    app: {
      files: [
          {
             expand: true,
              src: ['assets/app/**/*.js','!**/*.annotated.js'],
              ext: '.annotated.js', // Dest filepaths will have this extension.
              extDot: 'last',
          },
      ],
    }
  });

  // load npm module for handlebars.
  grunt.loadNpmTasks('grunt-ng-annotate');
};
