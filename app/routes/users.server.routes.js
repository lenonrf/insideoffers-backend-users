'use strict';



module.exports = function(app) {

	var users = require('../../app/controllers/users');
	var sponsoring = require('../../app/controllers/sponsoring');
    var coreg = require('../../app/controllers/coregs');


    app.route('/users/ranking')
		.get(users.getRanking);

	app.route('/users')
		.get(users.list)
		.post(users.create);


	app.route('/users/:userId/products/')
		.put(users.addProduct);


	app.route('/users/:userIdProduct/products/:productId')
		.delete(users.removeProduct);
    app.param('userIdProduct', users.userByID);


	app.route('/users/:userId')
		.get(users.read)
		.delete(users.delete);
    app.param('userId', users.userByID);


	app.route('/users/email/:emailValue')
		.get(users.read)
        .put(users.update);
    app.param('emailValue', users.userByEmail);


    app.route('/users/:userIdSponsor/sponsoring')
        .post(sponsoring.sendSponsoring);
	app.param('userIdSponsor', users.userByID);


	app.route('/users/:userIdCoreg/coreg')
        .post(coreg.sendCoreg);
    app.param('userIdCoreg', users.userByID);

};
