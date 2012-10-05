
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , arDrone = require('ar-drone')
  , fs = require('fs')
  , io = require('socket.io');

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

var client = arDrone.createClient();

var lastPng;
pngStream = client.createPngStream();
pngStream
  //.on('error', console.log)
  .on('data', function(pngBuffer) {
    lastPng = pngBuffer;
  });

client.on('navdata', function(data) {
  console.log('recieving navdata');
});

var speed = 0.1;
var mouseSensibility = 10;

io.sockets.on('connection', function (socket) {
  socket.on('movement', function (data) {
    console.log(data);
    client.stop();
    if (!data) return;
    var directions = data.directions;
    var mouse = data.mouse;
    if (directions) {
      directions[0] && client.front(speed);
      directions[1] && client.right(speed);
      directions[2] && client.back(speed);
      directions[3] && client.left(speed);
    }
    if (mouse) {
      if (!isNaN(mouse[0])) {
        if (mouse[0] < -mouseSensibility) {
          client.up(speed);
        } else if (mouseSensibility < mouse[0]) {
          client.down(speed);
        }
      }
      if (!isNaN(mouse[1])) {
        if (mouse[1] < -mouseSensibility) {
          client.counterClockwise(speed);
        } else if (mouseSensibility < mouse[1]) {
          client.clockwise(speed);
        }
      }
    }
  });
  socket.on('takeoff', function () {
    console.log('takeoff');
    client.takeoff();
  });
  socket.on('land', function () {
    console.log('land');
    client.stop();
    client.land();
  });
});
