'use strict';

module.exports = function(app) {

    var sessionLanding = require('../../app/controllers/sessionLanding');

    var cache = require('express-redis-cache')();
    
    app.route('/sessionLandings')
        .get(sessionLanding.list)
        .post(sessionLanding.create);

    app.route('/sessionLandings/:sessionLandingId')
        .get(sessionLanding.read)
        .put(sessionLanding.update)
        .delete(sessionLanding.delete);

    app.param('sessionLandingId', sessionLanding.sessionLandingByID);


};
