/**
 * @fileoverview Defines a task to launch a server using production assets.
 */

'use strict';

var connect = require('connect');
var serveStatic = require('serve-static');

module.exports = function (config) {
    /**
     * Launches a web server using the contents of `dist` as the document root.
     *
     * This is useful for testing production assets.
     */
    return function () {
        var app = connect();
        app.use(serveStatic(config.paths.dist));
        app.listen(config.server.port);
    };
};
