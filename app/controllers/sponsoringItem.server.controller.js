
'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    SponsoringItem = mongoose.model('SponsoringItem'),
    Sponsoring = mongoose.model('Sponsoring'),
    _ = require('lodash');



    exports.create = function(req, res, isRest) {

    //var day = new Date();
    //day.setDate(new Date().getDate()-10);
    //day.setHours(0, 0, 0, 0);

    req.body.created = new Date(new Date().setHours(0, 0, 0, 0));
    var sponsoringItem = new SponsoringItem(req.body);

    sponsoringItem.save(function(err) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {

            if(isRest){
                res.jsonp(sponsoringItem);
            }else{
                return sponsoringItem;
            }
        }
    });
};





exports.read = function(req, res) {
    res.jsonp(req.sponsoringItem);
};





exports.update = function(req, res) {

    var sponsoringItem = req.sponsoringItem;
    sponsoringItem = _.extend(sponsoringItem , req.body);

    sponsoringItem.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(sponsoringItem);
        }
    });
};





exports.delete = function(req, res) {

    var sponsoringItem = req.sponsoringItem;

    sponsoringItem.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(sponsoringItem);
        }
    });
};






exports.list = function(req, res) {

    if ((typeof req.param('canal') != 'undefined') && (req.param('canal') != 0)) {
        return exports.listByCanal(req, res, req.param('canal'));
    }

    SponsoringItem.find({languageOrigin: req.get('x-language-origin')}).sort('-created')
        .populate('canal', 'name')
        .populate('sponsor', 'name')
        .populate('user', 'email')
        .exec(function(err, sponsoringItem) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(sponsoringItem);
        }
    });
};



exports.sponsoringItemByID = function(req, res, next, id) {

    SponsoringItem.findById(id).populate('canais.canal', '_id, name').exec(function(err, sponsoringItem) {

        if (err) return next(err);
        if (! sponsoringItem) return next(new Error('Failed to load SponsoringItem ' + id));
        req.sponsoringItem = sponsoringItem ;
        next();
    });
};





exports.listByCanal = function(req, res, canal) {

    SponsoringItem.find(
        { $and: [
            {'canais.canal' :  canal},
            {languageOrigin: req.get('x-language-origin')}
        ]}, {})
        .sort('-created').populate('canais.canal', '_id, name') .exec(function(err, sponsoringItem) {

            if (err) {
                return res.status(400).send({message: errorHandler.getErrorMessage(err)});
            } else {
                res.jsonp(sponsoringItem);
            }
        });
};


exports.getCanalDashboardBySponsor = function(req, res, next, id){

    var today = new Date();
    var tomorow = new Date(today);
    tomorow.setDate(today.getDate()-10);
    today.setTime(0,0,0,0);
    tomorow.setTime(0,0,0,0);

    SponsoringItem.aggregate([

        { $match: {
            "created" : {
                $gte : tomorow,
                $lt : today
            }
        }},

        {
            $group: {
                _id: '$created',
                count: {$sum: 1}
            }
        }
    ], function (err, result) {

        var response = {
            'users' : {
                'startDay' : tomorow,
                'finalDay' : today,
                'result' : result

            }
        };

        res.json(response);
    });
};



exports.countBySponsor = function(req, res) {

    var sponsorId = req.param('sponsorId');

    var dataIni = req.param('dataIni');
    var dataFim = req.param('dataFim');

    var dateArrIni = dataIni.split('-');
    var dateArrFim = dataFim.split('-');

    var dateInicial = new Date(dateArrIni[0], dateArrIni[1], dateArrIni[2]);
    var dateFinal   = new Date(dateArrFim[0], dateArrFim[1], +dateArrFim[2] + +1);

    SponsoringItem.count({
        $and :[
            {created: {$gte: dateInicial, $lt: dateFinal}},
            {sponsor: sponsorId},
            {status:true}

        ]}, function (err, count) {
            res.jsonp({'count': count});

        });

};





exports.listBySponsorId = function(req, res) {

    var limit = req.param('limit');
    var sponsoring = req.sponsoring;

    var dataIni = req.param('dataIni');
    var dataFim = req.param('dataFim');

    var dateArrIni = dataIni.split('-');
    var dateArrFim = dataFim.split('-');

    var dateInicial = new Date(dateArrIni[0], dateArrIni[1], dateArrIni[2]);
    var dateFinal   = new Date(dateArrFim[0], dateArrFim[1], +dateArrFim[2] + +1);

    SponsoringItem.find({
        $and :[
            {created: {$gte: dateInicial, $lt: dateFinal}},
            {sponsor: sponsoring._id}]
    })
        .sort('-created')
        .deepPopulate('user.canal')
        .limit(limit)
        .exec(function(err, sponsoringItems) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err.message)
                });
            } else {
                res.jsonp(sponsoringItems);
            }
        });

};

