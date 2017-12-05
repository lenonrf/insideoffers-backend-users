'use strict';

var request = require('request');

module.exports = function(app) {


    app.route('/coupons')
		.get(function(req, res){

			request({
                uri: 'http://bws.buscape.com.br/service/coupons/lomadee/6b6e7253714c4c302b7a6b3d/BR/?format=json&results=30&sourceId=35637053&categoryIds=99011,99007,77,99003,99002,99004,99008,99006&page=1',
                method: 'GET'

            }, function (error, response, body) {

            	/*console.log('');
            	console.log('');console.log('');console.log('');
            	console.log('### error', error);
            	console.log('### response', response);
            	console.log('### body', body);*/

              	res.jsonp(JSON.parse(body));

            });
		});

};
