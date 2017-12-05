'use strict';

module.exports = function(app) {

    var recipies = require('../../app/controllers/recipies');
   
    app.route('/recipie')
        .get(recipies.list)
        .post(recipies.create);


    app.route('/recipie/:recipieId')
        .get(recipies.read)
        .put(recipies.update)
        .delete(recipies.delete);
    app.param('recipieId', recipies.recipieByID);




};
