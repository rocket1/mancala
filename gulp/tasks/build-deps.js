/**
 * @fileoverview Defines a task to build production dependency assets.
 */

'use strict';

var gulp = require('gulp');
var es = require('event-stream');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var sourcemaps = require('gulp-sourcemaps');
var jsAssets = require('../streams/js-assets');
var cssAssets = require('../streams/css-assets');

module.exports = function (config) {
    /**
     * Compiles all of the app's dependencies and writes them to `dist`.
     *
     * This will produce a single js file containing all concatenated scripts and a single css file containing all
     * concatenated stylesheets. Neither file is minified, as it is presumed that they are supplied in minified form.
     *
     * If there are any dependency files of types other than js or css, they'll be copied as-is to `dist`.
     *
     * @return {stream.Readable}
     */
    return function () {
        return es.merge(
            jsAssets(config).getDepsAssetStream()
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(concat(config.outputFiles.deps.js)),
            cssAssets(config).getDepsAssetStream()
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(concat(config.outputFiles.deps.css)))
            //.pipe(rev())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.paths.dist))
            .pipe(rev.manifest({path: config.outputFiles.deps.rev}))
            .pipe(gulp.dest(config.paths.rev));
    };
};
