'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    RootCategory = mongoose.model('RootCategory'),
    _ = require('lodash');







exports.create = function(req, res) {

    var rootCategory = new RootCategory(req.body);

    rootCategory.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(rootCategory);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.rootCategory);
};





exports.update = function(req, res) {

    var rootCategory = req.rootCategory;

    rootCategory = _.extend(user , req.body);

    rootCategory.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(rootCategory);
        }
    });
};





exports.delete = function(req, res) {

    var rootCategory = req.rootCategory;

    rootCategory.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(rootCategory);
        }
    });
};






exports.list = function(req, res) {

    RootCategory.find({languageOrigin: req.get('x-language-origin')}).sort('-created').exec(function(err, categories) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(categories);
        }
    });
};





exports.rootCategoryByID = function(req, res, next, id) {

    RootCategory.findById(id).exec(function(err, rootCategory) {

        if (err) return next(err);
        if (! rootCategory) return next(new Error('Failed to load RootCategory ' + id));
        req.rootCategory = rootCategory ;
        next();
    });
};




