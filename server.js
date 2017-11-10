
////////////////////////////////////////////////////
////////  			RedisLab and HTTP SERVER     ///////
///////            version 0.5.0            ///////
//////////////////////////////////////////////////

'use strict';
var config 	=       require('./config');
var express =       require('express');
var path  =         require('path');
var banter =        require('./texts');
var Redis =         require('ioredis');

var app =  express();
var server =        require('http').Server(app);
var port = process.env.PORT || 3002;

////////////////////////////////////////////////
let redisPort =     config.redis.port;
let redisHost =     config.redis.host;
let redisPassword = config.redis.password;

var redis = new Redis({
 port: redisPort,
 host: redisHost
});

var pub = new Redis({
 port: redisPort,
 host: redisHost

});

// subscribe to a channel
redis.subscribe('banter', function (err, count) {
			console.log("Subscribed to " + count + " channel")
  });

// log message when detected on redis channel
redis.on('message', function (channel, message) {
    console.log('Banter detected on ' + channel + ' this message: ' + message);
  });

// publish messages randomly -- test runner for chaltic platform
function stream() {
  var msgObj = banter[Math.floor(Math.random() * banter.length)];
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
