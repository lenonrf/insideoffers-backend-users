'use strict';


module.exports = function(app) {

    var coregs = require('../../app/controllers/coregs');
    var users = require('../../app/controllers/users');
    var coregitem = require('../../app/controllers/coregItem');


    app.route('/coregs')
        .get(coregs.list)
        .post(coregs.create);

    app.route('/coregs/:coregId')
        .get(coregs.read)
        .put(coregs.update)
        .delete(coregs.delete);
    app.param('coregId', coregs.coregByID);

    app.route('/coregs/:coregIdDash/dashboard/coreg')
        .get(coregs.getDashByCoreg)
    app.param('coregIdDash', coregs.coregByID);

    app.route('/coregs/:coregIdDashStatus/dashboard/status')
        .get(coregs.getDashByStatus)
    app.param('coregIdDashStatus', coregs.coregByID);

    app.route('/coregs/:coregIdDashCount/dashboard/count')
        .get(coregs.getDashByCount)
    app.param('coregIdDashCount', coregs.coregByID);

    app.route('/coregs/user/:userId')
        .get(coregs.listByUserSegmentation);
    app.param('userId', users.userByID);


    app.route('/coregs/:coregIdByItem/coregitem')
        .get(coregitem.listByCoregId)
    app.param('coregIdByItem', coregs.coregByID);

};
