'use strict';
var mongoose = require('mongoose');
var RandomKey = mongoose.model('RandomKey');


module.exports = function(app) {

    var request = require('request');



        app.route('/empremobiliario')
            .post(function(req, res){

            var link = 'https://api.hasoffers.com/Apiv3/json?' +
                'NetworkId=springmedia' +
                '&Target=Conversion' +
                '&Method=create' +
                '&NetworkToken=NETqSp772nJXc04Z2ZRTmDj3PPDpf0' +
                '&data%5Baffiliate_id%5D=1499' +
                '&data%5Badvertiser_id%5D=921' +
                '&data%5Boffer_id%5D=1409'+
                '&data%5Bpayout%5D=1.5'+
                '&data%5Brevenue%5D=3.0'+
                '&number=1'+
                '&advertiser_info%5D='+req.body.email+'_'+encodeURI(req.body.name)+'_'+req.body.cellphone;

            console.log(' ');
            console.log('empremobiliario', link);

            request(link, function (error, response, body) {

                if (!error && response.statusCode == 200) {
                    console.log('[empremobiliario]', body);
                    return res.status(200).send({
                        message: body
                    });
                }
            });

        });




        app.route('/catho')
            .post(function(req, res){

            var link = 'https://api.hasoffers.com/Apiv3/json?' +
                'NetworkId=springmedia' +
                '&Target=Conversion' +
                '&Method=create' +
                '&NetworkToken=NETqSp772nJXc04Z2ZRTmDj3PPDpf0' +
                '&data%5Baffiliate_id%5D=1499' +
                '&data%5Badvertiser_id%5D=903' +
                '&data%5Boffer_id%5D=1445'+
                '&data%5Bpayout%5D=2.5'+
                '&data%5Brevenue%5D=2.5'+
                '&number=1'+
                '&advertiser_info%5D='+req.body.email+'_'+encodeURI(req.body.name)+'_'+req.body.cellphone;

            console.log(' ');
            console.log('catho', link);

            request(link, function (error, response, body) {

                if (!error && response.statusCode == 200) {
                    console.log('[catho]', body);
                    return res.status(200).send({
                        message: body
                    });
                }
            });

        });





    app.route('/conectai')
        .post(function(req, res){

            var offer_id = req.param('offer_id');
            var p = req.param('p');
            var r = req.param('r');
            var userId = req.param('user_id');


            var link = 'https://api.hasoffers.com/Apiv3/json?' +
                'NetworkId=springmedia' +
                '&Target=Conversion' +
                '&Method=create' +
                '&NetworkToken=NETqSp772nJXc04Z2ZRTmDj3PPDpf0' +
                '&data%5Baffiliate_id%5D=1208' +
                '&data%5Badvertiser_id%5D=861' +
                '&data%5Badvertiser_info%5D='+userId+
                '&data%5Boffer_id%5D=' +offer_id+
                '&data%5Bpayout%5D=' +p+
                '&data%5Brevenue%5D=' +r+
                '&number=1';

            request(link, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('[CONECTAI]', body);
                    return res.status(200).send({
                        message: body
                    });
                }
            });

        });




    app.route('/randomkey')
        .get(function(req, res){

            /*var ddd   = req.param('cellphone').substr(0, 2);
            var regionKey = ''; 

            console.log(ddd, req.param('cellphone'));

            var DDD_SUDESTE = ['11','12','13','14','15','16','17','18','19','21','22','24','27','28','31','32','33','34','35','37','38'];
            var DDD_SUL = ['41','42','43','44','45','46','47','48','49','51','53','54','55'];
            var DDD_CENTRO_OESTE = ['61','62','64','65','66','67'];
            var DDD_NORDESTE = ['71','73','74','75','77','79','81','82','83','84','85','86','87','88','89'];
            var DDD_NORTE = ['91','92','93','94','95','96','97','98','99','68','69','63'];

            console.log('DDD_SUDESTE.indexOf(ddd)', DDD_SUDESTE.indexOf(ddd));

            if(DDD_SUDESTE.indexOf(ddd) > -1){
                regionKey = 'SUDESTE';
            }

            if(DDD_SUL.indexOf(ddd) > -1){
                regionKey = 'SUL';
            }

            if(DDD_CENTRO_OESTE.indexOf(ddd) > -1){
                regionKey = 'CENTRO_OESTE';
            }

            if(DDD_NORDESTE.indexOf(ddd) > -1){
                regionKey = 'NORDESTE';
            }

            if(DDD_NORTE.indexOf(ddd) > -1){
                regionKey = 'NORTE';
            }


            RandomKey.findOne({
                    status: true, region: regionKey
                }).exec(function(err, dataFind){

                    console.log('RandomKey', dataFind);

                    RandomKey.update({_id : dataFind._id}, {status : false}, function(err, data){

                        return res.status(200).send({
                            key : dataFind.key 
                        });
                    });
            });*/

            return res.status(200).send();

        });
};
