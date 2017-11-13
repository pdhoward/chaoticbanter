
////////////////////////////////////////////////////
////////  			RedisLab and HTTP SERVER     ///////
///////            version 0.5.0            ///////
//////////////////////////////////////////////////

'use strict';
const config 	=       require('./config');
const order =         require('./models/orders');
const express =       require('express');
const path  =         require('path');
const banterfile =    require('./texts');
const countries =     require('./countries/country')
const Redis =         require('ioredis');
const fs =            require("fs");
const XLSX =          require("xls-to-json");

const app =  express();
const server =        require('http').Server(app);
const port = process.env.PORT || 3002;

////////////////////////////////////////////////
let redisPort =     config.redis.port;
let redisHost =     config.redis.host;
let redisPassword = config.redis.password;

let redis = new Redis({
 port: redisPort,
 host: redisHost
});

let pub = new Redis({
 port: redisPort,
 host: redisHost

});


// cli command line
let action = process.argv[2];

/////////////////////// arrays with additional data to decorate the text messages ////////////////

let img = ['1', '2', '3', '4', '5', '6', '7', '8', 'chatbot', 'helpbot', 'smartbot']

let orders = []

// if the order.json file does not exist import the test spreadsheet with 8000+ order items
// to save json file set output to products/products.json -- else set to null
// Delete the order collection in session db on monglab if json file removed here

if (!fs.existsSync("products/orders.json")) {

  XLSX({
    input: "products/samplesales.xls",
    output: "products/orders.json",
    sheet: "Orders"
  }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
      console.log(result[0]['customername'])
      console.log(result[0]['salesamt'])
      // this creates the order collection in session on mongodb
      // used by microplex microservices for ai interactions
      result.filter((item) => {
        order.save((item), () => {
          // do nothing on callback
        })
      })

    }
  })
}

switch (action) {
  case "banter":
    banter()
    break;

  case "product":
    product();
    break;

}

// subscribe to a channel
redis.subscribe(action, function (err, count) {
			console.log("Subscribed to " + count + " channel")
  });

// log message when detected on redis channel
redis.on('message', function (channel, message) {
    console.log("Channel> " + channel + " Message> " + message);
  });

// publish messages randomly -- test runner for chaotic platform
// add a country name and avatar chosen randomly from arrays
function streambanter() {
  let msgObj = banterfile[Math.floor(Math.random() * banterfile.length)];
  msgObj.flagURL = config.target + "/img/flags/" + countries[Math.floor(Math.random() * countries.length)].name + ".png"
  msgObj.avatarURL = config.target + "/img/avatars/" + img[Math.floor(Math.random() * img.length)] + ".jpg"
  var sendMsg = JSON.stringify(msgObj)
  pub.publish(action, sendMsg);

}

function banter() {
  setInterval(function() {
  console.log('bantering');
  streambanter()
}, 5000)};


// create a test file from the banter file, randomly updated with product, pricing info
// This serves as the basis for deeper testing on the chaotic platform

function prepproducts(cb) {
  let id = 0
  let msgObj = {}
  let productObj = {}
  let productarray = banterfile.filter((msg) => {
    id++
    //productObj = productfile[Math.floor(Math.random() * productfile.length)];
    //    msgObj.text = productObj.text
    msg.id = id
    msg.name = order[Math.floor(Math.random() * order.length)].customername
    return msg
  })
  cb(productarray)
}


const streamproducts = (arr) => {
  let sendObj = arr[Math.floor(Math.random() * arr.length)];
  sendObj.flagURL = config.target + "/img/flags/" + countries[Math.floor(Math.random() * countries.length)].name + ".png"
  sendObj.avatarURL = config.target + "/img/avatars/" + img[Math.floor(Math.random() * img.length)] + ".jpg"
  var sendMsg = JSON.stringify(sendObj)
  pub.publish(action, sendMsg);

}

function product() {
  if (fs.existsSync("products/orders.json")) {
    orders = JSON.parse(fs.readFileSync("products/orders.json", {encoding: 'utf8'}))

    prepproducts (function(arr) {
      console.log("prep done")
      console.log(arr)
      setInterval(function() {
        console.log('product');
        streamproducts(arr)
      }, 5000)
    })
  }
};


// server spins up and listed for the cli command
server.listen(port, function() {
  console.log("Listening on port " + port)
})
