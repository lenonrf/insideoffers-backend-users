'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Oportunity = mongoose.model('Oportunity'),
    _ = require('lodash'),
    Segmentation = require('./segmentation');



exports.listByUserSegmentation = function(req, res){

    var user = req.user;
    var sessionLandingId =  req.param('sessionlanding');
    var deviceAccess = req.param('deviceAccess');


    Oportunity.find(
        {
            $and:[
                {status:true},
                {languageOrigin: req.get('x-language-origin')}
            ]
        }).sort('index')
        .populate('categories', 'name')
        .populate('segmentation').exec(function(err, oportunities) {

            if(err) {
                return res.status(400).send({message: errorHandler.getErrorMessage(err.message)});
            } else {

                res.jsonp(
                    Segmentation.getDomainBySegmentation(user, sessionLandingId, deviceAccess, oportunities));

            }
        });
};









exports.create = function(req, res) {

    var oportunity = new Oportunity(req.body);

    oportunity.save(function(err) {
        if (err) {

            console.log('err', err);

            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(oportunity);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.oportunity);
};





exports.update = function(req, res) {

    var oportunity = req.oportunity;

    oportunity = _.extend(oportunity , req.body);

    oportunity.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(oportunity);
        }
    });
};





exports.delete = function(req, res) {

    var oportunity = req.oportunity;

    oportunity.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(oportunity);
        }
    });
};





exports.list = function(req, res) {

    var filterStatus = req.param('status');

    if ( (typeof filterStatus != 'undefined') && (filterStatus != 0)) {
        exports.filterByStatus(req, res, filterStatus);

    }else{

        Oportunity.find({languageOrigin: req.get('x-language-origin')}).sort('index')
            .populate('categories', 'name')
            .populate('segmentation').exec(function(err, oportunities) {

                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err.message)
                    });
                } else {
                    res.jsonp(oportunities);
                }
            });
    }

};





exports.filterByStatus = function(req, res, filterStatus) {


    Oportunity.find({

        $and:[
            {status:filterStatus},
            {languageOrigin: req.get('x-language-origin')}

        ]}).sort('index')
        .populate('category', 'name')
        .populate('segmentation').exec(function (err, oportunities) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(oportunities);
            }
        });
}





exports.oportunityByID = function(req, res, next, id) {

    Oportunity.findById(id).populate('segmentation').exec(function(err, oportunity) {

        if (err) return next(err);
        if (! oportunity) return next(new Error('Failed to load Product ' + id));
        req.oportunity = oportunity ;
        next();
    });
};




