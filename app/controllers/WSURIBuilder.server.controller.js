'use strict';

var HashMap = require('hashmap');



/**
 * Insere os dados do usuario na url
 * @param sponsor
 * @param user
 * @returns {*}
 */
exports.buildURI = function (domain, user){

    var link = domain.link;
    var fieldsMap = exports.getFieldsMap(domain, user);

    fieldsMap.forEach(function(value, key) {
        if(link.indexOf(key) > -1){
            link = link.replace(key, value);
        }
    });

    return link;

};




/**
 * Retorno o objeto de configuracao responsavel pelos campos de url
 * @param sponsor
 * @param user
 * @returns {*}
 */
exports.getFieldsMap = function(domain, user){

    var name = user.name.split(' ');

    var fieldsMap = new HashMap();
    fieldsMap.set('<email>', user.email);
    fieldsMap.set('<name>', name[0]);
    fieldsMap.set('<lastName>', name[1]);
    fieldsMap.set('<state>', user.address.state);
    fieldsMap.set('<city>', user.address.city);
    fieldsMap.set('<zipcode>', user.address.zipcode);
    fieldsMap.set('<birthDate>', exports.getUserBirthDateFormated(user));
    fieldsMap.set('<wish>', exports.getRandonWish());
    fieldsMap.set('<gender>', exports.getGender(domain, user));
    fieldsMap.set('<cellphone>', user.cellphone);
    fieldsMap.set('<telephone>', user.telephone);
    fieldsMap.set('<ip>', exports.getRandonIP(user));
    fieldsMap.set('<currentDate>', exports.getCurrentDate());

    var birthDate = new Date(user.birthDate);
    fieldsMap.set('<birthDay>', exports.getBirthDay(birthDate));
    fieldsMap.set('<birthMonth>', exports.getBirthMonth(birthDate));
    fieldsMap.set('<birthYear>', birthDate.getFullYear());

    return fieldsMap;
};




exports.getBirthDay = function (birthDate){
  return (birthDate.getDate() < 10) ? '0'+birthDate.getDate() : birthDate.getDate();
};

exports.getBirthMonth = function (birthDate){
    return ( (birthDate.getMonth()+1) < 10) ? '0'+(birthDate.getMonth()+1) : birthDate.getMonth()+1;
};


/**
 * Retorna a data de nascimento formatada
 * @param user
 * @returns {string}
 */
exports.getUserBirthDateFormated = function (user){

    var birthDate = new Date(user.birthDate);
    return birthDate.getDate()+'-'+(birthDate.getMonth()+1)+'-'+birthDate.getFullYear();
};



/**
* Retorna a data de nascimento formatada
* @param user
* @returns {string}
*/
exports.getCurrentDate = function (){

    var now = new Date();
    var year = now.getFullYear();
    var month = ( (now.getMonth()+1) < 10) ? '0'+(now.getMonth()+1) : now.getMonth()+1;
    var day = (now.getDate() < 10) ? '0'+now.getDate() : now.getDate();

    return year+'-'+month+'-'+day+ ' 00:00:00';
};




/**
 * Retorna um campo de tipo 'wish' com valor pre-definido aleatorio
 * @returns {string}
 */
exports.getRandonWish = function(){

    var wish = ['Trabalho', 'Dinheiro', 'Familia', 'Sorte', 'Vitalidade', 'Amor'];
    var randWish = wish[Math.floor(Math.random() * wish.length)];

    return randWish;
};




/**
 * Retorna o sexo formatado para o webservice do canal
 * @param sponsor
 * @param user
 * @returns {*}
 */
exports.getGender = function (domain, user){

    switch(user.gender) {

        case 'M':
            return domain.genderM;
            break;

        case 'F':
            return domain.genderF;
            break;
    }


    /*switch(domain.code){

        case 'tara':
            return user.gender === 'M' ? 'Sr' : 'Sra';
            break;

        case 'chris':
            return user.gender === 'M' ? '1' : '2';
            break;

        case 'oqueha':
            return user.gender === 'M' ? 'mr' : 'mme';
            break;

        case 'estrelafone':
            return user.gender === 'M' ? 'M' : 'F';
            break;

        case 'PierreRicaud':
            return user.gender === 'M' ? '1' : '2';
            break;
    }*/
};



exports.getRandonIP = function(user){

    if(user.languageOrigin === 'pt-BR'){

        var ip_1 = '200.10.227.'+ Math.floor(Math.random()*21)
        var ip_2 = '200.10.245.'+ Math.floor(Math.random()*21)
        var ip_3 = '200.11.0.'  + Math.floor(Math.random()*21)
        var ip_4 = '200.11.8.'  + Math.floor(Math.random()*21)
        var ip_5 = '200.11.16.' + Math.floor(Math.random()*21)
        var ip_6 = '200.11.24.' + Math.floor(Math.random()*21)
        var ip_7 = '200.11.28.' + Math.floor(Math.random()*21)
        var ip_8 = '200.12.0.'  + Math.floor(Math.random()*21)
        var ip_9 = '200.12.8.'  + Math.floor(Math.random()*21)
        var ip_0 = '200.12.131.'+ Math.floor(Math.random()*21)

        var range = [ip_1, ip_2, ip_3, ip_4, ip_5, ip_6, ip_7, ip_8, ip_9, ip_0];
        var randWish = range[Math.floor(Math.random() * range.length)];

        return randWish;
    }



    if(user.languageOrigin === 'fr-FR'){

        var ip_1 = '91.212.21.'+ Math.floor(Math.random()*21)
        var ip_2 = '91.223.253.'+ Math.floor(Math.random()*21)
        var ip_3 = '87.238.176.'  + Math.floor(Math.random()*21)
        var ip_4 = '178.251.248.'  + Math.floor(Math.random()*21)
        var ip_5 = '185.36.216.' + Math.floor(Math.random()*21)
        var ip_6 = '192.190.69.' + Math.floor(Math.random()*21)
        var ip_7 = '194.110.207.' + Math.floor(Math.random()*21)
        var ip_8 = '217.119.128.'  + Math.floor(Math.random()*21)
        var ip_9 = '193.164.156.'  + Math.floor(Math.random()*21)
        var ip_0 = '155.133.128.'+ Math.floor(Math.random()*21)

        var range = [ip_1, ip_2, ip_3, ip_4, ip_5, ip_6, ip_7, ip_8, ip_9, ip_0];
        var randWish = range[Math.floor(Math.random() * range.length)];

        return randWish;
    }


};












