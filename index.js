var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);



app.get('/xYz', function(req, res){
  res.sendFile(__dirname + '/xYz.html');
});

io.on('connection', function(socket){
 var clientIp = socket.request.connection.remoteAddress;
var clientIp = clientIp.slice(7);
io.emit('zombiename', clientIp);

console.log('Zombie Connected: ' + clientIp);
socket.on('disconnect', function(){
console.log('Zombie Disconnected');

});
//if (clientIp.indexOf('153.2.246.37') >=0){

  socket.on('chat message', function(msg){
    io.emit('chat message', clientIp + ": " +  msg);
 });



  });




http.listen(80, function(){
  console.log('listening on *:80');
});
