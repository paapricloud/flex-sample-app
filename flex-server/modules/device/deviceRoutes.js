const express = require('express');
const deviceController = require('./deviceController');
// const authController = require('../appAuth/authController')
    
const router = express.Router();
    
// Protect all routes after this middleware
// router.use(authController.protect);

    
router.route('/list')
    .get(deviceController.getList)

router.route('/list/:fieldId')
    .get(deviceController.getList)

router.route('/flexgrid/count')
    .get(deviceController.totalCount)
router.route('/flexgrid')
    .get(deviceController.findAll)
            
router.route('/')
    .get(deviceController.getAll)
    .post(deviceController.createOne)
    
router.route('/:id')
    .get(deviceController.getOne)
    .patch(deviceController.updateOne)
    .delete(deviceController.deleteOne)
    
module.exports = router;