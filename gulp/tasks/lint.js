/**
 * @fileoverview Defines a task to lint TypeScript sources.
 */

'use strict';

var gulp = require('gulp');
var path = require('path');
var tslint = require('gulp-tslint');

module.exports = function (config) {
    /**
     * Lints all TypeScript in `src`, including tests.
     *
     * @return {stream.Readable}
     */
    return function () {
        return gulp.src(path.join(config.paths.src, config.filePatterns.ts.all))
            .pipe(tslint())
            .pipe(tslint.report('prose'));
    };
};
