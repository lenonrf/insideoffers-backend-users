'use strict';

module.exports = function(app) {

    var coregItem = require('../../app/controllers/coregItem');

    app.route('/coregItem')
        .get(coregItem.list)
        .post(coregItem.create);

    app.route('/coregItem/:coregItemId')
        .get(coregItem.read)
        .put(coregItem.update)
        .delete(coregItem.delete);

    app.param('coregItemId', coregItem.coregItemByID);


    app.route('/coregItem/coreg')
        .get(coregItem.listByCoregId)

    app.route('/coregItemCount')
        .get(coregItem.countByCoreg);


};
