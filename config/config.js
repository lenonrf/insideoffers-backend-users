'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	glob = require('glob');

/**
 * Load app configurations
 */
module.exports = _.extend(
	require('./env/all'),
	require('./env/' + process.env.NODE_ENV) || {}
);

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
	// For context switching
	var _this = this;

	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	// The output array
	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
	if (_.isArray(globPatterns)) {

		//console.log('$$$$$ globPatterns', globPatterns);

		globPatterns.forEach(function(globPattern) {
			output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
		});

	} else if (_.isString(globPatterns)) {


		//console.log('#### globPatterns', globPatterns);


		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		
		} else {
			
			var files = glob(globPatterns, {sync: true});
			
			if (removeRoot) {
                        	files = files.map(function(file) {
                                	return file.replace(removeRoot, '');
                                });
                      	}

                        output = _.union(output, files);
		}
	}

	//console.log('#### OUTPUT', output);

	return output;
};

/**
 * Get the modules JavaScript files
 */
module.exports.getJavaScriptAssets = function(includeTests) {

	// console.log('#### this.assets.js', this.assets.js);


	var output = this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), 'public/');

	//console.log('#### this.assets.lib.js', this.assets.lib.js);
	//console.log('#### ');
	//console.log('#### output', output);

	// To include tests
	if (includeTests) {
		output = _.union(output, this.getGlobbedFiles(this.assets.tests));
	}

	return output;
};




/**
 * Get the modules CSS files
 */
module.exports.getCSSAssets = function() {
	var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');
	return output;
};
