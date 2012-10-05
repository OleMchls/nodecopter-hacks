
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , arDrone = require('ar-drone');

var client = arDrone.createClient();

client.takeoff();

client
  /*.after(5000, function() {
    this.clockwise(0.5);
  })*/
  .after(2000, function() {
    this.front(0.5);
  })
  .after(2000, function() {
    this.left(0.5);
  })
  .after(2000, function() {
    this.back(0.5);
  })
  .after(2000, function() {
    this.right(0.5);
  })
  .after(3000, function() {
    this.stop();
    this.land();
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
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
