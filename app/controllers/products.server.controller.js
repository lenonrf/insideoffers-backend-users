'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Product = mongoose.model('Product'),
    _ = require('lodash');



exports.create = function(req, res) {

    var product = new Product(req.body);

    product.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(product);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.product);
};





exports.update = function(req, res) {

    var product = req.product;

    product = _.extend(product , req.body);

    product.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(product);
        }
    });
};





exports.delete = function(req, res) {

    var product = req.product;

    product.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(product);
        }
    });
};






exports.list = function(req, res) {

    var filterCategory = req.param('category');


    if ( (typeof filterCategory != 'undefined') && (filterCategory != 0)) {
        exports.filterByCategory(req, res, filterCategory);

    }else{

        Product.find({languageOrigin: req.get('x-language-origin')}).sort('-created')
            .populate('category', 'name').exec(function(err, products) {

                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err.message)
                    });
                } else {
                    res.jsonp(products);
                }
            });
    }

};

exports.filterByCategory = function(req, res, filterCategory) {


    Product.find({
        $and: [
            {languageOrigin: req.get('x-language-origin')},
            {category:filterCategory}
        ]
    }).sort('-created')
        .populate('category', 'name').exec(function (err, products) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                    res.jsonp(products);
            }
        });
}





exports.productByID = function(req, res, next, id) {

    Product.findById(id).exec(function(err, product) {

        if (err) return next(err);
        if (! product) return next(new Error('Failed to load Product ' + id));
        req.product = product ;
        next();
    });
};




