'use strict';

/**
 * Module dependencies.
 */
var glob = require('glob');

/**
 * Module init function.
 */
module.exports = function() {
	 
	var environmentFiles = 
		glob('./config/env/' + process.env.NODE_ENV + '.js', {sync: true});


	if (!environmentFiles.length) {
		
 		console.error( 'No configuration file found, using development');
		process.env.NODE_ENV = 'development';
	
	}

	/**
	 * Add our server node extensions
	 */
	require.extensions['.server.controller.js'] = require.extensions['.js'];
	require.extensions['.server.model.js'] = require.extensions['.js'];
	require.extensions['.server.routes.js'] = require.extensions['.js'];
};
