'use strict';

var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Sponsoring = mongoose.model('Sponsoring'),
    SponsoringItem = mongoose.model('SponsoringItem'),
    _ = require('lodash'),
    User = mongoose.model('User'),
    request = require('request'),
    URIBuilder = require('./WSURIBuilder'),
    WSClient = require('./WSClient'),
    Segmentation = require('./segmentation'),
    Splio = require('./mailing.splio');


exports.sendSponsoring = function(req, res) {

    var user = req.user;
    var sessionLandingId =  req.param('sessionlanding');
    var deviceAccess = req.param('deviceAccess');

    var isPartnerAllowed = req.param('isPartnerAllowed');

    Sponsoring.find({languageOrigin: req.get('x-language-origin')}).sort('-created')
        .populate('segmentation').exec(function(err, sponsorings) {

            var listSegmented = Segmentation.getDomainBySegmentation(user, sessionLandingId, deviceAccess, sponsorings);

            for(var x=0; x<listSegmented.length;x++){

                var domain = listSegmented[x];
                domain.type = 'sponsoring';

                if(listSegmented[x].status){

                    if(listSegmented[x].partner.isPartner){
                        if(isPartnerAllowed === 'true'){

                            //Splio.createContactPremiosImperdiveisByUser(req, res, user);

                            var link = URIBuilder.buildURI(domain, user);
                            WSClient.execute(domain, user, link, req, res);
                        }

                    }else{
                        var link = URIBuilder.buildURI(domain, user);
                        WSClient.execute(domain, user, link, req, res);
                    }
                }
            }
        });

};


exports.create = function(req, res) {

    var sponsoring = new Sponsoring(req.body);

    sponsoring.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(sponsoring);
        }
    });
};


exports.read = function(req, res) {
    res.jsonp(req.sponsoring);
};


exports.update = function(req, res) {

    var sponsoring = req.sponsoring;
    sponsoring = _.extend(sponsoring , req.body);

    sponsoring.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(sponsoring);
        }
    });
};


exports.delete = function(req, res) {

    var sponsoring = req.sponsoring;

    sponsoring.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(sponsoring);
        }
    });
};


exports.list = function(req, res) {

    if ((typeof req.param('canal') != 'undefined') && (req.param('canal') != 0)) {
        return exports.listByCanal(req, res, req.param('canal'));
    }

    Sponsoring.find({languageOrigin: req.get('x-language-origin')}).sort('-created')
        .populate('canais.canal', '_id, name')
        .populate('segmentation').exec(function(err, sponsoring) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(sponsoring);
        }
    });
};


exports.sponsoringByID = function(req, res, next, id) {

    Sponsoring.findById(id).populate('canais.canal', '_id, name')
        .populate('segmentation').exec(function(err, sponsoring) {

        if (err) return next(err);
        if (! sponsoring) return next(new Error('Failed to load Sponsoring ' + id));
        req.sponsoring = sponsoring ;
        next();
    });
};




exports.listByCanal = function(req, res, canal) {

    Sponsoring.find(
        {$and: [
            {'canais.canal' :  canal },
            {languageOrigin: req.get('x-language-origin')}
        ]}, {})
        .sort('-created').populate('segmentation')
        .populate('canais.canal', '_id, name') .exec(function(err, sponsoring) {

            if (err) {
                return res.status(400).send({message: errorHandler.getErrorMessage(err)});
            } else {
                res.jsonp(sponsoring);
            }
    });
};








/**
 * Envia os dados para os detalhes do Sponsoring
 * @param sponsor
 * @param user
 * @param reason
 * @param status
 */
exports.createSponsorItem = function(req, sponsor, user, reason, status){

    var data = {
        sponsor : sponsor._id,
        user : user._id,
        canal : user.canal,
        reason : reason,
        status : status,
        languageOrigin: req.get('x-language-origin')
    };

    request({
        uri: 'http://localhost:3009/sponsoringItem',
        method: 'POST',
        json: data
    }, function(error, response, body) {});
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








exports.getDashByCount = function(req, res) {

    var sponsoring = req.sponsoring;
    sponsoring = _.extend(sponsoring , req.body);

    var date = new Date();

    var dateDayInicial = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var dateDayFinal = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);

    var dateMonthInicial = new Date(date.getFullYear(), date.getMonth(), 1);
    var dateMonthFinal = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    var result = {};

    SponsoringItem.count({
            $and : [{sponsor: mongoose.Types.ObjectId(sponsoring._id)}, {status:true}]},
        function( err, count){

            result.countTotal = count;

            SponsoringItem.count({
                $and : [
                    {sponsor: mongoose.Types.ObjectId(sponsoring._id)},
                    {status:true},
                    {created: {$gte: dateDayInicial, $lt: dateDayFinal}},
                    {languageOrigin: req.get('x-language-origin')}
                ]}, function( err, count){

                result.countCurrentDay = count;


                SponsoringItem.count({
                    $and : [
                        {sponsor: mongoose.Types.ObjectId(sponsoring._id)},
                        {status:true},
                        {created: {$gte: dateMonthInicial, $lt: dateMonthFinal}},
                        {languageOrigin: req.get('x-language-origin')}
                    ]}, function( err, count){

                    result.countCurrentMonth = count;
                    res.jsonp(result);
                });
            });
        });
};



exports.getDashByStatus = function(req, res) {

    var sponsoring = req.sponsoring;
    sponsoring = _.extend(sponsoring , req.body);

    var dataIni = req.param('dataIni');
    var dataFim = req.param('dataFim');

    var dateArrIni = dataIni.split('-');
    var dateArrFim = dataFim.split('-');

    var dateInicial = new Date(dateArrIni[0], dateArrIni[1], dateArrIni[2]);
    var dateFinal   = new Date(dateArrFim[0], dateArrFim[1], +dateArrFim[2] + +1);

    var agg = [
        { $match: {
            $and :[
                {sponsor: mongoose.Types.ObjectId(sponsoring._id)},
                {created: {$gte: dateInicial, $lt: dateFinal}},
                {languageOrigin: req.get('x-language-origin')}
            ]
        }},
        { $group: {
            _id: '$status',
            "count": { "$sum": 1 }
        }}];

    SponsoringItem.aggregate(agg, function(err, result){

        res.json(result);

    });
};

exports.getDashBySponsor = function(req, res) {

    var sponsoring = req.sponsoring;
    sponsoring = _.extend(sponsoring , req.body);

    var dataIni = req.param('dataIni');
    var dataFim = req.param('dataFim');

    var dateArrIni = dataIni.split('-');
    var dateArrFim = dataFim.split('-');

    var dateInicial = new Date(dateArrIni[0], dateArrIni[1], dateArrIni[2]);
    var dateFinal   = new Date(dateArrFim[0], dateArrFim[1], +dateArrFim[2] + +1);


    var agg = [
        { $match: {
            $and :[
                {sponsor: mongoose.Types.ObjectId(sponsoring._id)},
                {status: true},
                {created: {$gte: dateInicial, $lt: dateFinal}},
                {languageOrigin: req.get('x-language-origin')}
            ]
        }},
        { $sort : { created : -1} },
        { $group: {
            _id: {
                'year':  { '$year': '$created' },
                'month': { '$month': '$created' },
                'day':   { '$dayOfMonth': '$created' }
            },
            'count': { '$sum': 1 }
        }}];


    SponsoringItem.aggregate(agg, function(err, result){

        var dados = [];

        for(var x=0; x<result.length; x++){

            dados.push({
                date: new Date (result[x]._id.year, result[x]._id.month-1, result[x]._id.day),
                count: result[x].count
            });
        }

        dados.sort(function compare(a,b) {
            if (a.date < b.date)
                return -1;
            if (a.date > b.date)
                return 1;
            return 0;
        });

        res.json(dados);

    });

};



