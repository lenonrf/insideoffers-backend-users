'use strict';

module.exports = function(app) {

    var segmentation = require('../../app/controllers/segmentation');

    app.route('/segmentations')
        .get(segmentation.list)
        .post(segmentation.create);

    app.route('/segmentations/:segmentationId')
        .get(segmentation.read)
        .put(segmentation.update)
        .delete(segmentation.delete);

    app.param('segmentationId', segmentation.segmentationByID);


};
