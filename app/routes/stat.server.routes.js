
'use strict';

module.exports = function(app) {

    var stat = require('../../app/controllers/stat');

    app.route('/stat/offer/:offerID')
        .get(stat.getStats);



};
