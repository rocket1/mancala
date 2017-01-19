/**
 * @fileoverview Defines a task to run the test suite.
 */

'use strict';

var ARGV = require('yargs').argv;
var path = require('path');
var karma = require('karma').server;

module.exports = function (config) {
    /**
     * Runs the unit test suite.
     *
     * @param {Function} done Done callback.
     */
    return function (done) {
        if (ARGV.skipTests) {
            done();
            return;
        }
        karma.start({
            configFile: path.join(config.project.basedir, 'karma.conf.js'),
            singleRun: true
        }, done);
    };
};
