'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};


var SessionLandingSchema = new Schema({

    languageOrigin : {
        type: String,
        trim: true,
        default: '',
        required: true,
        validate: [validateLocalStrategyProperty, 'Preencha o languageOrigin']
    },

    name: {
        type: String,
        default: ''
    },

    code: {
        type: String,
        default: ''
    },

    status: {
        type: Boolean
    },

    created: {
        type: Date,
        default: Date.now
    }

},{ versionKey: false });


mongoose.model('SessionLanding', SessionLandingSchema);
