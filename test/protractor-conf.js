exports.config = {

	allScriptsTimeout: 11000,

	capabilities: {
		'browserName': 'chrome',
		'chromeOptions': {
			'args': ['verbose']
		}
	},

	baseUrl: 'http://localhost:8080',

	framework: 'jasmine',

	suites: {
		'inventory': 'e2e/inventory/inventory-spec.js'
	},

	jasmineNodeOpts: {
		/**
		 * onComplete will be called just before the driver quits.
		 */
		onComplete: function () {
			console.log('Diva e2e tests complete.');
		},
		// If true, display spec names.
		isVerbose: true,
		// If true, print colors to the terminal.
		showColors: true,
		// If true, include stack traces in failures.
		includeStackTrace: true,
		// Default time to wait in ms before a test fails.

		defaultTimeoutInterval: 30000
	},

	directConnect: true
};
