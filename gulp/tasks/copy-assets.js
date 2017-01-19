/**
 * @fileoverview Defines a task to copy non-buildable assets for production use.
 */

'use strict';

var gulp = require('gulp');
var path = require('path');
var es = require('event-stream');
var filter = require('gulp-filter');
var _ = require('lodash');

module.exports = function (config) {
    /**
     * Copies assets not processed by the `build-*` tasks into `dist`.
     *
     * @return {stream.Readable}
     */
    return function () {
        var streams = [];
        streams.push(gulp.src(path.join(config.paths.src, '**/*'))
            .pipe(filter([
                '**/*.*', // *.* pattern excludes empty directories
                '!' + config.filePatterns.html.all,
                '!' + config.filePatterns.ts.all,
                '!' + config.filePatterns.ts.appWrapper,
                '!' + config.filePatterns.less.all
            ]))
            .pipe(gulp.dest(config.paths.dist)));
        _.forEach(config.project.urlMappings, function (srcPath, destPath) {
            streams.push(gulp.src(path.join(config.project.basedir, srcPath, '**/*'))
                .pipe(filter(config.project.urlMappingFilters[destPath] || '**/*'))
                .pipe(gulp.dest(path.join(config.paths.dist, destPath.replace(/^\//, '')))));
        });
        return es.merge.apply(es, streams);
    };
};
