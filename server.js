
////////////////////////////////////////////////////
////////  			HTTP SERVER     		        ///////
///////            version 0.5.0            ///////
//////////////////////////////////////////////////

var express     = require('express');
var http        = require('http');
var path        = require('path');
var testArray   = require('./texts');
var redis       = require('socket.io-redis');
var socketIo    = require('socket.io');
var uuid        = require('uuid/v4');

var app = express();
var httpServer = new http.Server(app);
var port = 3200;
var htmlFile = path.resolve(__dirname, './client/index.html');
var buildFolder = path.resolve(__dirname, './build');

var io = socketIo(httpServer);

var room = 'board-chaotictests';

var data = {
  id: "",
  content: "this is a test text",
  user: "BanterBot",
  postType: "Live",
  likes:[],
  dislikes:[],
  sessionId: "testid"
}

var session = {
  id: "board-chaotictests"
}


/////////////////////////////////////////////////////////////////
////////        Cross Server Messaging Integration        ///////
/////////////////////////////////////////////////////////////////

io.adapter(redis({host: 'localhost', port: 6379}));

function prepareText() {
  var textObject = testArray[Math.floor(Math.random() * testArray.length)];
  data.content = textObject.text;
  data.user = textObject.name;

}

function sendPost(session, data, socket) {
      socket.sessionId = session.id;
      data.sessionId = session.id;
      var postId = uuid();
      data.id = postId;
      data.postType = 'Live';
      socket.broadcast
      .to(room)
      .emit('chaotic/posts/receive/add', data)

      data.postType = 'AI';
      socket.broadcast
      .to(room)
      .emit('chaotic/posts/receive/add', data)

  }

function joinSession(session, socket) {
        console.log("JOINING SESSION")
        socket.join(room, function() {
        socket.sessionId = session.id;
        });
      };

io.on('connection', function(socket) {

      joinSession(session, socket);

      ////////////////////////////////////////////////////////////////////////////
      // a couple of tests to learn sockets
      console.log(io.sockets.name) // '/'
      console.log(io.of('/projects/test_cases').name) // '/projects/test_cases'
      io.emit('time', new Date);
      //var io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 })
      /////////////////////////////////////////////////////////////////////////////

      setInterval(function(){
        prepareText();
        sendPost(session, data, socket);
      }, 15000);


    });



app.use('/build', express.static(buildFolder));
app.get('/*', function(req, res) {
		res.sendFile(htmlFile)
		});

httpServer.listen(port);

console.log("running on port " + port);
