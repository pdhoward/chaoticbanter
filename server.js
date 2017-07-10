
////////////////////////////////////////////////////
////////  			Sockets and HTTP SERVER      ///////
///////            version 0.5.0            ///////
//////////////////////////////////////////////////

'use strict';

var express 	   = require('express');
var app  		     = express();
var path 		     = require('path');
//  application components
var ioServer 	= require('./app/socket')(app);

// Set the port number
var port = process.env.PORT || 3002;

// Middlewares
var htmlFile =      path.resolve(__dirname, './client/index.html');
var buildFolder =   path.resolve(__dirname, './build');

// messages
var testArray   = require('./texts');

app.use(session);

ioServer.listen(port);


var io = socketIo(httpServer);
