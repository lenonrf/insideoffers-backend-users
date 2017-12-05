'user strict';

var mongoose = require('mongoose'),
    request = require('request'),
    soap = require('soap'),
    CoregItem = mongoose.model('CoregItem'),
    SponsoringItem = mongoose.model('SponsoringItem');

    var sha1 = require('sha1');
    var execPhp = require('exec-php');



exports.getCurrentDateRange = function(){

    var today = new Date();
    today.setHours(0,0,0,0);

    var tomorow = new Date(today);
    tomorow.setDate(today.getDate()+1);

    return [today, tomorow]
};


exports.isCoregImplemented = function(code){

    var coregs = ['padre'];
    return (coregs.indexOf(code) > -1);
};


exports.executeCoregImplemented = function (domain, user, req, res){

    switch(domain.code){

        case 'padre':
            
            console.log('coreg padre');

            var data = {

                timezone: '-3',
                language: 'pt-pt',

                location :{
                    country: 'BRA'
                },

                email : user.email,
                birthdate : user.birthDate,
                gender : user.gender,
                firstName : user.name,

                originDetail : {
                    partner : "PTME",
                    campaignarea : "BR",
                    subid: 'gostei.club',
                    media : "COREG",
                    campaign : "coreg_2016",
                    theme : "2016"
                }
            };


            request({
                uri: 'https://api.guardian-angel-reading.com/api/Partners/login',
                method: 'POST',
                json: { email:'jeremie.pereira77@gmail.com','password':'Ptme-12345'}
            }, function (error, response, body) {

                console.log('login', body.id);
                console.log('data', data);

                if (!error && response.statusCode == 200) {

                    request({
                        uri: 'https://api.guardian-angel-reading.com/api/Customers?access_token='+body.id,
                        method: 'POST',
                        json: data
                    }, function (error, response, bodyCoreg) {

                        console.log('bodyCoreg', response.statusCode, bodyCoreg);

                        if (!error && response.statusCode == 200) {

                            exports.createItem('isCoregImplemented', 
                                domain, user, bodyCoreg, true, res);
                        }
                    });
                }
            });



        break;
    }

};


exports.execute = function(domain, user, link, req, res){

    user.languageOrigin = req.get('x-language-origin');
    var dateRange = exports.getCurrentDateRange();

    if(domain.type === 'coreg'){

        CoregItem.count({
                $and : [
                    { coreg: domain._id },
                    { created: { $gte: dateRange[0], $lt: dateRange[1] } },
                    {languageOrigin: req.get('x-language-origin')},
                    { status : true }
                ]},

            function(err, count) {

                if(count <= domain.capping){

                    if(exports.isCoregImplemented(domain.code)){  
                        exports.executeCoregImplemented(domain, user, req, res);
                    
                    }else{

                        request(link, function (error, response, body) {
                            if (!error && response.statusCode == 200) {

                                console.log('[WSCLIENT]','['+req.get('x-language-origin')+']',
                                    '['+domain.type+']','['+domain.code+']', '[CAPPING]', count+'/'+domain.capping,
                                    '['+user.email+']', '[STATUS]', exports.isSuccess(domain, body), '[LINK]', link);

                                exports.createItem(link, domain, user, body, exports.isSuccess(domain, body), res);
                            }
                        });
                    }
                }
            }
        );



    }else if(domain.type === 'sponsoring'){


        SponsoringItem.count({
                $and : [
                    { sponsor: domain._id },
                    { created: { $gte: dateRange[0], $lt: dateRange[1] } },
                    {languageOrigin: req.get('x-language-origin')},
                    { status : true }
                ]},

            function(err, count) {

                console.log('[WSCLIENT]','['+req.get('x-language-origin')+']',
                    '['+domain.type+']', '['+domain.code+']', '[CAPPING]', count+'/'+domain.capping);

                if(count <= domain.capping){


                    request(link, function (error, response, body) {

                        if (!error && response.statusCode == 200) {

                            console.log('[WSCLIENT]','['+req.get('x-language-origin')+']',
                                '['+domain.type+']','['+domain.code+']', '['+user.email+']',
                                '[STATUS]', exports.isSuccess(domain, body), '[LINK]', link);

                            exports.createItem(link, domain, user, body, exports.isSuccess(domain, body), res);
                        }
                    });

                }
            }
        );

    }
};




exports.isSuccess = function (domain, body){

    if(body.indexOf(domain.successPayload) > -1){
        return true;
    }else{
        return false;
    }
};




exports.createItem = function(link, domain, user, reason, status, res){

    var uri = '';
    var data = {};


    if(domain.type === 'sponsoring'){

        uri = 'http://localhost:3009/sponsoringItem'

        data = {
            sponsor : domain._id,
            user : user._id,
            //canal : user.canal,
            reason : reason,
            link: link,
            status : status,
            languageOrigin : user.languageOrigin
        };

    }else{

        uri = 'http://localhost:3009/coregItem'

        data = {
            coreg : domain._id,
            user : user._id,
            canal : user.canal,
            reason : reason,
            status : status,
            link: link,
            languageOrigin : user.languageOrigin

        };
    }



    request({
        uri: uri,
        method: 'POST',
        json: data
    }, function(error, response, body) {

        /*if (error) {
            return res.status(400).send({
                message: 'Erro ao inserir o WS item'
            });
        } else {
            console.log('aKI !!!!!', res.statusCode);
            return res.status(200).send();
        }*/
    });
};



exports.isLeadFromBeeleads = function(domain){

    return (domain.code === 'amex') || domain.code === 'buscape';
};


exports.getOfferIdFromBeeleads = function(domain){

    switch(domain.code){
        case 'amex':
            return 2375;
            break;

        case 'buscape':
            return 2797;
            break;
    }
};


exports.sendWSBeeleads = function(user, domain, res){

    execPhp('BeeleadsAffiliate.class.php', '/usr/bin/php5', function(error, php, outprint) {

        var offerID = exports.getOfferIdFromBeeleads(domain);

        console.log('[WSCLIENT] offerID', offerID);

        php.sendlead(user.name, user.email, user.cellphone, offerID,
            function (err, result, output, printed) {

                var link = result;

                request(link, function (error, response, body) {

                    var result = JSON.parse(body);

                    console.log(' [WSCLIENT] response', response);
                    console.log(' [WSCLIENT] body', body);
                    console.log(' [WSCLIENT] result', result);

                    if (!error && result.response.status === 200) {

                        console.log('[WSCLIENT]', '[' + user.languageOrigin + ']',
                            '[' + domain.type + ']', '[' + domain.code + ']', '[' + user.email + ']',
                            '[STATUS]', exports.isSuccess(domain, body), '[LINK]', link);

                        exports.createItem(link, domain, user, body, exports.isSuccess(domain, body), res);
                    }
                });
            });
    });
};
