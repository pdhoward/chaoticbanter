
////////////////////////////////////////////////////
////////  			RedisLab and HTTP SERVER     ///////
///////            version 0.5.0            ///////
//////////////////////////////////////////////////

'use strict';
var config 	=       require('./config');
var express =       require('express');
var path  =         require('path');
var banter =        require('./texts');

var app =  express();
var server =        require('http').Server(app);
var port = process.env.PORT || 3002;

////////////////////////////////////////////////
let redisPort =     config.redis.port;
let redisHost =     config.redis.host;
let redisPassword = config.redis.password;

var Redis =         require('ioredis');

var redis = new Redis({
 port: redisPort,
 host: redisHost
});

var pub = new Redis({
 port: redisPort,
 host: redisHost

});

// subscribe and listen
redis.subscribe('newMessage', function (err, count) {
			console.log("Subscribed to " + count + " channel")
  });
/*
redis.on('message', function (channel, message) {
    console.log('Received the following from channel ' + channel + ' message: ' + message);
  });
*/
function stream() {
  var msgObj = banter[Math.floor(Math.random() * banter.length)];
  var sendMsg = JSON.stringify(msgObj)
  pub.publish('newMessage', sendMsg);

}

function intervalObj() {
  setInterval(function() {
  console.log('publish');
  stream()
 }, 2000)};


// keep server running

server.listen(port, function() {
  console.log("Listening on port " + port)
  intervalObj()
})
