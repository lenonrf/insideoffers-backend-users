'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    UserFR = mongoose.model('UserFR'),
    _ = require('lodash'),
    pmx = require('pmx'),
    allin = require('./allin');



/**
 * Show the current User
 */
exports.read = function(req, res) {
    res.jsonp(req.user);
};



/**
 * List of Users
 */
exports.list = function(req, res) {


    UserFR.find({languageOrigin: req.get('x-language-origin')})
        .sort('-created').populate('products', '_id').exec(function(err, users) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};




/**
 * Create a User
 */
exports.create = function(req, res) {

    var userFR = new UserFR(req.body);

    if(userFR.languageOrigin != 'fr-FR'){
        return res.status(405).send({
            message: 'languageOrigin not allowed'
        });
    }

    userFR.save(function(err) {

        if(_.isEmpty(err)){

            console.log('[USER][FR][CREATE]['+userFR.email+'] Usuario criado ', userFR._id);
            allin.insertEmail(userFR, userFR.languageOrigin);
            res.jsonp(userFR);
            return null;
        }

        if (err.name === 'ValidationError') {

            if( err.errors.email){

                console.log('[USER][FR][CREATE]['+err.errors.email.value+'] Email ja existe ');

                return res.status(409).send({
                    email : err.errors.email.value,
                    message: errorHandler.getErrorMessage(err)
                });
            }


            if( err.errors.languageOrigin){

                console.log('[USER][FR][CREATE][VALIDATION ERROR] languageOrigin is required');

                return res.status(409).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }



        }else if(err){

            pmx.notify(new Error('[USER][FR][CREATE]['+userFR.email+'] Erro ao criar '+err+' \n BODY \n'+userFR));
            console.log('[USER][FR][CREATE] Erro ao criar ', err.name, 'BODY', user);

            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }


    });

};



/**
 * Update a User
 */
exports.update = function(req, res) {

    var userFR = req.user;
    userFR = _.extend(userFR , req.body);

    if(userFR.languageOrigin != 'fr-FR'){
        return res.status(405).send({
            message: 'languageOrigin not allowed'
        });
    }

    userFR.save(function(err) {

        if (err) {

            console.log('[USER][FR][UPDATE]['+userFR.email+'] Erro ao atualizar User ', err);
            pmx.notify(new Error('[USER][FR][UPDATE]['+userFR.email+'] Erro ao atualizar '+err));

            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });

        } else {

            console.log('[USER][FR][UPDATE]['+userFR.email+'] Usuario atualizado: ');
            allin.insertEmail(userFR, userFR.languageOrigin);
            res.jsonp(userFR);
        }
    });
};



/**
 * User middleware
 */
exports.userByEmail= function(req, res, next, email) {


    UserFR.findOne({ email: email })
        .populate('products')
        .populate('canal', '_id, name').exec(function(err, user) {

            if (err){
                return res.status(500).send({
                    message: errorHandler.getErrorMessage('Erro ao carregar usuario')
                });
            }

            if (!user){
                return res.status(404).send({
                    message: errorHandler.getErrorMessage('Usuario não encontrado')
                });
            }

            req.user = user ;
            next();
        });
};








exports.addProduct = function(req, res, userId){

    var user = req.user;

    user.update(
        { _id: userId },
        { $push: { products: req.body }  },
        {safe: true, upsert: true},

        function(err, model) {
            pmx.notify(new Error('[USER][ADD PRODUCT][ERROR] Erro ao inserir o produto: '+err));
            console.log('[USER][ADD PRODUCT][ERROR] Erro ao inserir o produto: ', err);
        }
    );

};


exports.removeProduct = function(req, res, userId, productId){

    var user = req.user;

    user.update(
        { _id: userId },
        { $pull: { 'contact.phone': { products: productId } } }
    );

};

















/**
 * Delete an User
 */
exports.delete = function(req, res) {

    var user = req.user;

    user.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(user);
        }
    });
};



/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {

    UserFR.findById(id).populate('products', '_id').exec(function(err, user) {
        if (err) return next(err);
        if (! user) return next(new Error('Failed to load User ' + id));
        req.user = user ;
        next();
    });
};










/**
 * User authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.user.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
