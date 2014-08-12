var express = require('express');
var puffer = require('./routes/puffer.js');
var http = require('http');

var app = express();

app.configure(function() {
  app.set('port', 4000);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.get('/puff/p1', puffer.p1);
app.get('/puff/p2', puffer.p2);
app.get('/puff/p3', puffer.p3);
app.get('/puff/s123', puffer.p123);
app.get('/puff/s321', puffer.p321);
app.get('/puff/sAll', puffer.pAll);
app.get('/program/random/:on', puffer.random);
app.post('/puff', puffer.puff);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
