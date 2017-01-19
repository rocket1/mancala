/**
 * @fileoverview Creates streams of the project's html assets.
 */

'use strict';

var gulp = require('gulp');
var path = require('path');
var es = require('event-stream');
var addStream = require('add-stream');
var File = require('vinyl');
var gif = require('gulp-if');
var filter = require('gulp-filter');
var inject = require('gulp-inject');

/**
 * Transforms a list of file names into a readable stream of vinyl File objects.
 *
 * @return {stream.Readable}
 */
function fileRefs(/* ...files */) {
    var files = Array.prototype.slice.call(arguments);
    return es.readArray(files.map(function (filePath) {
        return new File({path: filePath});
    }));
}

module.exports = function (config) {
    return {
        /**
         * Creates a readable stream containing the app's index html with asset paths already injected.
         *
         * @return {stream.Readable}
         */
        getIndexFileStream: function () {
            return gulp.src(path.join(config.paths.src, config.outputFiles.app.index))
                // Inject app file references
                .pipe(inject(fileRefs(config.outputFiles.app.js, config.outputFiles.app.css),
                    {addRootSlash: false, quiet: true}))
                // Inject deps file references
                .pipe(inject(fileRefs(config.outputFiles.deps.js, config.outputFiles.deps.css),
                    {name: 'deps', addRootSlash: false, quiet: true}));
        },

        /**
         * Creates a readable stream containing the app's Angular template files.
         *
         * @returns {stream.Readable}
         */
        getTemplateAssetStream: function (includeDev) {
            return gulp.src(path.join(config.paths.src, config.filePatterns.html.all))
                .pipe(gif(includeDev, addStream.obj(gulp.src(path.join(config.paths.dev, config.filePatterns.html.all)))))
                .pipe(filter(['**/*', '!' + config.outputFiles.app.index]));
        }
    };
};
