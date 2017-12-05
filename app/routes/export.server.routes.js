'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash'),
    request = require('request'),
    json2csv = require('json2csv'),
    fs = require('fs');

module.exports = function(app) {

    app.route('/exportbase')
        .get(function(req, res){

            var fields = ['name', 'email', 'gender', 'ddd','address.zipcode', 'created'];

            User.aggregate([
                    {$project:{
                        name:1,
                        email: 1,
                        gender:1,
                        ddd: { $substr: [ "$cellphone", 0, 2 ] },
                        'address.zipcode': 1,
                        created: 1
                        //cellphone: 1,
                        //cellphone_number: { $substr: [ "$cellphone", 2, -1 ] }
                        //'date_created': { $dateToString: { format: "%Y-%m-%d", date: "$created" } }
                    }}])/*,

                    { $match: {
                        'created': {
                            $gte: '2017-01-01T00:00:00.000Z',
                            $lt:  '2017-02-01T00:00:00.000Z'
                        }
                    }}])*/
                .sort('-created')
                //.limit(10)
                .exec(function(err, users) {

                    var opts = {
                        data: users,
                        fields: fields,
                        del : ';'
                    };

                    var result = json2csv(opts);
                    
                    fs.writeFile('file_teste.csv', result, function(err) {
                        if (err) throw err;
                        console.log('file saved');
                    });

                    res.jsonp({status: 'ok'});


            });

        });
};
