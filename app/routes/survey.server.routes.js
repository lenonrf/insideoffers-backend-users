'use strict';

module.exports = function(app) {

    var survey = require('../../app/controllers/survey');
    var users = require('../../app/controllers/users');


    app.route('/survey')
        .get(survey.list)
        .post(survey.create);

    app.route('/survey/:surveyId')
        .get(survey.read)
        .put(survey.update)
        .delete(survey.delete);
    app.param('surveyId', survey.surveyByID);


    app.route('/survey/user/:userId')
        .get(survey.listByUserSegmentation);
    app.param('userId', users.userByID);

};
