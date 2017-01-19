/**
 * @fileoverview Creates streams of the project's js assets.
 */

'use strict';

var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var addStream = require('add-stream');
var wrap = require('gulp-wrap-js');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngTplCache = require('gulp-angular-templatecache');
var blibs = require('browser-libs');
var htmlAssets = require('./html-assets');

module.exports = function (config) {
    //noinspection JSUnresolvedFunction
    var appWrapper = fs.readFileSync(path.join(config.paths.src, config.filePatterns.ts.appWrapper)).toString();

    /**
     * Main application source bundle builder, used by both getAssetStream and getDevAssetStream.
     *
     * @return {stream.Readable}
     */
    function processSrc(sourceDirs, includeDevTemplates, options) {
        options = options || {};

        // `base` is used to locate the concat destination file in the correct base dir for
        // sourcemaps to resolve properly.
        var base = options.base || config.paths.src;
        var sources = sourceDirs.map(function (dir) {
            return path.join(dir, config.filePatterns.ts.src);
        });

        return gulp.src(sources)
            .pipe(sourcemaps.init())
            .pipe(ts(config.project.tscOptions)).js
            .pipe(ngAnnotate({gulpWarnings: false}))
            // Append the html assets (transformed into js) after the js assets
            .pipe(addStream.obj(htmlAssets(config).getTemplateAssetStream(includeDevTemplates)
                .pipe(ngTplCache({module: config.project.templateCacheModule, standalone: true}))
                .pipe(sourcemaps.init())))
            .pipe(concat({path: path.join(base, config.outputFiles.app.js), base: base, cwd: ''}))
            .pipe(wrap(appWrapper));
            //.pipe(uglify());
    }

    return {
        /**
         * Creates a readable stream containing the app's js assets, optionally minified.
         *
         * Included in the stream are the app's templates, compiled and loaded into angular's template cache.
         *
         * @return {stream.Readable}
         */
        getAssetStream: function () {
            return processSrc([config.paths.src, config.paths.typings], false);
        },

        /**
         * Adds js assets from the dev source root to the main app's js assets.
         *
         * Dev assets are appended to the main assets, allowing them to piggyback on the main app and override/extend
         * stuff easily.
         *
         * @return {stream.Readable}
         */
        getDevAssetStream: function () {
            return processSrc([config.paths.src, config.paths.dev, config.paths.typings], true, {base: '.'});
        },

        /**
         * Creates a readable stream containing the app's dependencies.
         *
         * @returns {stream.Readable}
         */
        getDepsAssetStream: function () {
            return gulp.src(blibs(), {base: config.paths.deps});
        }
    };
};
