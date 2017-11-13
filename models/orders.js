'use strict';

var orderModel   = require('../db').models.order;

var create = function (data, callback){
	var newOrder = new orderModel(data);
	newOrder.save(callback);
};

var find = function (data, callback){
	orderModel.find(data, callback);
}

var findOne = function (data, callback){
	orderModel.findOne(data, callback);
}

var findById = function (id, callback){
	orderModel.findById(id, callback);
}

var findByIdAndUpdate = function(id, data, callback){
	orderModel.findByIdAndUpdate(id, data, { new: true }, callback);
}

module.exports = {
	create,
	find,
	findOne,
	findById,
	findByIdAndUpdate
};
