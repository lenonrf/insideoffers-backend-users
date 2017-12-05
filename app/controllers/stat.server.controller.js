'use strict';


/**
 * Module dependencies.
 */
var errorHandler = require('./errors'),
    request = require('request'),
    _ = require('lodash'),
    pmx = require('pmx');


exports.getStats = function(req, res){

     var offerID = req.params.offerID;
    var dateIni = req.param('dateIni');
    var dateFinal = req.param('dateFinal');

    var URL = ' https://api.hasoffers.com/Apiv3/json?NetworkId=springmedia&Target=Report&Method=getStats&NetworkToken=NETqSp772nJXc04Z2ZRTmDj3PPDpf0&fields%5B%5D=Offer.name&fields%5B%5D=Stat.impressions&fields%5B%5D=Stat.conversions&fields%5B%5D=Stat.clicks&fields%5B%5D=Stat.date&groups%5B%5D=Stat.date&filters%5BStat.offer_id%5D%5Bconditional%5D=EQUAL_TO' +
        '&filters%5BStat.offer_id%5D%5Bvalues%5D=' + offerID +
        '&filters%5BStat.date%5D%5Bconditional%5D=BETWEEN' +
        '&filters%5BStat.date%5D%5Bvalues%5D%5B%5D=' + dateIni +
        '&filters%5BStat.date%5D%5Bvalues%5D%5B%5D=' + dateFinal +
        '&sort%5BStat.date%5D=asc&limit=10000000000000';

    request.get({
        url: URL,
        json: true

    }, function(error, response, body) {

        return res.status(200).send(
          body.response.data.data
        );
    });

};






