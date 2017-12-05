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



var SponsoringSchema = new Schema({

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
        default: ''

    },

    link: {
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

    partner: {

        isPartner : {
            type: Boolean,
            default :false
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

        url: {
            type: String,
            trim: true,
            default: ''
        },

        image: {
            type: String,
            trim: true,
            default: ''
        }
    },

    canais : [{

        canal : {
            type: Schema.Types.ObjectId,
            ref: 'Canal'
        },

        leadsLimit: {
            type: Number,
            default: 0
        },

        status: {
            type: Boolean,
            default: Boolean.true
        },

        type: {
            type: String,
            default: ''
        }
    }],

    status: {
        type: Boolean,
        trim: true,
        default: true

    },

    capping: {
        type: Number,
        default: 0

    },


    segmentation : {
        type: Schema.Types.ObjectId,
        ref: 'Segmentation'
    },

    created: {
        type: Date,
        default: Date.now
    }
},{ versionKey: false });



mongoose.model('Sponsoring', SponsoringSchema);
SponsoringSchema.plugin(uniqueValidator);


