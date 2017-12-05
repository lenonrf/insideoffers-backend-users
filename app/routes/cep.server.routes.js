'use strict';

var request = require('request');


module.exports = function(app) {


    app.route('/cep/:cepNumber')
		.get(function(req, res) {
            res.jsonp(JSON.parse(req.dataCep));
    	});

		
	app.param('cepNumber', function(req, res, next, id){

			request({
                        uri: 'https://viacep.com.br/ws/'+id+'/json',
                        method: 'GET'

                    }, function (error, response, body) {

                    	if(body.indexOf('<h2>') > -1){
							res.jsonp({status: 400});
                    	
                    	}else{
							req.dataCep = body ;
							next();               
                    	}

                    });
		});

};
