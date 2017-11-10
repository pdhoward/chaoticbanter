
////////////////////////////////////////////////////
////////  			RedisLab and HTTP SERVER     ///////
///////            version 0.5.0            ///////
//////////////////////////////////////////////////

'use strict';
const config 	=       require('./config');
const express =       require('express');
const path  =         require('path');
const banter =        require('./texts');
const countries =     require('./countries/country')
const Redis =         require('ioredis');

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

/////////////////////// arrays with additional data to decorate the text messages ////////////////

let img = ['1', '2', '3', '4', '5', '6', '7', '8', 'chatbot', 'helpbot', 'smartbot']


// subscribe to a channel
redis.subscribe('banter', function (err, count) {
			console.log("Subscribed to " + count + " channel")
  });

// log message when detected on redis channel
redis.on('message', function (channel, message) {
    console.log('Banter detected on ' + channel + ' this message: ' + message);
  });

// publish messages randomly -- test runner for chaotic platform
// add a country name and avatar chosen randomly from arrays
function stream() {
  let msgObj = banter[Math.floor(Math.random() * banter.length)];
  msgObj.flagURL = config.target + "/img/flags/" + countries[Math.floor(Math.random() * countries.length)].name + ".png"
  msgObj.avatarURL = config.target + "/img/avatars/" + img[Math.floor(Math.random() * img.length)] + ".jpg"
  var sendMsg = JSON.stringify(msgObj)
  pub.publish('banter', sendMsg);

}

// control the rate of publishing messages
function intervalObj() {
  setInterval(function() {
  console.log('publish');
  stream()
}, 5000)};


// server spins up and initiates the publishing function
server.listen(port, function() {
  console.log("Listening on port " + port)
  intervalObj()
})
