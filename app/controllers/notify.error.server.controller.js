'use strict';


/**
 * Module dependencies.
 */
var errorHandler = require('./errors'),
    request = require('request'),
    _ = require('lodash'),
    pmx = require('pmx');



exports.notify = function(message){

    pmx.notify(new Error(message));
    console.log(message);
    return;

};
