'use strict';

module.exports = function(app) {

    var categories = require('../../app/controllers/rootCategory');


    var cache = require('express-redis-cache')();

    app.get('/categories',
        cache.route({name: 'rootCategories'}), categories.list);

    app.route('/categories')
        //.get(categories.list)
        .post(categories.create);

    app.route('/categories/:categoryId')
        .get(categories.read)
        .put(categories.update)
        .delete(categories.delete);

    app.param('categoryId', categories.rootCategoryByID);

};
