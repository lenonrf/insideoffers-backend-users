'use strict';

module.exports = function(app) {

    var canais = require('../../app/controllers/canais');
    var cache = require('express-redis-cache')();


    app.get('/canais',
        cache.route({name: 'canais'}), canais.list);
    
    app.route('/canais')
        //.get(canais.list)
        .post(canais.create);


    app.route('/canais/:canalId')
        .get(canais.read)
        .put(canais.update)
        .delete(canais.delete);
    app.param('canalId', canais.canalByID);


    app.route('/canais/:canalIdCount/count/currentday/sponsoring/:sponsorIdCurrentDay')
        .get(canais.read);
    app.param('canalIdCount', canais.canalByID);
    app.param('sponsorIdCurrentDay', canais.getDashboardCurrentDay);


    app.route('/canais/:canalIdSponsor/sponsoring/:sponsorId')
        .get(canais.read);
    app.param('sponsorId', canais.getDashboardTotal);
    app.param('canalIdSponsor', canais.canalByID);



};
