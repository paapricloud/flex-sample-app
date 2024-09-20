const Device = require('./deviceModel')
const handlerFactory = require('../handlerFactory/handlerFactory');
const catchAsync = require('../../utils/catchAsync')
    
exports.getAll = handlerFactory.getAll(Device);
exports.getOne = handlerFactory.getOne(Device);
exports.createOne = handlerFactory.createOne(Device);
exports.updateOne = handlerFactory.updateOne(Device);
exports.deleteOne = handlerFactory.deleteOne(Device);
    
exports.getList = handlerFactory.listSearch(Device);
exports.totalCount = handlerFactory.getCount(Device);
exports.findAll = handlerFactory.findAll(Device);  
