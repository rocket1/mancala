/**
 * @fileoverview Defines a task to build production js assets.
 */

'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var rev = require('gulp-rev');
var jsAssets = require('../streams/js-assets.js');

module.exports = function (config, addDevSources) {
    /**
     * Compiles all of the app's js into a single, minified asset in `dist`, which includes pre-cached templates.
     *
     * @return {stream.Readable}
     */
    return function () {
        return jsAssets(config)[addDevSources ? 'getDevAssetStream' : 'getAssetStream']()
           // .pipe(rev())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.paths.dist))
            .pipe(rev.manifest({path: config.outputFiles.app.rev.js}))
            .pipe(gulp.dest(config.paths.rev));
    };
};
