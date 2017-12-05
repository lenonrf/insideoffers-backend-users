'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Survey = mongoose.model('Survey'),
    _ = require('lodash'),
    Segmentation = require('./segmentation');



exports.create = function(req, res) {

    var survey = new Survey(req.body);

    console.log('survey', survey);

    survey.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(survey);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.survey);
};





exports.update = function(req, res) {

    var survey = req.survey;

    survey = _.extend(survey , req.body);

    survey.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(survey);
        }
    });
};





exports.delete = function(req, res) {

    var survey = req.survey;

    survey.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(survey);
        }
    });
};






exports.list = function(req, res) {

    var filterCategory = req.param('category');


    if ( (typeof filterCategory != 'undefined') && (filterCategory != 0)) {
        exports.filterByCategory(req, res, filterCategory);

    }else{

        Survey.find({languageOrigin: req.get('x-language-origin')}).sort('-created')
            .populate('segmentation').exec(function(err, surveys) {

                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err.message)
                    });
                } else {
                    res.jsonp(surveys);
                }
            });
    }

};




exports.surveyByID = function(req, res, next, id) {

    Survey.findById(id).populate('segmentation').exec(function(err, survey) {

        if (err) return next(err);
        if (! survey) return next(new Error('Failed to load Survey ' + id));
        req.survey = survey ;
        next();
    });
};




exports.listByUserSegmentation = function(req, res){

    var user = req.user;
    var sessionLandingId =  req.param('sessionlanding');
    var deviceAccess = req.param('deviceAccess');

    Survey.find({
        $and : [
            {status:true},
            {languageOrigin: req.get('x-language-origin')}
        ]}).sort('-created')
        .populate('segmentation').exec(function(err, coregs) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err.message)
                });
            } else {
                res.jsonp(
                    Segmentation.getDomainBySegmentation(user, sessionLandingId, deviceAccess, coregs));
            }
        });
};




