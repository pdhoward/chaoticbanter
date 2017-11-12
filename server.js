
////////////////////////////////////////////////////
////////  			RedisLab and HTTP SERVER     ///////
///////            version 0.5.0            ///////
//////////////////////////////////////////////////

'use strict';
const config 	=       require('./config');
const express =       require('express');
const path  =         require('path');
const banterfile =    require('./texts');
const countries =     require('./countries/country')
const Redis =         require('ioredis');
const fs =            require("fs");

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

//////

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
    console.log("Channel> " + channel + "Message> " + message);
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

const prepproducts = (cb) => {
  let id = 0
  let msgObj = {}
  let productObj = {}
  let productarray = []
  for (var i = 0; i < banterfile.length; i++) {
    msgObj.id = id
    id++
    msgObj.name = banterfile[i].name
    productObj = productfile[Math.floor(Math.random() * productfile.length)];
    msgObj.text = productObj.text
    productarray.push(msgObj)
    }
  cb(productarray)
  }

const streamproducts = (arr) = {
  let sendObj = arr[Math.floor(Math.random() * arr.length)];
  sendObj.flagURL = config.target + "/img/flags/" + countries[Math.floor(Math.random() * countries.length)].name + ".png"
  sendObj.avatarURL = config.target + "/img/avatars/" + img[Math.floor(Math.random() * img.length)] + ".jpg"
  var sendMsg = JSON.stringify(sendObj)
  pub.publish(action, sendMsg);

}

function product() {

  prepproducts((arr) => {
    streamproducts(arr)
  }
)
  let msgObj = banterfile[Math.floor(Math.random() * banterfile.length)];
  // We will this object as the basis for creating a new text message
  fs.readFile("texts/banter.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    // Break down all the numbers inside
    data = data.split(", ");
    var result = 0;

    // Loop through those numbers and add them together to get a sum.
    for (var i = 0; i < data.length; i++) {
      if (parseFloat(data[i])) {
        result += parseFloat(data[i]);
      }
    }

    // We will then print the final balance rounded to two decimal places.
    console.log("You have a total of " + result.toFixed(2));
  });
}

// server spins up and initiates the publishing function
server.listen(port, function() {
  console.log("Listening on port " + port)
})
