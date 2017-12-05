'use strict';

module.exports = function(app) {

    var dashboard = require('../../app/controllers/dashboard');

    app.route('/dashboard/users/count')
        .get(dashboard.countUsers);


    app.route('/dashboard/users/gender')
        .get(dashboard.countUsersByGender);

    app.route('/dashboard/users/trafficsource')
        .get(dashboard.countUsersByTrafficSource);


    app.route('/dashboard/users/')
        .get(dashboard.countUsersByDate);


};
