'use strict';

module.exports = function(app) {

    var oportunities = require('../../app/controllers/oportunities');
    var users = require('../../app/controllers/users');
    var sessionLanding = require('../../app/controllers/sessionLanding');


    //var cache = require('express-redis-cache')();

    //app.get('/oportunities',
      //  cache.route({name: 'oportunities'}, 900), oportunities.list);


    app.route('/oportunities')
        .get(oportunities.list)
        .post(oportunities.create);

    app.route('/oportunities/:oportunityId')
        .get(oportunities.read)
        .put(oportunities.update)
        .delete(oportunities.delete);
    app.param('oportunityId', oportunities.oportunityByID);

    app.route('/oportunities/user/:userId')
        .get(oportunities.listByUserSegmentation);
    app.param('userId', users.userByID);

};
