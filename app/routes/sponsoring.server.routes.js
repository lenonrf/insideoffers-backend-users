'use strict';

module.exports = function(app) {

    var sponsoring = require('../../app/controllers/sponsoring'),
        sponsoritem = require('../../app/controllers/sponsoringItem');


    app.route('/sponsoring')
        .get(sponsoring.list)
        .post(sponsoring.create);


    app.route('/sponsoring/:sponsoringId')
        .get(sponsoring.read)
        .put(sponsoring.update)
        .delete(sponsoring.delete);

    app.param('sponsoringId', sponsoring.sponsoringByID);

    app.route('/sponsoring/:sponsoringIdDashStatus/dashboard/status')
        .get(sponsoring.getDashByStatus)
    app.param('sponsoringIdDashStatus', sponsoring.sponsoringByID);

    app.route('/sponsoring/:sponsoringIdDashCount/dashboard/count')
        .get(sponsoring.getDashByCount)
    app.param('sponsoringIdDashCount', sponsoring.sponsoringByID);

    app.route('/sponsoring/:sponsoringIdDash/dashboard/sponsoring')
        .get(sponsoring.getDashBySponsor)
    app.param('sponsoringIdDash', sponsoring.sponsoringByID);


    app.route('/sponsoring/:sponsorIdByItem/sponsoritem')
        .get(sponsoritem.listBySponsorId)
    app.param('sponsorIdByItem', sponsoring.sponsoringByID);

};
