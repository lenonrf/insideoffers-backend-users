'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    SessionLanding = mongoose.model('SessionLanding'),
    _ = require('lodash');



exports.create = function(req, res) {

    var sessionLanding = new SessionLanding(req.body);

    sessionLanding.save(function(err) {
        if (err) {

            console.log('err', err);

            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(sessionLanding);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.sessionLanding);
};





exports.update = function(req, res) {

    var sessionLanding = req.sessionLanding;

    sessionLanding = _.extend(sessionLanding , req.body);

    sessionLanding.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(sessionLanding);
        }
    });
};





exports.delete = function(req, res) {

    var sessionLanding = req.sessionLanding;

    sessionLanding.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(sessionLanding);
        }
    });
};






exports.list = function(req, res) {

    var code = req.param('code');

    if ( (typeof code != 'undefined') && (code != 0)) {
        exports.filterByCode(req, res, code);

    }else{

        SessionLanding.find({languageOrigin: req.get('x-language-origin')}).sort('-created')
            .populate('category', 'name').exec(function(err, sessionLandings) {

                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err.message)
                    });
                } else {
                    res.jsonp(sessionLandings);
                }
            });
    }

};

exports.filterByCode = function(req, res, code) {


    SessionLanding.findOne({
        $and:[
            {code: code},
            {languageOrigin: req.get('x-language-origin')}
        ]}
    ).sort('-created')
        .exec(function (err, sessionLandings) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                    res.jsonp(sessionLandings);
            }
        });
}





exports.sessionLandingByID = function(req, res, next, id) {

    SessionLanding.findById(id).exec(function(err, sessionLanding) {

        if (err) return next(err);
        if (! sessionLanding) return next(new Error('Failed to load SessionLanding ' + id));
        req.sessionLanding = sessionLanding ;
        next();
    });
};




