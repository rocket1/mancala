/**
 * @fileoverview Defines a task to build production css assets.
 */

'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var rev = require('gulp-rev');
var cssAssets = require('../streams/css-assets.js');

module.exports = function (config) {
    /**
     * Compiles all of the app's less files into a single, minified css asset in `dist`.
     *
     * @return {stream.Readable}
     */
    return function () {
        return cssAssets(config).getAssetStream()
            //.pipe(rev())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.paths.dist))
            .pipe(rev.manifest({path: config.outputFiles.app.rev.css}))
            .pipe(gulp.dest(config.paths.rev));
    };
};
