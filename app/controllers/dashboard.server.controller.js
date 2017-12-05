'use strict';

var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    User = mongoose.model('User'),
    //UserFR = mongoose.model('UserFR'),
    _ = require('lodash');


exports.read = function(req, res) {
    res.jsonp(req.oportunity);
};


const util = require('util');


exports.countUsersByTrafficSource = function(req, res){

    var dateInicial = null;
    var dateFinal = null;

    if((req.param('dateStart')) && (req.param('dateEnd'))){
        
        dateInicial = new Date(req.param('dateStart'));
        dateFinal = new Date(req.param('dateEnd'));

    }else{

        var date = new Date();
        dateInicial = new Date(date.getFullYear(), date.getMonth(), date.getDate()-11);
        dateFinal = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
    }

    
    var agg = [
        { $match: {
            $and :[
                {created: {$gte: dateInicial, $lt: dateFinal}},
                {languageOrigin: req.get('x-language-origin')}
            ]
        }},
        { $sort : { created : -1} },
        { $group: {
            _id: {
                //'year':  { '$year': '$created' },
                //'month': { '$month': '$created' },
                //'day':   { '$dayOfMonth': '$created' },
                'trafficOrigin' : '$trafficOrigin'
            },
            'count': { '$sum': 1 }
        }}];

    /*console.log('');console.log('');console.log('');console.log('');
    console.log(util.inspect(agg, false, null));
    console.log('');console.log('');
    console.log('dateInicial', req.param('dateStart'));
    console.log('dateFinal', req.param('dateEnd'));
    console.log('');console.log('');
    console.log('dateInicial', new Date(req.param('dateStart')));
    console.log('dateFinal', new Date(req.param('dateEnd')));
    console.log('');console.log('');*/
    


    User.aggregate(agg, function(err, result){

        var dados = [];

        for(var x=0; x<result.length; x++){

            console.log(result[x]);

            dados.push({
                //date: new Date (result[x]._id.year, result[x]._id.month-1, result[x]._id.day),
                //dateFormated: result[x]._id.year+("0" + result[x]._id.month).slice(-2)+("0" + result[x]._id.day).slice(-2),
                trafficOrigin: (_.isEmpty(result[x]._id.trafficOrigin)) ? 'undefined' : result[x]._id.trafficOrigin,
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

        //console.log('');
        //console.log('');
        //console.log(_.groupBy(dados, 'date'));
        //res.json(_.groupBy(dados, 'dateFormated'));
        res.json(dados);
    });
};



/**
 * Contador total de usuarios
 * @param req
 * @param res
 */
exports.countUsers = function(req, res){


    User.count({languageOrigin: req.get('x-language-origin')}, function( err, count){

        var response = {
            'users' : {
                'count' : count
            }
        };

        res.jsonp(response);

    });


/*
    if(req.get('x-language-origin') === 'fr-FR'){

        UserFR.count({}, function( err, count){

            var response = {
                'users' : {
                    'count' : count
                }
            };

            res.jsonp(response);

        });

    }else if(req.get('x-language-origin') === 'pt-BR'){

        User.count({}, function( err, count){

            var response = {
                'users' : {
                    'count' : count
                }
            };

            res.jsonp(response);

        });

    }*/

};




/**
 * Agrupar por sexo trazendo seus contadores
 * @param req
 * @param res
 */
exports.countUsersByGender = function(req, res){


    var agg = [
        { $match:  {languageOrigin: req.get('x-language-origin')} },
        { $group: {
            _id: '$gender',
            "count": { "$sum": 1 }
        }}];


    User.aggregate(agg, function (err, result) {

        var response = {
            'users' : {
                'gender' : result
            }
        };

        res.json(response);
    });


    /*


    if(req.get('x-language-origin') === 'fr-FR'){

        UserFR.aggregate([
            {
                $group: {
                    _id: '$gender',
                    count: {$sum: 1}
                }
            }
        ], function (err, result) {

            var response = {
                'users' : {
                    'gender' : result
                }
            };

            res.json(response);
        });

    }else if(req.get('x-language-origin') === 'pt-BR'){

        User.aggregate([
            {
                $group: {
                    _id: '$gender',
                    count: {$sum: 1}
                }
            }
        ], function (err, result) {

            var response = {
                'users' : {
                    'gender' : result
                }
            };

            res.json(response);
        });
    }
*/


};





/**
 * Agrupar por canal trazendo seus contadores
 * @param req
 * @param res
 */
exports.countUsersByDate = function(req, res){

    var date = new Date();

    var dateInicial = new Date(date.getFullYear(), date.getMonth(), date.getDate()-11);
    var dateFinal = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);


    var agg = [
        { $match: {
            $and :[
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




    User.aggregate(agg, function(err, result){

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

    /*

    if(req.get('x-language-origin') === 'fr-FR'){


        UserFR.aggregate(agg, function(err, result){

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

    }else if(req.get('x-language-origin') === 'pt-BR'){


        User.aggregate(agg, function(err, result){

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

    }*/




};

/*

exports.list = function(req, res) {

    var filterStatus = req.param('status');

    if ( (typeof filterStatus != 'undefined') && (filterStatus != 0)) {
        exports.filterByStatus(req, res, filterStatus);

    }else{

        if(req.get('x-language-origin') === 'fr-FR'){


            User.find()
                .populate('category', 'name').exec(function(err, oportunities) {

                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err.message)
                        });
                    } else {
                        res.jsonp(oportunities);
                    }
                });


        }else if(req.get('x-language-origin') === 'pt-BR'){


            User.find()
                .populate('category', 'name').exec(function(err, oportunities) {

                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err.message)
                        });
                    } else {
                        res.jsonp(oportunities);
                    }
                });
        }

    }

};




exports.filterByStatus = function(req, res, filterStatus) {


    if(req.get('x-language-origin') === 'fr-FR'){

        UserFR.find({status:filterStatus}).sort('-created')
            .populate('category', 'name').exec(function (err, oportunities) {

                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(oportunities);
                }
            });

    }else if(req.get('x-language-origin') === 'pt-BR'){

        User.find({status:filterStatus}).sort('-created')
            .populate('category', 'name').exec(function (err, oportunities) {

                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(oportunities);
                }
            });
    }

};
*/







