/**
 * @fileoverview Defines a task to delete build artifacts.
 */

'use strict';

var del = require('del');

module.exports = function (config) {
    /**
     * Deletes all build output directories.
     *
     * @param {Function} cb Done callback.
     */
    return function (cb) {
        del(config.paths.build, cb);
    };
};
