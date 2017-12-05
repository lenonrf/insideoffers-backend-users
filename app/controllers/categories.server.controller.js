'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Category = mongoose.model('Category'),
    _ = require('lodash');




exports.create = function(req, res) {

    var category = new Category(req.body);

    category.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(category);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.category);
};





exports.update = function(req, res) {

    var category = req.category;

    category = _.extend(user , req.body);

    category.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(category);
        }
    });
};





exports.delete = function(req, res) {

    var category = req.category;

    category.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(category);
        }
    });
};






exports.list = function(req, res) {

    Category.find({languageOrigin: req.get('x-language-origin')}).sort('-created').exec(function(err, categories) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(categories);
        }
    });
};





exports.categoryByID = function(req, res, next, id) {

    Category.findById(id).exec(function(err, category) {

        if (err) return next(err);
        if (! category) return next(new Error('Failed to load Category ' + id));
        req.category = category ;
        next();
    });
};




