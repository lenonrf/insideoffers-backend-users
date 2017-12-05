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


/**
 * Product Schema
 */
var ProductSchema = new Schema({

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

    image: {
        type: String,
        trim: true,
        default: '',
        required: true,
        validate: [validateLocalStrategyProperty, 'Preencha o nome']
    },

    category : {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },

    updated: {
        type: Date
    },

    quantity: {
        type: Number,
        default: 0
    },

    isExternalLink: {
        type: Boolean
    },

    externalLink: {
        type: String,
        trim: true,
        default: ''
    },

    created: {
        type: Date,
        default: Date.now
    }
});



mongoose.model('Product', ProductSchema);
ProductSchema.plugin(uniqueValidator);


