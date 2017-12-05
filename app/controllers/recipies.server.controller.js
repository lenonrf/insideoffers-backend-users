'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Recipie = mongoose.model('Recipie'),
    _ = require('lodash');



exports.create = function(req, res) {

    var recipie = new Recipie(req.body);

    recipie.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(recipie);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.recipie);
};





exports.update = function(req, res) {

    var recipie = req.recipie;
    recipie = _.extend(recipie , req.body);

    recipie.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(recipie);
        }
    });
};





exports.delete = function(req, res) {

    var recipie = req.recipie;

    recipie.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(recipie);
        }
    });
};





exports.list = function(req, res) {

    var nameParam = req.param('name');

    if ( (typeof nameParam != 'undefined') && (nameParam != 0)) {

        Recipie.findOne({name: nameParam}).sort('-created').exec(function(err, recipies) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(recipies);
            }
        });
    
    }else{

        Recipie.find().sort('-created').exec(function(err, recipies) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(recipies);
            }
        }); 

    }
        




};




exports.recipieByID = function(req, res, next, id) {

    Recipie.findById(id).exec(function(err, recipie) {

        if (err) return next(err);
        if (! recipie) return next(new Error('Failed to load Recipie ' + id));
        req.recipie = recipie ;
        next();
    });
};



