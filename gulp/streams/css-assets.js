/**
 * @fileoverview Creates streams of the project's css assets.
 */

'use strict';

var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var filter = require('gulp-filter');
var less = require('gulp-less');
var blibs = require('browser-libs');

module.exports = function (config) {
    return {
        /**
         * Creates a readable stream containing the app's css assets, compiled from less and optionally minified.
         *
         * @return {stream.Readable}
         */
        getAssetStream: function () {
            return gulp.src(path.join(config.paths.src, config.filePatterns.less.all))
                // Filter out ignored files (that are locally @imported)
                .pipe(filter(['**/*', '!' + config.filePatterns.less.excludes]))
                .pipe(sourcemaps.init())
                .pipe(less())
                .pipe(concat({path: config.outputFiles.app.css, cwd: ''}))
                .pipe(minifyCss())
                // Due to some circular bug-blame-passing, autoprefixer fouls up sourcemaps when placed immediately
                // after less. Using it after concat/uglify works around the issue.
                // https://github.com/less/less.js/issues/2413
                .pipe(autoprefixer());
        },

        /**
         * Creates a readable stream containing the app's dependencies.
         *
         * @returns {stream.Readable}
         */
        getDepsAssetStream: function () {
            return gulp.src(blibs.style(), {base: config.paths.deps});
        }
    };
};
