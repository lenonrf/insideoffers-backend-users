'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var RecipieSchema = new Schema({

    languageOrigin : {
        type: String,
        trim: true,
        default: '',
        required: true

    },

    name: {
        type: String,
        trim: true,
        default: ''
    },

    ingredients: [{
        type: String,
        trim: true,
        default: ''
    }],

    preparationMethod: {
        type: String,
        trim: true,
        default: ''
    },

    images: [{
        type: String,
        trim: true,
        default: ''
    }],


    indexImageCover: {
        type: Number,
        trim: true,
        default: 0
    },

    created: {
        type: Date,
        default: Date.now
    }
});



mongoose.model('Recipie', RecipieSchema);
