
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var visualizations = require('./routes/visualizations');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var Bitmap = require('./lib/bitmap.js');
var d3 = require('d3');
var jsdom = require('jsdom');
var parse = require('svg-path-parser');
var htmlStub = '<html><head></head><body><div id="dataviz-container"></div><script src="js/d3.v3.min.js"></script></body></html>' // html file skull with a container div for the d3 dataviz

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
            }
        }

        bitmap.draw();
        // bitmap.debugFrame();

    	console.log("data", message);
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

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/spiral', visualizations.spiral);
app.get('/bezier', visualizations.bezier);
app.get('/sample', visualizations.sample);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
socket.installHandlers(server, {prefix:'/socket'});