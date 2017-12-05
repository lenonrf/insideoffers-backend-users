'use strict';

module.exports = function(app) {

    var categories = require('../../app/controllers/categories');

    var cache = require('express-redis-cache')();

    app.get('/products/categories',
        cache.route({name: 'categories'}), categories.list);

    app.route('/products/categories')
        //.get(categories.list)
        .post(categories.create);

    app.route('/products/categories/:categoryId')
        .get(categories.read)
        .put(categories.update)
        .delete(categories.delete);

    app.param('categoryId', categories.categoryByID);

};
