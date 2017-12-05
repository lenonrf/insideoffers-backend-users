'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var RandomKeySchema = new Schema({

    region: {
        type: String,
        trim: true,
        default: ''
    },

    key: {
        type: String,
        trim: true,
        default: '',
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



mongoose.model('RandomKey', RandomKeySchema);
