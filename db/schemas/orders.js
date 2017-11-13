'use strict';

var Mongoose  = require('mongoose');

/**
 * A sample order product database that is created by ChaoticBanter
 * Used to demonstrate the power of conversational commerce
 * This database is used by microservices triggered through microplex
 */
var orderSchema = new Mongoose.Schema({
    rowid: { type: String, required: true },
    orderid:{ type: String, required: true },
    orderdate: String,
    orderpriority: String,
    orderquantity: Number,
    salesamt: Number,
    discount: Number,
    shipmode: String,
    profit: Number,
    unitprice: Number,
    shippingcost: Number,
    customername: String,
    state: String,
    region: String,
    marketsegment: String,
    productcategory: String,
    productname: String,
    productcontainer: String,
    productmargin: Number,
    shipdate: String
});

var orderModel = Mongoose.model('order', orderSchema);

module.exports = orderModel;
