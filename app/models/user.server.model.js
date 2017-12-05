'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var extend = require('mongoose-schema-extend');
var uniqueValidator = require('mongoose-unique-validator');


/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};


/**
 * User Schema
 */
var UserSchema = new Schema({

	languageOrigin : {
		type: String,
		trim: true,
		default: '',
		required: true,
		validate: [validateLocalStrategyProperty, 'Preencha o languageOrigin']
	},

	trafficOrigin : {
		type: String, 
		trim: true,
		default: ''
	},

	origin : {
		type: String,
		trim: true,
		default: ''
	},

	ip : {
		type: String,
		trim: true,
		default: ''
	},

	score : {
		type: Number,
		default: 0
	},
	
	name: {
		type: String,
		trim: true,
		default: '',
		required: true,
		validate: [validateLocalStrategyProperty, 'Preencha o nome']
	},


	email: {
		type: String,
		trim: true,
		default: '',
		required: true,
		unique: 'O email já existe',
		validate: [validateLocalStrategyProperty, 'Preencha o email'],
		match: [/.+\@.+\..+/, 'Preencha o email']
	},

	gender: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Preencha o sexo']
	},

	
	updated: {
		type: Date
	},


	birthDate: {
		type: Date,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Preencha a data de nascimento']
	},

	cellphone: {
		type: String,
		trim: true,
		default: ''
	},

	status: {
        type: Boolean,
        trim: true,
        default: true

    },

	telephone: {
		type: String,
		trim: true,
		default: ''
	},

	canal : {
		type: Schema.Types.ObjectId,
		ref: 'Canal'
	},

	address : {
		street: {
			type: String,
			trim: true,
			default: ''
		},
		number: {
			type: String,
			trim: true,
			default: ''
		},
		complement: {
			type: String,
			trim: true,
			default: ''
		},
		neighborhood: {
			type: String,
			trim: true,
			default: ''
		},
		zipcode: {
			type: String,
			trim: true,
			default: ''
		},
		city: {
			type: String,
			trim: true,
			default: ''
		},
		state: {
			type: String,
			trim: true,
			default: ''
		}
	},

    products : [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],


	created: {
		type: Date,
		default: Date.now
	}
},{ versionKey: false });
//},{ collection : 'users', versionKey: false, discriminatorKey : '_type' });


//var UsersFRSchema = UserSchema.extend({});
//var UsersBRSchema = UserSchema.extend({})


mongoose.model('User', UserSchema);
//mongoose.model('UserFR', UsersFRSchema);
//mongoose.model('UserBR', UsersBRSchema);

UserSchema.plugin(uniqueValidator);


