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



var CoregSchema = new Schema({

    languageOrigin : {
        type: String,
        trim: true,
        default: '',
        required: true,
        validate: [validateLocalStrategyProperty, 'Preencha o languageOrigin']
    },

    code: {
        type: String,
        trim: true,
        default: ''

    },

    capping: {
        type: Number,
        default: 0

    },

    price: {
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

    questions : [{

        isCorrect: {
            type: Boolean,
            trim: true,
            default: false

        },

        text: {
            type: String,
            trim: true,
            default: ''

        }

    }],

    status: {
        type: Boolean,
        trim: true,
        default: true

    },

    link: {
        type: String,
        trim: true,
        default: ''

    },

    title: {
        type: String,
        trim: true,
        default: ''

    },

    description: {
        type: String,
        trim: true,
        default: ''

    },

    segmentation : {
        type: Schema.Types.ObjectId,
        ref: 'Segmentation'
    },

    image: {
        type: String,
        trim: true,
        default: ''

    },

    genderM: {
        type: String,
        trim: true,
        default: ''

    },

    genderF: {
        type: String,
        trim: true,
        default: ''

    },

    successPayload: {
        type: String,
        trim: true,
        default: ''

    },

    created: {
        type: Date,
        default: Date.now
    }

},{ versionKey: false });



mongoose.model('Coreg', CoregSchema);
CoregSchema.plugin(uniqueValidator);


