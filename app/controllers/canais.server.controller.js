'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Canal = mongoose.model('Canal'),
    SponsoringItem = mongoose.model('SponsoringItem'),
    _ = require('lodash');



exports.create = function(req, res) {

    var canal = new Canal(req.body);

    canal.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(canal);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.canal);
};





exports.update = function(req, res) {

    var canal = req.canal;
    canal = _.extend(canal , req.body);

    canal.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(canal);
        }
    });
};





exports.delete = function(req, res) {

    var canal = req.canal;

    canal.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(canal);
        }
    });
};




/*

exports.list = function(req, res) {

    Canal.find().sort('-created').exec(function(err, categories) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(categories);
        }
    });
};*/




exports.list = function(req, res) {

    if ((typeof req.param('code') != 'undefined') && (req.param('code') != 0)) {
        return exports.listByCode(req, res, req.param('code'));
    }

    Canal.find({languageOrigin: req.get('x-language-origin')}).sort('-created').exec(function(err, categories) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(categories);
        }
    });
};





exports.listByCode = function(req, res, codeParam) {

    Canal.find({
        $and: [
            {code:codeParam},
            {languageOrigin: req.get('x-language-origin')}
        ]}
        ).sort('-created').exec(function(err, categories) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(categories);
        }
    });
};





exports.canalByID = function(req, res, next, id) {

    Canal.findById(id).exec(function(err, canal) {

        if (err) return next(err);
        if (!canal) return next(new Error('Failed to load Canal ' + id));
        req.canal = canal;
        next();
    });
};




exports.getDashboardCurrentDay = function(req, res, next, id) {

    var canal = req.canal;
    var dateRange = exports.getCurrentDateRange();
    var clauseData = { created: { $gte: dateRange[0], $lt: dateRange[1] } };
    var clauseCanal = { canal: canal._id };
    var clauseSponsor = { sponsor: id };
    var clauseTrue = { status : true };
    var clauseFalse = { status : false };

    var queryCountTotal = [clauseCanal, clauseSponsor, clauseData];
    var queryCountFalse = [clauseCanal, clauseSponsor, clauseData, clauseFalse];
    var queryCountTrue = [clauseCanal, clauseSponsor, clauseData, clauseTrue];


    // Total de sponsorings
    SponsoringItem.count({$and : queryCountTotal},
        function(err, countTotal) {

            // Total com sucesso
            SponsoringItem.count({$and : queryCountTrue},
                function(err, countSuccess) {

                    // Total com erro
                    SponsoringItem.count({$and : queryCountFalse},
                        function(err, countError) {

                            res.jsonp({
                                total : countTotal,
                                success : countSuccess,
                                error : countError
                            });
                        });
                });

        });
};



exports.getDashboardTotal = function(req, res, next, id) {

    var canal = req.canal;
    var clauseCanal = { canal: canal._id };
    var clauseSponsor = { sponsor: id };
    var clauseTrue = { status : true };
    var clauseFalse = { status : false };

    var queryCountTotal = [clauseCanal, clauseSponsor];
    var queryCountFalse = [clauseCanal, clauseSponsor, clauseFalse];
    var queryCountTrue = [clauseCanal, clauseSponsor, clauseTrue];

    // Total de sponsorings
    SponsoringItem.count({$and : queryCountTotal},
        function(err, countTotal) {

            // Total com sucesso
            SponsoringItem.count({$and : queryCountTrue},
                function(err, countSuccess) {

                    // Total com erro
                    SponsoringItem.count({$and : queryCountFalse},
                        function(err, countError) {

                            res.jsonp({
                                total : countTotal,
                                success : countSuccess,
                                error : countError
                            });
                        });
                });

        });
};


/**
 * Retorna o range do dia atual
 * @returns {*[]}
 */
exports.getCurrentDateRange = function(){

    var today = new Date();
    today.setHours(0,0,0,0);

    var tomorow = new Date(today);
    tomorow.setDate(today.getDate()+1);

    return [today, tomorow]
};





