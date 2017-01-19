/**
 * @fileoverview Defines a task to build the project and output production assets.
 */

'use strict';

var sequence = require('run-sequence');

module.exports = function (config, addDevSources) {
    /**
     * Performs a full build.
     *
     * @param {Function} cb Done callback.
     */
    return function (cb) {
        sequence(
            'clean',
            'lint',
            'test',
            [addDevSources ? 'build-dev-js' : 'build-js', 'build-css', 'build-deps'],
            ['build-html', 'copy-assets'],
            cb);
    };
};
