'use strict';


/**
 * Module dependencies.
 */
var errorHandler = require('./errors'),
    request = require('request'),
    _ = require('lodash'),
    pmx = require('pmx');



var allin = require('./mailing.allin');
var splio = require('./mailing.splio');





exports.createContact = function(req, res){

    var user = req.body;
    allin.createContact(user);

    /*if(req.param('client') === 'premiosimperdiveis'){
        //splio.createContact(req, res);
    }else{
        //allin.createContact(user);
        //splio.createContact(req, res);
    }*/

};



exports.updateContact = function(req, res){

    var user = req.body;

    allin.createContact(user);
    //splio.updateContact(req, res);
};



exports.sendWelcomeMail = function(req, res){

    //splio.sendWelcomeMail(req, res);
};





