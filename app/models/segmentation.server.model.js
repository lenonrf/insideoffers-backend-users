'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var segmentationSchema = new Schema({


    sessionLanding : [{
        type: Schema.Types.ObjectId,
        ref: 'SessionLanding'
    }],

    device: [{
        type: String,
        default: ''
    }],


    userSegmentation: {

        age: [{

            ageValue: {
                type: String,
                default: ''
            },

            ageOperation: {
                type: String,
                default: ''
            }
        }],


        gender: [{
            type: String,
            default: ''
        }],


        region: [{

            regionValue: {
                type: String,
                default: ''
            }
        }],

        domainExcludes: [{
            type: String,
            default: ''
        }]

    },

    created: {
        type: Date,
        default: Date.now
    }

},{ versionKey: false });


mongoose.model('Segmentation', segmentationSchema);
