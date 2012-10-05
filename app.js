
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , arDrone = require('ar-drone')
  , fs = require('fs');
  , io = require('socket.io');

var client = arDrone.createClient();

client.on('navdata', function() {
  console.log('recieving navdata');
});

var lastPng;
pngStream = client.createPngStream();
pngStream
  .on('error', console.log)
  .on('data', function(pngBuffer) {
    lastPng = pngBuffer;
  });

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/image.png', function(req, res) {
  res.writeHead(200, {'Content-Type': 'image/png'});
  fs.readFile('./test/image.png', function (err, data) {
    if (err) throw err;
    res.end(data);
  });
  //res.end(lastPng);
});

http = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io = io.listen(http);

io.sockets.on('connection', function (socket) {
  socket.on('movement', function (data) {
    console.log(data);
  });
});
