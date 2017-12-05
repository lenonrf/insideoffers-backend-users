
'use strict';

module.exports = function(app) {

    var mailing = require('../../app/controllers/mailing');
    var users = require('../../app/controllers/users');

    app.route('/malling/contact')
        .post(mailing.createContact);


    app.route('/malling/contact/:emailValue')
        .put(mailing.updateContact);
    app.param('emailValue', users.userByEmail);


    app.route('/malling/welcome/:emailValue')
        .post(mailing.sendWelcomeMail);
    app.param('emailValue', users.userByEmail);


};
