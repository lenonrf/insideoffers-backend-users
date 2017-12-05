'use strict';

module.exports = function(app) {

    var sponsoringItem = require('../../app/controllers/sponsoringItem');

    app.route('/sponsoringItem')
        .get(sponsoringItem.list)
        .post(sponsoringItem.create);

    app.route('/sponsoringItem/:sponsoringItemId')
        .get(sponsoringItem.read)
        .put(sponsoringItem.update)
        .delete(sponsoringItem.delete);

    app.param('sponsoringItemId', sponsoringItem.sponsoringItemByID);


    app.route('/sponsoringItem/sponsor/:sponsorId/canal/:canalId')
        .get(sponsoringItem.read);

    app.param('canalId', sponsoringItem.read);
    app.param('sponsorId', sponsoringItem.getCanalDashboardBySponsor);


    app.route('/sponsorItemCount')
        .get(sponsoringItem.countBySponsor);


};
