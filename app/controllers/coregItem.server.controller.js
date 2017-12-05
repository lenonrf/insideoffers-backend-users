'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    CoregItem = mongoose.model('CoregItem'),
    _ = require('lodash');



exports.create = function(req, res) {

    var coregItem = new CoregItem(req.body);

    coregItem.save(function(err) {
        if (err) {

            console.log('err', err);

            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(coregItem);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.coregItem);
};





exports.update = function(req, res) {

    var coregItem = req.coregItem;

    coregItem = _.extend(coregItem , req.body);

    coregItem.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(coregItem);
        }
    });
};





exports.delete = function(req, res) {

    var coregItem = req.coregItem;

    coregItem.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(coregItem);
        }
    });
};






exports.list = function(req, res) {

    var limit = req.param('limit');

    CoregItem.find().sort('-created')
        .deepPopulate('user')
        .limit(limit)
        .exec(function(err, coregItems) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err.message)
                });
            } else {
                res.jsonp(coregItems);
            }
        });
};





exports.countByCoreg = function(req, res) {

    var coreg = req.param('coregId');
    var dataIni = req.param('dataIni');
    var dataFim = req.param('dataFim');

    var dateArrIni = dataIni.split('-');
    var dateArrFim = dataFim.split('-');

    var dateInicial = new Date(dateArrIni[0], dateArrIni[1], dateArrIni[2]);
    var dateFinal   = new Date(dateArrFim[0], dateArrFim[1], +dateArrFim[2] + +1);

    CoregItem.count({
        $and :[
            {created: {
                $gte: dateInicial,
                $lt: dateFinal}
            },
            {coreg: coreg},
            {status:true}

        ]}, function (err, count) {
            res.jsonp({'count': count});
        });

};





exports.listByCoregId = function(req, res) {

    var limit = req.param('limit');
    var coreg = req.coreg;

    var dataIni = req.param('dataIni');
    var dataFim = req.param('dataFim');

    var dateArrIni = dataIni.split('-');
    var dateArrFim = dataFim.split('-');

    var dateInicial = new Date(dateArrIni[0], dateArrIni[1], dateArrIni[2]);
    var dateFinal   = new Date(dateArrFim[0], dateArrFim[1], +dateArrFim[2] + +1);

    CoregItem.find({
        $and :[
            {created: {$gte: dateInicial, $lt: dateFinal}},
            {coreg: coreg._id}]
        })
        .sort('-created')
        .deepPopulate('user.canal')
        .limit(limit)
        .exec(function(err, coregItems) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err.message)
                });
            } else {
                res.jsonp(coregItems);
            }
        });

};



exports.filterByCategory = function(req, res, filterCategory) {


    CoregItem.find({category:filterCategory}).sort('-created')
        .populate('category', 'name').exec(function (err, coregItems) {

            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                    res.jsonp(coregItems);
            }
        });
}





exports.coregItemByID = function(req, res, next, id) {

    CoregItem.findById(id).exec(function(err, coregItem) {

        if (err) return next(err);
        if (! coregItem) return next(new Error('Failed to load CoregItem ' + id));
        req.coregItem = coregItem ;
        next();
    });
};




