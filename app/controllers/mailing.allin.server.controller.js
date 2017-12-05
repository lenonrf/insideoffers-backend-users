'use strict';

var soap = require('soap'),
    notifyError = require('./notify.error'),
    _ = require('lodash');


var URL_LOGIN  = 'http://painel02.allinmail.com.br/wsAllin/login.php?wsdl';
var URL_INSERT = 'http://painel02.allinmail.com.br/wsAllin/inserir_email_base.php?wsdl';


var accounts = [
    {
        name: 'newsgostei',
        login: 'WSnewsgostei',
        senha: '20160613FESCSE',
        lists: [
            { origin:'pt-BR', name: 'gosteiclub' }
        ]
    },
    {
        name: 'zoradamus',
        login: 'WSzoradamus',
        senha: '28042016OPR57',
        lists: [
            { origin:'pt-BR', name: 'gostei.club' }
        ]
    },
    {
        name: 'promocaonanet',
        login: 'WSpromocaonanet',
        senha: '10062016@TWXP',
        lists: [
            { origin:'pt-BR', name: 'gostei.club' }
        ]
    }
];



exports.createContact = function(user){

    for(var x=0; x<accounts.length; x++){

        var lists = exports.getListsByOrigin(accounts[x].lists, user.languageOrigin);

        for(var y=0; y<lists.length; y++){
            exports.executeIntegration(user, accounts[x], lists[y].name);
        }
    }

};



exports.getListsByOrigin = function(lists, languageOrigin) {

    var listsReturned = [];

    for (var x = 0; x < lists.length; x++) {

        if(lists[x].origin === languageOrigin){
            listsReturned.push(lists[x]);
        }
    }

    return listsReturned;
};





exports.executeIntegration = function(user, account, list){

    return null;

    soap.createClient(URL_LOGIN, function(err, client) {
        client.getTicket({login: account.login, senha:account.senha}, function (err, result) {

            if (err === 'null') {
                notifyError.notify('[ALLIN]['+account.name+'][CREATE][ERROR] Erro ao inserir o email: '+user+' [RESULT]: '+result);
                return;
            }

            exports.callAllinIntegration(result.return.$value, user, account.name, list);
        })
    });
};




exports.callAllinIntegration = function (ticket, user, originAccount, list){

    var args = getDadosUserIntegration(ticket, user, list, originAccount);

    soap.createClient(URL_INSERT, function(err, client) {
        client.inserirEmailBase(args, function(err, result) {

            if(err !== 'null'){
                console.log('[ALLIN]['+originAccount+']['+user.languageOrigin+'][INTEGRATION]['+user.email+']: ', result.return.$value, err);
            }else{
                notifyError.notify('[ALLIN][INTEGRATION] Erro ao inserir o email integration: '+args);
            }
        });
    });
};





var getDadosUserIntegration = function(ticket, user, lista, originAccount){

    var name = (_.isEmpty(user.name)) ? '' :  user.name;
    var gender = (_.isEmpty(user.gender)) ? '' :  user.gender;
    var cellphone = (_.isEmpty(user.cellphone)) ? '' :  user.cellphone;
    var state = (_.isEmpty(user.address.state)) ? '' :  user.address.state;
    var city = (_.isEmpty(user.address.city)) ? '' :  user.address.city;
    var zipcode = (_.isEmpty(user.address.zipcode)) ? '' :  user.address.zipcode;
    var complement = (_.isEmpty(user.address.complement)) ? '' :  user.address.complement;
    var number = (_.isEmpty(user.address.number)) ? '' :  user.address.number;
    var neighborhood = (_.isEmpty(user.address.neighborhood)) ? '' :  user.address.neighborhood;
    var birthDate = (_.isEmpty(user.birthDate)) ? '' : user.birthDate.substr(0, 10);

    var valores = user.email
        +';'+name +';'+gender +';'+cellphone +';'
        +';'+state +';'+city +';'+zipcode +';'+complement +';'+number +';'+neighborhood
        +';'+birthDate +';'+user.created.substr(0, 10);


    var campos = 'nm_email;nome;sexo;celular;endereco;estado;cidade;cep;complemento;numero' +
            ';bairro;dt_nascimento;dt_cadastro';

    switch(originAccount){

        case 'newsgostei':
            campos = 'nm_email;nome;sexo;telefone;endereco;estado;cidade;cep;complemento;numero' +
                ';bairro;dt_nascimento;dt_cadastro';
            break;

    }


    var dados = {
        ticket: ticket,
        dados : {
            nm_lista : lista,
            campos: campos,
            valor: valores
        }
    };

    return dados;

};
