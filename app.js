
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

var client = arDrone.createClient();

var lastPng = fs.readFileSync('./test/image.png');
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
  res.end(lastPng);
});

http = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io = io.listen(http);


var speed = 1;
var mouseSensibility = 2;

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
          client.counterClockwise(speed);
        } else if (mouseSensibility < mouse[0]) {
          client.clockwise(speed);
        }
      }
      if (!isNaN(mouse[1])) {
        if (mouse[1] < -mouseSensibility) {
          client.up(speed);
        } else if (mouseSensibility < mouse[1]) {
          client.down(speed);
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
