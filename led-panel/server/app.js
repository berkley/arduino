var express = require('express');
var routes = require('./routes');
var visualizations = require('./routes/visualizations');
var led = require('./routes/led');
var http = require('http');
var path = require('path');
var Bitmap = require('./lib/bitmap.js');
var parse = require('svg-path-parser');
var app = express();

var sockjs = require('sockjs');

var connections = [];

var socket = sockjs.createServer();

socket.on('connection', function(conn) {
    connections.push(conn);
    var number = connections.length;
    conn.write("Welcome, User " + number);

    conn.on('data', function(message) {
        var bitmap = new Bitmap.Bitmap(48,24);
        var svgObject = JSON.parse(message);

        bitmap.buildArray(48, 24);

        if (svgObject.type) {
            if (svgObject.type === 'circle') {
                bitmap.circle(svgObject.attrs.cx, svgObject.attrs.cy, svgObject.attrs.r);
                bitmap.draw();
                led.drawBitmap(bitmap.data);
            }
            else if (svgObject.type === 'bitmap') {
                led.drawBitmap(svgObject.bitmap);
            }
        }

        for (var ii=0; ii < connections.length; ii++) {
            connections[ii].write("User " + number + " says: " + message);
        }
    });

    conn.on('close', function() {
    	console.log("closing");
        for (var ii=0; ii < connections.length; ii++) {
            connections[ii].write("User " + number + " has disconnected");
        }
    });
});

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
app.get('/screen/set/:screen/:r/:g/:b', led.setScreen);
app.get('/screen/latch/:screen/:r/:g/:b', led.latchScreen);
app.post('/bitmap/set', led.setBitmap);
app.post('/bitmap/latch', led.latchBitmap);
app.get('/latch', led.latch);
app.get('/line/set/:x1/:y1/:x2/:y2/:r/:g/:b', led.setLine);
app.get('/line/latch/:x1/:y1/:x2/:y2/:r/:g/:b', led.latchLine);
// app.get('/program/set/:program', led.setProgram);
// app.get('/program', led.getPrograms)

app.get('/sample', visualizations.sample);
app.get('/audio-sample', visualizations.audioSample);
app.get('/bar-volume', visualizations.barVolume);
app.get('/', visualizations.grid);
app.get('/grid', visualizations.grid);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
socket.installHandlers(server, {prefix:'/socket'});