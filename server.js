'use strict';
/**
 * Module dependencies.
 */
 
var pmx = require('pmx').init();
 
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose');



/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */



var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('\x1b[31m', 'Could not connect to MongoDB!');
		console.log(err);
	}
});



	// Init the express application
	var app = require('./config/express')(db);

	// Bootstrap passport config
	require('./config/passport')();

	// Start the app by listening on <port>
	app.listen(config.port);

	// Expose app
	exports = module.exports = app;

	// Logging initialization
	console.log('CHECKOUT started on port ' + config.port);

