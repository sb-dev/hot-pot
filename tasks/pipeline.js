/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files, and the ! prefix for excluding files.)
 */

// Path to public folder
var tmpPath = '.tmp/public/';

// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  'bower_components/angular-material/angular-material.css',
  'bower_components/angular-toastr/dist/angular-toastr.css',
  'bower_components/animate.css/animate.css',
  'bower_components/font-awesome/css/font-awesome.css',
  'bower_components/dropzone/dist/dropzone.css',
  'bower_components/croppie/croppie.css',
  'styles/**/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

  'bower_components/jquery/dist/jquery.min.js',
  'js/dependencies/semantic.min.js',
  'bower_components/angular/angular.js',
  'bower_components/angular-animate/angular-animate.js',
  'bower_components/angular-cookies/angular-cookies.js',
  'bower_components/angular-touch/angular-touch.js',
  'bower_components/angular-sanitize/angular-sanitize.js',
  'bower_components/angular-messages/angular-messages.js',
  'bower_components/angular-aria/angular-aria.js',
  'bower_components/lodash/lodash.js',
  'bower_components/restangular/dist/restangular.js',
  'bower_components/angular-ui-router/release/angular-ui-router.js',
  'bower_components/malarkey/dist/malarkey.min.js',
  'bower_components/angular-toastr/dist/angular-toastr.tpls.js',
  'bower_components/moment/moment.js',
  'bower_components/ngmap/build/scripts/ng-map.js',
  'bower_components/angular-input-stars/angular-input-stars.js',
  'bower_components/ng-covervid/ngCovervid.js',
  'bower_components/dropzone/dist/dropzone.js',
  'bower_components/ngSticky/dist/sticky.min.js',
  'bower_components/lodash/dist/lodash.min.js',
  'bower_components/angular-simple-logger/dist/angular-simple-logger.min.js',
  'bower_components/angular-google-maps/dist/angular-google-maps.js',
  'bower_components/momentjs/min/moment.min.js',
  'bower_components/momentjs/min/locales.min.js',
  'bower_components/humanize-duration/humanize-duration.js',
  'bower_components/angular-timer/dist/angular-timer.js',
  'bower_components/angular-svg-round-progressbar/build/roundProgress.js',
  'bower_components/angular-filter/dist/angular-filter.js',
  'bower_components/matchmedia/matchMedia.js',
  'bower_components/matchmedia-ng/matchmedia-ng.js',
  'bower_components/angular-local-storage/dist/angular-local-storage.js',
  'bower_components/ng-covervid/ngCovervid.js',
  'bower_components/braintree-web/dist/braintree.js',
  'bower_components/croppie/croppie.js',
  // Load sails.io before everything else
  'js/dependencies/sails.io.js',

  //Angular JS config
  'js/config/index.module.js',
  'js/config/index.run.js',
  'js/config/index.route.js',
  'js/config/index.restangular.js',
  'js/config/index.constants.js',
  'js/config/index.config.js',
  'js/config/index.auth.js',

  //Angularjs Components
  'angular_components/**/*.js',
  'app/**/*.js',

  // Dependencies like jQuery, or Angular are brought in here
  'js/dependencies/**/*.js',

  // All of the rest of your client-side js files
  // will be injected here in no particular order.
  'js/**/*.js',

  // Use the "exclude" operator to ignore files
  // '!js/ignore/these/files/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(transformPath);
module.exports.jsFilesToInject = jsFilesToInject.map(transformPath);
module.exports.templateFilesToInject = templateFilesToInject.map(transformPath);

// Transform paths relative to the "assets" folder to be relative to the public
// folder, preserving "exclude" operators.
function transformPath(path) {
  return (path.substring(0,1) == '!') ? ('!' + tmpPath + path.substring(1)) : (tmpPath + path);
}
