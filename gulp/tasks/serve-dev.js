/**
 * @fileoverview Defines a task to launch a development server.
 */

'use strict';

var path = require('path');
var readline = require('readline');
var chalk = require('chalk');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var addStream = require('add-stream');
var _ = require('lodash');
var conn = require('connect');
var serveStatic = require('serve-static');
var pipeline = require('connect-resource-pipeline');
var htmlAssets = require('../streams/html-assets.js');
var jsAssets = require('../streams/js-assets.js');
var cssAssets = require('../streams/css-assets.js');

module.exports = function (config) {
    /**
     * Launches the development server.
     *
     * The `src` directory is used as the document root, so html, images and other assets are accessible at their
     * expected URLs.
     *
     * The server will also dynamically concatenate javascript and less/css assets at request time, allowing
     * real-time updates without requiring a build or a server restart (or even a watch).
     *
     * Additionally, the contents of the `dev` directory will be _overlaid_ on top of the document root, allowing
     * specific paths to be masked with development versions, and any javascript assets in `dev` will be
     * concatenated onto the end of the main js file, allowing the app's behavior to be augmented or extended for
     * development purposes.
     */
    return function (done) {
        var html = htmlAssets(config);
        var js = jsAssets(config);
        var css = cssAssets(config);
        var sourcemapsEnabled = false;

        var assetPipeline = pipeline([
            {url: '/' + config.outputFiles.app.index, pipeline: function () {
                return html.getIndexFileStream();
            }},
            {url: '/' + config.outputFiles.app.js, cache: 'js', pipeline: function () {
                return js.getDevAssetStream()
                    .pipe(gulpIf(sourcemapsEnabled, sourcemaps.write()));
            }},
            {url: '/' + config.outputFiles.app.css, cache: 'css', pipeline: function () {
                return css.getAssetStream()
                    .pipe(gulpIf(sourcemapsEnabled, sourcemaps.write()));
            }},
            {url: '/' + config.outputFiles.deps.js, cache: 'deps-js', pipeline: function () {
                return js.getDepsAssetStream()
                    .pipe(addStream.obj(gulp.src(config.project.devDependencies)))
                    .pipe(gulpIf(sourcemapsEnabled, sourcemaps.init({loadMaps: true})))
                    .pipe(concat(config.outputFiles.deps.js))
                    .pipe(gulpIf(sourcemapsEnabled, sourcemaps.write()));
            }},
            {url: '/' + config.outputFiles.deps.css, cache: 'deps-css', pipeline: function () {
                return css.getDepsAssetStream()
                    .pipe(gulpIf(sourcemapsEnabled, sourcemaps.init({loadMaps: true})))
                    .pipe(concat(config.outputFiles.deps.js))
                    .pipe(gulpIf(sourcemapsEnabled, sourcemaps.write()));
            }}
        ]);

        function clearCache(key) {
            return function () {
                assetPipeline.clear(key);
            };
        }

        function clearAllCache() {
            assetPipeline.clear('js');
            assetPipeline.clear('css');
            assetPipeline.clear('deps-js');
            assetPipeline.clear('deps-css');
        }

        // Watch sources and clear caches when contents change.
        // Note: deps are not watched, so a change of deps requires a server restart.
        gulp.watch([
            path.join(config.paths.src, config.filePatterns.ts.src),
            path.join(config.paths.dev, config.filePatterns.ts.src),
            path.join(config.paths.src, config.filePatterns.html.all)
        ], clearCache('js'));
        gulp.watch(path.join(config.paths.src, config.filePatterns.less.all), clearCache('css'));

        var app = conn();
        app.use(assetPipeline);
        app.use(serveStatic(config.paths.src));
        app.use(serveStatic(config.paths.dev));

        _.each(config.project.urlMappings, function (dir, url) {
            app.use(url, serveStatic(dir));
        });

        app.listen(config.server.devPort);

        // Call back to gulp to finish the task.
        done();

        // Open a CLI interface for interactive configuration of the server.
        var cli = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        function writeln(line) {
            process.stdout.write(line + '\n');
        }

        writeln(chalk.bold.cyan('Interactive mode started'));
        cli.setPrompt('> ');
        cli.prompt();

        cli.on('line', function (cmd) {
            var words = cmd.split(' ');
            if (words[0].trim() === 'sourcemaps') {
                if (words[1] && words[1].trim() === 'on') {
                    sourcemapsEnabled = true;
                    clearAllCache();
                    writeln(chalk.cyan('Sourcemaps are now ') + chalk.bold.green('on'));
                }
                else if (words[1] && words[1].trim() === 'off') {
                    sourcemapsEnabled = false;
                    clearAllCache();
                    writeln(chalk.cyan('Sourcemaps are now ') + chalk.bold.red('off'));
                }
                else {
                    writeln(chalk.cyan('Sourcemaps are ') + (sourcemapsEnabled ? chalk.bold.green('on') : chalk.bold.red('off')));
                }
            }
            else if (words[0].trim() === 'cache' && words[1] && words[1].trim() === 'clear') {
                clearAllCache();
                writeln(chalk.cyan('Cache cleared'));
            }
            else if (cmd.trim()) {
                writeln(chalk.bold.red('Unknown command: ') + cmd);
            }
            cli.prompt();
        });
    };
};
