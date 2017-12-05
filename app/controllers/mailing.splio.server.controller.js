'use strict';


/**
 * Module dependencies.
 */
var errorHandler = require('./errors'),
    request = require('request'),
    _ = require('lodash'),
    pmx = require('pmx');


var secretAPIKey = '60626cb71e25344ddca913080867083127780dce';
var universe = 'gosteiclub';
var URL = 'https://'+universe+':'+secretAPIKey+'@s3s.fr/api/rest/1';



exports.getList = function(origin){

    if(origin === 'pt-BR'){
        return [{'id': '0', 'name' : 'gostei.club'}];
    }

    if(origin === 'fr-FR'){
        return [{'id': '2', 'name' : 'opportunites.club'}];
    }

    if(origin === 'es-MX'){
        return [{'id': '2', 'name' : 'megusta.com.mx'}];
    }


};



exports.getWelcomeMailURL = function(origin){

    if(origin === 'pt-BR'){
        return 'http://file.splio3.fr/6fL/NZ/TUH0';
    }

    if(origin === 'fr-FR'){
        return 'http://file.splio3.fr/6fL/Pk/VzZj';
    }

    if(origin === 'es-MX') {
        return 'https://file.splio3.fr/6gx/gD/tWeg/'
    }

};




exports.buildContact = function(user){

    var nameSplited = user.name.split(' ');

    var data = {
        'email': user.email,
        'lang': user.languageOrigin,
        'firstname' : nameSplited[0],
        'lastname': nameSplited[1],
        'lists' : exports.getList(user.languageOrigin),

        'fields' : [
            { 'id': '0', 'name' : 'gender',    'value': (_.isEmpty(user.gender)) ? '' :  user.gender},
            { 'id': '1', 'name' : 'cellphone', 'value': (_.isEmpty(user.cellphone)) ? '' :  user.cellphone},
            { 'id': '2', 'name' : 'telephone', 'value': (_.isEmpty(user.telephone)) ? '' :  user.telephone},
            { 'id': '3', 'name' : 'zipcode',   'value': (_.isEmpty(user.address.zipcode)) ? '' :  user.address.zipcode},
            { 'id': '4', 'name' : 'state',     'value': (_.isEmpty(user.address.state)) ? '' :  user.address.state},
            { 'id': '5', 'name' : 'city',      'value': (_.isEmpty(user.address.city)) ? '' :  user.address.city},
            { 'id': '6', 'name' : 'birthdate', 'value': (_.isEmpty(user.birthDate)) ? '' :  user.birthDate}
        ]

    };

    return data;

};


exports.createContact = function(req, res){

    if(req.param('client') === 'premiosimperdiveis'){
        exports.createContactPremiosImperdiveis(req, res);
        return null;
    }


    var data = exports.buildContact(req.body);

    request({
        uri: URL+'/contact',
        method: 'POST',
        json: data

    }, function(error, response, body) {

        if(body.code != 200){

            //pmx.notify(new Error('[ERROR][MAILLING][INTEGRATION] Erro ao inserir o email integration: '+data.email+' '+body));
            console.log('[ERROR][MAILLING][SPLIO][INTEGRATION] Erro ao inserir o email integration: '+data.email, body.description)
            return res.status(500).send({
                message: 'erro ao inserir o email'
            });

        }else{

            console.log('[MAILLING][SPLIO][INTEGRATION] Email inserido: '+data.email)
            return res.status(200).send({
                message: 'email '+data.email+' inserido com sucesso'
            });
        }


    });

};



exports.updateContact = function(req, res){

    var user = req.body;
    var userData = exports.buildContact(req.body);

    request({
        uri: URL+'/contact/'+user.email,
        method: 'PUT',
        json: userData

    }, function(error, response, body) {

        if(body.code != 200){

            pmx.notify(new Error('[MAILLING][SPLIO][INTEGRATION] Erro ao atualizar o email integration: '+user.email+' '+body));
            console.log('[ERROR][MAILLING][SPLIO][INTEGRATION] Erro ao atualizar o email integration: '+user.email, body);
            return res.status(500).send({
                message: 'erro ao atualizar o email'
            });

        }else{

            exports.updateContactPremiosImperdiveis(req, res);

            console.log('[MAILLING][SPLIO][INTEGRATION] Email atualizado: '+user.email);
            return res.status(200).send({
                message: 'email '+user.email+' atualizado com sucesso'
            });
        }
    });
};







exports.sendWelcomeMail = function(req, res){

    var secretAPIKeyLaunch = '8e62c94910a425addec89a80490262514bed6608';
    var URL_launch = 'https://s3s.fr/api/trigger/nph-2.pl?universe='+universe+'&key='+secretAPIKeyLaunch;


    var user = req.user;
    var nameSplited = user.name.split(' ');

    var file = '';
    if(user.languageOrigin === 'pt-BR'){
        file = '6fLNZTUH0';

    }else if(user.languageOrigin === 'fr-FR'){
        file = '6fLPkVzZj';

    }else if(user.languageOrigin === 'es-MX'){
        file = '6gxgDtWeg';
    }

    var url = URL_launch
        +'&message='+file
        +'&email='+user.email
        +'&firstname='+nameSplited[0]
        +'&lastname='+nameSplited[1];

    request({
        uri: url,
        method: 'GET'

    }, function(error, response, body) {

        var retorno = JSON.parse(body);

        if(retorno.code != 200){

            pmx.notify(new Error('[ERROR][MAILLING][SPLIO][INTEGRATION] Erro ao enviar o welcome mail: '+user.email+' '+body));
            console.log('[ERROR][MAILLING][INTEGRATION] Erro ao enviar o welcome mail: '+user.email, body)
            return res.status(500).send({
                message: 'erro ao inserir o email'
            });

        }else{
            console.log('[MAILLING][SPLIO][INTEGRATION] Email Welcome enviado: '+user.email)
            return res.status(200).send({
                message: 'Welcome email para '+user.email+' enviado com sucesso'
            });
        }


    });


};



/**
 * ----------------------------------------------------------------------------------
 * PREMIOS IMPERDIVEIS
 */



exports.createContactPremiosImperdiveisByUser = function(req, res, user){
    var data = exports.buildContactPremiosImperdiveis(user, req);
    data.lists = [{'id': '1', 'name' : 'gostei.club'}];
    exports.sendUserToPremiosImperdiveis(req, res, data);

};



exports.createContactPremiosImperdiveis = function(req, res){

    var data = exports.buildContactPremiosImperdiveis(req.body, req);
    exports.sendUserToPremiosImperdiveis(req, res, data);
};


exports.buildContactPremiosImperdiveis = function(user, req){

    var firstName = '';
    var lastName = '';

    if(!(_.isEmpty(user.name))){
        var nameSplited = user.name.split(' ');
        firstName = nameSplited[0];
        lastName = nameSplited[1];
    }

    if(_.isEmpty(user.address)){
        user.address = {};
    }


    var data = {
        email: user.email,
        lang: user.languageOrigin,
        firstname : firstName,
        lastname: lastName,

        fields : [

            { id: 0, name : 'idioma',    value: 'pt-BR'},
            { id: 1, name : 'zipcode',   value: (_.isEmpty(user.address.zipcode)) ? '' :  user.address.zipcode},
            { id: 2, name : 'state',     value: (_.isEmpty(user.address.state)) ? '' :  user.address.state},
            { id: 3, name : 'city',      value: (_.isEmpty(user.address.city)) ? '' :  user.address.city},
            { id: 4, name : 'birthdate', value: (_.isEmpty(user.birthDate)) ? '' :  user.birthDate},
            { id: 5, name : 'date',      value: ''},
            { id: 6, name : 'gender',    value: (_.isEmpty(user.gender)) ? '' :  user.gender},
            { id: 7, name : 'cellphone', value: (_.isEmpty(user.cellphone)) ? '' :  user.cellphone}
        ],

        //lists : [{'id': '0'}],
        lists : [{'id': '0', 'name' : 'premios_imperdiveis'}],

        doubleoptin : [{ message : '6hvGXKLKG' }]

    };

    return data;

};




exports.sendUserToPremiosImperdiveis = function(req, res, data){

    var universe = 'premiosimperdiveis';

    var secretAPIKey = '19fdc1da9a73ebf60d2cbc4ae929b481509aaf43';
    var uri = 'https://'+universe+':'+secretAPIKey+'@s3s.fr/api/rest/1/contact'


    //var secretAPIKey = '4aa89a2f2a528209369cd29ecf56bc9e2abe4d12';
    //var uri = 'https://'+universe+':'+secretAPIKey+'@s3s.fr/api/data/1.0/contact';


    console.log(uri);
    console.log(data);


    request({
        uri: uri,
        method: 'POST',
        json: data

    }, function(error, response, body) {

        //console.log(body);

        if(body.code != 200){

            console.log('[ERROR][PREMIOS IMPERDIVEIS][INTEGRATION] Erro ao inserir o email integration: '+data.email, body.description);

            return res.status(body.code).send({
                email:data.email,
                status: body.code,
                message: body.description
            });

        }else{
            console.log('[PREMIOS IMPERDIVEIS][INTEGRATION] Email inserido: '+data.email);

            return res.status(200).send({
                email:data.email,
                status: 200,
                message: 'Contact Created'
            });
        }
    });

}



exports.updateContactPremiosImperdiveis = function(req, res){

    var data = exports.buildContactPremiosImperdiveis(req.body, req);

    request({
        uri: URL+'/contact/'+data.email,
        method: 'PUT',
        json: data

    }, function(error, response, body) {
        if(body.code != 200){
            console.log('[ERROR][MAILLING][INTEGRATION] Erro ao atualizar o email integration: '+data.email, body);
        }else{
            console.log('[MAILLING][INTEGRATION] Email atualizado: '+data.email)
        }
    });
};









