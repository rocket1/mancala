// Karma configuration
// Generated on Mon Oct 13 2014 21:43:18 GMT-0700 (PDT)

var path = require('path');
var blibs = require('browser-libs');
var typescript = require('gulp-typescript');
var rename = require('gulp-rename');
var ngTplCache = require('gulp-angular-templatecache');
var sourcemaps = require('gulp-sourcemaps');
var build = require('./gulpfile.js');

module.exports = function (config) {
    // Create a typescript project to take advantage of incremental compilation
    var tsProject = typescript.createProject(build.config.project.tscOptions);

    /* @type string[] Client-side libraries */
    var libraries = blibs();

    // gulpfile.js exports its configuration, which is leveraged here so file patterns don't have to be repeated (so
    // things won't break so easily if they change).
    //noinspection JSUnusedGlobalSymbols
    config.set({
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai-sinon', 'vinyl-streams', 'source-map-support'],

        // list of files / patterns to load in the browser
        files: libraries
            .concat(build.config.project.testDependencies)
            .concat([]
                .concat(build.config.filePatterns.ts.all)
                .concat(build.config.filePatterns.html.all)
                .map(function (pattern) {
                    return path.join(build.config.paths.src, pattern);
                }))
            .concat(path.join(build.config.paths.typings, build.config.filePatterns.ts.all)),

        // list of files to exclude
        exclude: [
            path.join(build.config.paths.src, build.config.outputFiles.app.index) // index.html
        ],

        autoWatchBatchDelay: 0,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        vinylStreams: function (src, dest) {
            src(build.config.filePatterns.ts.all)
                .pipe(sourcemaps.init())
                .pipe(typescript(tsProject)).js
                .pipe(sourcemaps.write({sourceRoot: __dirname}))
                .pipe(dest());

            src(build.config.filePatterns.html.all)
                .pipe(ngTplCache({
                    module: build.config.project.templateCacheModule,
                    standalone: true,
                    base: path.resolve(build.config.paths.src)}))
                .pipe(rename({extname: '.js'}))
                .pipe(dest());

            src.modified(libraries)
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(sourcemaps.write({sourceRoot: __dirname}))
                .pipe(dest());
        }
    });
};
