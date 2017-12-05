'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Segmentation = mongoose.model('Segmentation'),
    _ = require('lodash');



exports.buildUserSegmentated = function(user){

    var dateBirth = new Date(user.birthDate);
    var currentDate = new Date();

    return {
        age : (currentDate.getFullYear() - dateBirth.getFullYear()),
        device : user.deviceAccess,
        gender : user.gender,
        sessionLanding : user.sessionLanding,
        region : user.cellphone.substring(0, 2),
        email : user.email
    };
};



exports.getDomainBySegmentation = function(user, sessionLandingId, deviceAccess, domain) {

    user.deviceAccess = deviceAccess;
    user.sessionLanding = sessionLandingId;

    var domainsSegmentated = []
    var userSegmentated = exports.buildUserSegmentated(user);


    for(var x=0; x<domain.length; x++){

        if(domain[x].segmentation) {

            var isAvailableToUser = exports.isAvailableToUser(userSegmentated, domain[x].segmentation);
            if (isAvailableToUser) {
                domainsSegmentated.push(domain[x]);
            }

        }else{
            domainsSegmentated.push(domain[x]);
        }
    }

    return domainsSegmentated;
};



exports.isAvailableToUser = function(userSegmentated, segmentation) {

    //console.log('userSegmentated', userSegmentated.email);
    //console.log('segmentation', segmentation);
    //console.log('device', !(segmentation.device.length != 0),(segmentation.device.indexOf(userSegmentated.device) > -1));
    //console.log('sessionLanding', !(segmentation.sessionLanding.length != 0),(segmentation.sessionLanding.indexOf(userSegmentated.sessionLanding) > -1));
    //console.log('gender', !(segmentation.userSegmentation.gender.length != 0), (segmentation.userSegmentation.gender.indexOf(userSegmentated.gender) > -1));
    //console.log('isAvailableAge', exports.isAvailableAge(userSegmentated, segmentation));
    //console.log('isAvailableRegion', exports.isAvailableRegion(userSegmentated, segmentation));
    //console.log('isAvailableUserDomain', exports.isAvailableUserDomain(userSegmentated, segmentation));

    if(segmentation.device.length != 0){
        if(!(segmentation.device.indexOf(userSegmentated.device) > -1)){
            return false;
        }
    }

    if(segmentation.sessionLanding.length != 0) {
        if (!(segmentation.sessionLanding.indexOf(userSegmentated.sessionLanding) > -1)) {
            return false;
        }
    }

    if(segmentation.userSegmentation.gender.length != 0) {
        if (!(segmentation.userSegmentation.gender.indexOf(userSegmentated.gender) > -1)) {
            return false;
        }
    }

    if(!exports.isAvailableAge(userSegmentated, segmentation)){
        return false;
    }

    if(!exports.isAvailableRegion(userSegmentated, segmentation)){
        return false;
    }


    if(!exports.isAvailableUserDomain(userSegmentated, segmentation)){
        return false;
    }


    return true;
};




exports.isAvailableUserDomain = function(userSegmentated, segmentation) {

    if(segmentation.userSegmentation.domainExcludes.length != 0) {

        var userDomainsFilter = segmentation.userSegmentation.domainExcludes;

        for (var x = 0; x < userDomainsFilter.length; x++) {

            if(userSegmentated.email.indexOf(userDomainsFilter[x]) > -1){
                return false;
            }
        }
    }

    return true;
};





exports.isAvailableAge = function(userSegmentated, segmentation) {

    if(segmentation.userSegmentation.gender.length != 0) {

        var ageFilter = segmentation.userSegmentation.age;

        for (var x = 0; x < ageFilter.length; x++) {

            if (ageFilter[x].ageOperation === 'gt') {
                if (!(userSegmentated.age >= ageFilter[x].ageValue)) {
                    return false;
                }
            }

            if (ageFilter[x].ageOperation === 'lt') {
                if (!(userSegmentated.age <= ageFilter[x].ageValue)) {
                    return false;
                }
            }
        }
    }

    return true;
};




exports.isAvailableRegion = function(userSegmentated, segmentation) {

    if(segmentation.userSegmentation.region == 0) {
        return true;
    }

    var regionFilter = segmentation.userSegmentation.region;
    for (var x = 0; x < regionFilter.length; x++) {
        if (regionFilter[x].regionValue === userSegmentated.region) {
            return true;
        }
    }


    return false;

};




exports.create = function(req, res) {

    var segmentation = new Segmentation(req.body);

    segmentation.save(function(err) {
        if (err) {

            console.log('err', err);

            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(segmentation);
        }
    });
};




exports.read = function(req, res) {
    res.jsonp(req.segmentation);
};





exports.update = function(req, res) {

    var segmentation = req.segmentation;

    segmentation = _.extend(segmentation , req.body);

    segmentation.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(segmentation);
        }
    });
};





exports.delete = function(req, res) {

    var segmentation = req.segmentation;

    segmentation.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err.message)
            });
        } else {
            res.jsonp(segmentation);
        }
    });
};






exports.list = function(req, res) {

    var filterCategory = req.param('category');


    if ( (typeof filterCategory != 'undefined') && (filterCategory != 0)) {
        exports.filterByCategory(req, res, filterCategory);

    }else{

        Segmentation.find().sort('-created')
            .populate('category', 'name').exec(function(err, segmentations) {

                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err.message)
                    });
                } else {
                    res.jsonp(segmentations);
                }
            });
    }

};




exports.segmentationByID = function(req, res, next, id) {

    Segmentation.findById(id).exec(function(err, segmentation) {

        if (err) return next(err);
        if (! segmentation) return next(new Error('Failed to load Segmentation ' + id));
        req.segmentation = segmentation ;
        next();
    });
};




