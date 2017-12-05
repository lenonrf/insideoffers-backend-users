'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');


/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};



var CanalSchema = new Schema({

    languageOrigin : {
        type: String,
        trim: true,
        default: '',
        required: true,
        validate: [validateLocalStrategyProperty, 'Preencha o languageOrigin']
    },

    name: {
        type: String,
        trim: true,
        default: '',
        required: true,
        validate: [validateLocalStrategyProperty, 'Preencha o nome']
    },

    code: {
        type: String,
        trim: true,
        default: '',
        required: true,
        validate: [validateLocalStrategyProperty, 'Preencha o codigo']
    },

    status: {
        type: Boolean,
        default: Boolean.true
    },

    created: {
        type: Date,
        default: Date.now
    }
});



mongoose.model('Canal', CanalSchema);
CanalSchema.plugin(uniqueValidator);
