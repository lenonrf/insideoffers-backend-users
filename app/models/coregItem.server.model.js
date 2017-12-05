'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose),
    Schema = mongoose.Schema;

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

var CoregItemSchema = new Schema({

    languageOrigin : {
        type: String,
        trim: true,
        default: '',
        required: true,
        validate: [validateLocalStrategyProperty, 'Preencha o languageOrigin']
    },


    coreg : {
        type: Schema.Types.ObjectId,
        ref: 'Sponsoring'
    },

    user : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    reason: {
        type: String,
        default: ''
    },

    link: {
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


CoregItemSchema.plugin(deepPopulate, {});
mongoose.model('CoregItem', CoregItemSchema);
