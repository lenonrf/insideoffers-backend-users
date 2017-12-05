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



var SurveySchema = new Schema({

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


    name: {
        type: String,
        trim: true,
        default: '',
        required: true,
        validate: [validateLocalStrategyProperty, 'Preencha o nome']
    },

    questions : [{

        text: {
            type: String,
            trim: true,
            default: ''

        },

        action: {
            type: String,
            trim: true,
            default: ''

        },

        link: {
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


    created: {
        type: Date,
        default: Date.now
    }

},{ versionKey: false });



mongoose.model('Survey', SurveySchema);
SurveySchema.plugin(uniqueValidator);


