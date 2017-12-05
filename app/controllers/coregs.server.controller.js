'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Coreg = mongoose.model('Coreg'),
    CoregItem = mongoose.model('CoregItem'),
    _ = require('lodash'),
    URIBuilder = require('./WSURIBuilder'),
    WSClient = require('./WSClient'),
    Segmentation = require('./segmentation');



exports.listByUserSegmentation = function(req, res){

    var user = req.user;
    var sessionLandingId =  req.param('sessionlanding');
    var deviceAccess = req.param('deviceAccess');

    Coreg.find({
        $and : [
            {status:true},
            {languageOrigin: req.get('x-language-origin')}
        ]}).sort('-created')
        .populate('category', 'name')
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



exports.getDashByCount = function(req, res) {

    var coreg = req.coreg;
    coreg = _.extend(coreg , req.body);

    var date = new Date();

    var dateDayInicial = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var dateDayFinal = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);

    var dateMonthInicial = new Date(date.getFullYear(), date.getMonth(), 1);
    var dateMonthFinal = new Date(date.getFullYear(), date.getMonth() + 1, 0);


    var result = {};

    CoregItem.count({
        $and : [{coreg: mongoose.Types.ObjectId(coreg._id)}, {status:true}]},
        function( err, count){

            result.countTotal = count;

            CoregItem.count({
                    $and : [
                        {coreg: mongoose.Types.ObjectId(coreg._id)},
                        {status:true},
                        {created: {$gte: dateDayInicial, $lt: dateDayFinal}},
                        {languageOrigin: req.get('x-language-origin')}
                    ]}, function( err, count){

                    result.countCurrentDay = count;


                    CoregItem.count({
                        $and : [
                            {coreg: mongoose.Types.ObjectId(coreg._id)},
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

    var coreg = req.coreg;
    coreg = _.extend(coreg , req.body);

    var dataIni = req.param('dataIni');
    var dataFim = req.param('dataFim');

    var dateArrIni = dataIni.split('-');
    var dateArrFim = dataFim.split('-');

    var dateInicial = new Date(dateArrIni[0], dateArrIni[1], dateArrIni[2]);
    var dateFinal   = new Date(dateArrFim[0], dateArrFim[1], +dateArrFim[2] + +1);

    var agg = [
        { $match: {
            $and :[
                {coreg: mongoose.Types.ObjectId(coreg._id)},
                {created: {$gte: dateInicial, $lt: dateFinal}},
                {languageOrigin: req.get('x-language-origin')}
            ]
        }},
        { $group: {
            _id: '$status',
            "count": { "$sum": 1 }
        }}];

    CoregItem.aggregate(agg, function(err, result){

        res.json(result);

    });
};

exports.getDashByCoreg = function(req, res) {

    var coreg = req.coreg;
    coreg = _.extend(coreg , req.body);

    var dataIni = req.param('dataIni');
    var dataFim = req.param('dataFim');

    var dateArrIni = dataIni.split('-');
    var dateArrFim = dataFim.split('-');

    var dateInicial = new Date(dateArrIni[0], dateArrIni[1], dateArrIni[2]);
    var dateFinal   = new Date(dateArrFim[0], dateArrFim[1], +dateArrFim[2] + +1);


    var agg = [
        { $match: {
            $and :[
                {coreg: mongoose.Types.ObjectId(coreg._id)},
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


    CoregItem.aggregate(agg, function(err, result){

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



exports.sendCoreg = function(req, res) {

    var user = req.user;
    var coregs = req.body;

    for(var x=0; x<coregs.length;x++){

        var id = coregs[x]._id;
        var answer = coregs[x].answer;

        if(answer){

            Coreg.findById(id).exec(function(err, domain) {

                domain.type = 'coreg';

                var link = URIBuilder.buildURI(domain, user);
                WSClient.execute(domain, user, link, req);

            });
        }
    }

    res.jsonp(user );

};





exports.create = function(req, res) {

    var coreg = new Coreg(req.body);

    coreg.save(function(err) {
        if (err) {

            console.log('err', err);

            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(coreg);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.coreg);
};





exports.update = function(req, res) {

    var coreg = req.coreg;

    coreg = _.extend(coreg , req.body);

    coreg.save(function(err) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {

            Coreg.populate(coreg, {path: 'segmentation'}, function(err, coreg){
                res.jsonp(coreg);
            });
        }
    });
};





exports.delete = function(req, res) {

    var coreg = req.coreg;

    coreg.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(coreg);
        }
    });
};






exports.list = function(req, res) {

    var filterCategory = req.param('category');

    if ( (typeof filterCategory != 'undefined') && (filterCategory != 0)) {
        exports.filterByCategory(req, res, filterCategory);

    }else{


        Coreg.find({languageOrigin: req.get('x-language-origin')}).sort('-created')
            .populate('category', 'name')
            .populate('segmentation').exec(function(err, coregs) {


                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err.message)
                    });
                } else {
                    res.jsonp(coregs);
                }
            });
    }

};




exports.coregByID = function(req, res, next, id) {

    Coreg.findById(id).populate('segmentation').exec(function(err, coreg) {

        if (err) return next(err);
        if (! coreg) return next(new Error('Failed to load Coreg ' + id));
        req.coreg = coreg ;
        next();
    });
};




