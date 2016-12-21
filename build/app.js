
var socket = io('http://localhost:3200');

socket.emit('EMITTING', {
            sessionId: 'test',
            payload: 'test'
    });

socket.on('time', function(msg) {
    console.log('The time is ' + msg);
  });

socket.on('connect', function() {
  console.log('connected');
});

socket.on('RECEIVE_POST', function(msg){
  console.log(JSON.stringify(msg));
});

socket.on('disconnect', function() {
  console.log('disconnected');
});

socket.on('error', function (e) {
  console.log('System', e ? e : 'A unknown error occurred');
});
