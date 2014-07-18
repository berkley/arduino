var express = require('express');
var puffer = require('./routes/puffer.js');
var http = require('http');

var app = express();

app.configure(function() {
  app.set('port', 5000);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.post('/puff', puffer.puff);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
