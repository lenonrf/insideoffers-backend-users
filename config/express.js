'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	compress = require('compression'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	helmet = require('helmet'),
	passport = require('passport'),
	mongoStore = require('connect-mongo')({
		session: session
	}),
	flash = require('connect-flash'),
	config = require('./config'),
	consolidate = require('consolidate'),
	path = require('path'),
    

    cachingMiddleware = require('express-view-cache'),
    

    memjs = require('memjs'),
    pmx = require('pmx'),
    interceptor = require('express-interceptor');


  var cache = require('express-redis-cache')();

  var cors = require('express-cors');

module.exports = function(db) {
	
	// Initialize express app
	var app = express();


	// Globbing model files
	config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	app.locals.keywords = config.app.keywords;
	app.locals.jsFiles = config.getJavaScriptAssets();
	app.locals.cssFiles = config.getCSSAssets();

	/*
	 *  -------------------------------------------------------------------------------------------
	 * CORS on ExpressJS
	 */
	app.use(function(req, res, next) {
		res.header('x-origin', '*');
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', '*');
		res.header('Access-Control-Allow-Headers', 'Authorization');
		next();
	});


	app.use(cors({
	    allowedOrigins: [
			'admin.me-gusta.com.mx','www.admin.me-gusta.com.mx',
			'me-gusta.com.mx:8080','www.me-gusta.com.mx',
			'megusta.com.es:8080','www.megusta.com.es',
	        'gostei.club:8080','www.gostei.club', 'admin.gostei.club','www.admin.gostei.club',
			'opportunites.club:8080','www.opportunites.club', 'admin.opportunites.club','www.admin.opportunites.club',
			'localhost:3012', 'localhost:3010', 'localhost:9000',
			'http://gostei.checkout:3009', 'http://gostei.admin:9000', 'http://gostei.admin',

			'http://webservice.regiepub.com', '45.55.49.189',
			'http://ybrain.the-ybox.com:3009',

			'http://www.premiosimperdiveis.com.br',
			'http://premiosimperdiveis.com.br', '192.185.223.173',
			'http://api.hasoffers.com'
	    ],
		headers : ['Authorization', 'Content-Type', 'X-Requested-With', 'x-language-origin']
	}));

	// Passing the request url to environment locals
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});





	// Showing stack errors
	app.set('showStackError', true);

	// Set swig as the template engine
	app.engine('server.view.html', consolidate[config.templateEngine]);

	// Set views path and view engine
	app.set('view engine', 'server.view.html');
	app.set('views', './app/views');

	// Environment dependent middleware
	app.locals.cache = 'memory';


	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// Enable jsonp
	app.enable('jsonp callback');

	// CookieParser should be above session
	app.use(cookieParser());

	// Express MongoDB session storage

	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: new mongoStore({
			mongooseConnection: db.connection,
			collection: config.sessionCollection
		})
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// connect flash for flash messages
	app.use(flash());

	// Use helmet to secure Express headers
	app.use(helmet.xssFilter());
	app.disable('x-powered-by');






	/*
	 *  -------------------------------------------------------------------------------------------
	 * Configurações de Cache
	 */

	var fiveMinutes = 300000;
	var twentyMunites = 1200000;

	// New call to compress content
	app.use(compress());

	//app.use('/products', cachingMiddleware(twentyMunites, {'type':'application/json', 'driver':'memjs'}));


	// Setting the app router and static folder
	app.use(express.static(path.resolve('./public'), {maxAge: fiveMinutes}));

	// ---------------------------------------------------------------------------------------------





    /**
     * ------------------------------------------------------------
     * INTECEPTORS
     
    app.use(

        interceptor(function(req, res){

            return {

                isInterceptable : function(){
                    return true;
                },

                intercept : function(body, send){

                    if (!req.get('x-language-origin')) {
						if(!req.body.languageOrigin){
							if(!req.param('languageOrigin')){
								return res.status(400).send({
									message: 'Origin Language not exist'
								});
							}
						}
                    }

                   send(body);
                }

            };
        }));*/





	// Globbing routing files
	config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
		require(path.resolve(routePath))(app);
	});

	// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(500).render('500', {
			error: err.stack
		});
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).render('404', {
			url: req.originalUrl,
			error: 'Not Found'
		});
	});


	app.use(pmx.expressErrorHandler());





	return app;
}
;
