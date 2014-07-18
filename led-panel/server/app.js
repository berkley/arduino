var express = require('express');
var routes = require('./routes');
var led = require('./routes/led');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// app.get('/', routes.index);
app.get('/pixel/set/:address/:r/:g/:b', led.setSerialPixel);
app.get('/pixel/latch/:address/:r/:g/:b', led.latchSerialPixel);
app.get('/pixel/latch/off', led.latchAllOff);
app.get('/pixel/set/off', led.setAllOff);
app.get('/pixel/set/:x/:y/:r/:g/:b', led.setXYPixel);
app.get('/pixel/latch/:x/:y/:r/:g/:b', led.latchXYPixel);
app.get('/row/set/:row/:r/:g/:b', led.setRow);
app.get('/row/latch/:row/:r/:g/:b', led.latchRow);
app.get('/col/set/:col/:r/:g/:b', led.setCol);
app.get('/col/latch/:col/:r/:g/:b', led.latchCol);
app.get('/latch', led.latch);
// app.get('/program/set/:program', led.setProgram);
// app.get('/program', led.getPrograms)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
