'use strict';


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');


var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};


var OportunitySchema = new Schema({

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
        validate: [validateLocalStrategyProperty, 'Preencha o Titulo']
    },

    segmentation : {
        type: Schema.Types.ObjectId,
        ref: 'Segmentation'
    },


    title: {
        type: String,
        trim: true,
        default: '',
        required: true,
        validate: [validateLocalStrategyProperty, 'Preencha o Titulo']
    },

    image: {
        type: String,
        trim: true,
        default: '',
        required: true,
        validate: [validateLocalStrategyProperty, 'Preencha a descrição']
    },

    description: {
        type: String,
        trim: true,
        default: '',
        required: true,
        validate: [validateLocalStrategyProperty, 'Preencha a descrição']
    },

    urlAnswer: {
        type: String,
        trim: true,
        default: '',
        required: true,
        validate: [validateLocalStrategyProperty, 'Preencha o URL']
    },

    status :{
        type: Boolean,
        default: false
    },

    isQuestion :{
        type: Boolean,
        default: false
    },

    categories : [{
        type: Schema.Types.ObjectId,
        ref: 'RootCategory'
    }],

    index :{
        type: Number,
        default: null
    },

    created: {
        type: Date,
        default: Date.now
    }
});



mongoose.model('Oportunity', OportunitySchema);
OportunitySchema.plugin(uniqueValidator);


