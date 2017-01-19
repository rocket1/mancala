/**
 * @fileoverview Standard build file for an AngularJS-based SPA.
 *
 * This file hosts configuration for all gulp tasks. The contents of the configuration should be limited to what would
 * normally be literals in the task definition (paths, urls, ports, etc.) and not anything behavior-related.
 *
 * Behavior should be implemented directly in tasks, not controlled via flags and settings. (Edit things! This is just
 * a template!) Tasks are defined in their own files in `gulp/tasks`.
 *
 * Configuration defined in this file is also exported to allow other node modules to import it (e.g., to share file
 * path defintions with `karma.conf.js`).
 */

'use strict';

var gulp = require('gulp');

/**
 * Build configuration.
 *
 * The values declared in this config object are used throughout the build, and exported so that they may be referenced
 * by other node modules (for example, Karma).
 */
var config = {
    /**
     * Information about the project.
     */
    project: {
        // The name of the top-level angular module. This shouldn't change.
        module: 'app',
        // The module that templates should be cached in.
        templateCacheModule: 'app.templates',
        basedir: __dirname,
        // Options for the TypeScript compiler.
        tscOptions: {
            target: 'ES5',
            sortOutput: true,
            // This is for gulp-typescript, it provides the version of the compiler to use.
            typescript: require('typescript')
        },
        // Extra dependencies (besides automatic ones) to be included by the development server.
        devDependencies: [
            'node_modules/angular-mocks/angular-mocks.js'
        ],
        // Extra dependencies (besides automatic ones) to be included by the test runner.
        testDependencies: [
            'node_modules/angular-mocks/angular-mocks.js',
            // Required for PhantomJS (https://github.com/ariya/phantomjs/issues/10522)
            'node_modules/polyfill-function-prototype-bind/bind.js'
        ],
        // Extra directories that will be mapped under the document root.
        // Keys are paths relative to docroot, values are paths relative to project root.
        urlMappings: {
            '/fonts': 'node_modules/bootstrap/dist/fonts'
        },
        // File filters for the above urlMappings. These will be used with gulp-filter.
        // Keys are paths relative to docroot, values are glob-style filters for files to include.
        urlMappingFilters: {
        }
    },
    /**
     * Server configuration.
     */
    server: {
        port: 9090,
        devPort: 9090
    },
    /**
     * Paths to important directories used by the build.
     *
     * All paths are relative to the root project directory, which is gulp's `cwd`. Do not include a './' prefix or a
     * trailing slash, as these paths are sometimes used as a component in `path.join()`.
     */
    paths: {
        // Main application source root. All asset types are mixed together in src, and are differentiated at build
        // time using the file patterns below.
        src: 'src',
        // Typing definitions (from DefinitelyTyped) for external libraries.
        typings: 'typings',
        // Dev-only source root. See dev task definition for details on how this is used.
        dev: 'dev',
        // Parent directory for build artifacts.
        build: 'build',
        // Target directory for built application.
        dist: 'build/dist',
        // Used during a build to store mappings of revisioned filenames.
        rev: 'build/rev',
        // Location of installed dependencies.
        deps: 'node_modules'
    },
    /**
     * Patterns for selecting files, typically used with `gulp.src()`.
     *
     * All patterns should exclude any preceding slash, as they'll usually be combined with one of the paths above.
     */
    filePatterns: {
        html: {
            // Includes the main index file and all Angular templates.
            all: '**/*.html'
        },
        ts: {
            all: '**/*.ts',
            src: '**/!(*-spec).ts',
            // This file will be used to wrap concatenated javascript at build time.
            appWrapper: 'app-wrapper.txt'
        },
        css: {
            all: '**/*.css'
        },
        less: {
            all: '**/*.less',
            // Excludes are files that are manually @imported from other less files.
            excludes: '**/less-imports/**/*.less'
        },
        rev: {
            all: '**/*.json'
        }
    },
    /**
     * Destination filenames for assets created during a build.
     */
    outputFiles: {
        app: {
            index: 'index.html',
            js: 'app.js',
            css: 'app.css',
            rev: {
                js: 'app-js-manifest.json',
                css: 'app-css-manifest.json'
            }
        },
        deps: {
            js: 'deps.js',
            css: 'deps.css',
            rev: 'deps-manifest.json'
        }
    }
};

gulp.task('default', ['build']);
gulp.task('build', requireTask('build'));
gulp.task('build-dev', requireTask('build', true));
gulp.task('build-css', requireTask('build-css'));
gulp.task('build-deps', requireTask('build-deps'));
gulp.task('build-html', requireTask('build-html'));
gulp.task('build-js', requireTask('build-js'));
gulp.task('build-dev-js', requireTask('build-js', true));
gulp.task('clean', requireTask('clean'));
gulp.task('copy-assets', requireTask('copy-assets'));
gulp.task('lint', requireTask('lint'));
gulp.task('serve', requireTask('serve'));
gulp.task('serve-dev', requireTask('serve-dev'));
gulp.task('test', requireTask('test'));

function requireTask(name) {
    var extraArgs = Array.prototype.slice.call(arguments, 1);
    return require('./gulp/tasks/' + name + '.js').apply(null, [config].concat(extraArgs));
}

module.exports = {
    config: config
};
