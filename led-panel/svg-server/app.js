var d3 = require('d3');
var jsdom = require('jsdom');
var parse = require('svg-path-parser');
var htmlStub = '<html><head></head><body><div id="dataviz-container"></div><script src="js/d3.v3.min.js"></script></body></html>' // html file skull with a container div for the d3 dataviz

var lineFunction = d3.svg.line()
                          .x(function(d) { return d.x; })
                          .y(function(d) { return d.y; })
                          .interpolate("cardinal");

var lineData = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
                 { "x": 40,  "y": 10}, { "x": 45,  "y": 20},
                 { "x": 30,  "y": 5},  { "x": 10, "y": 6}];

function randomPoint(width, height) {
	return {
		x: (Math.floor(Math.random() * width)),
		y: (Math.floor(Math.random() * height))
	};
};

var Pixel = function() {
	this.r = 0;
	this.g = 0;
	this.b = 0;
};

var Bitmap = function() {
	this.data = [];
};

Bitmap.prototype.buildArray = function(width, height) {
	for (var i = 0; i < width; i++) {
		this.data[i] = new Array(height);
	}
};

Bitmap.prototype.drawLine = function(x1, y1, x2, y2, r, g, b) {

	x1 = parseInt(x1);	
	y1 = parseInt(y1);	
	x2 = parseInt(x2);	
	y2 = parseInt(y2);	
	r = parseInt(r);	
	g = parseInt(g);	
	b = parseInt(b);	
	var dx=x2-x1;
	var dy=y2-y1;
	var e=0;

	this.data[x1][y1] = [r,g,b];

	while (x1 < x2) {
		if (e + 2 * dy < dx) {
			x1 += 1;
			e += 2 * dy;
			this.data[x1][y1] = [r,g,b];
		}
		else {
			y1 += 1;
			e -= 2 * dx;
		}
	}
};

Bitmap.prototype.parseD = function(d) {
	this.parsed = parse(d);
};

Bitmap.prototype.draw = function() {
	if (this.parsed != null) {
		for (var i = 0; i < this.parsed.length - 1; i++) {
			var command1 = this.parsed[i].args[0];
			var command2 = this.parsed[i+1].args[0];
			this.drawLine(command1.x, command1.y, command2.x, command2.y, 255, 255, 255);
		}
	}
};

Bitmap.prototype.debugFrame = function() {
	for (var i = 0; i < this.data.length; i++) {
		console.log(JSON.stringify(this.data[i]));
	}
};

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

var sockjs = require('sockjs');

var connections = [];

var socket = sockjs.createServer();

socket.on('connection', function(conn) {
    connections.push(conn);
    var number = connections.length;
    conn.write("Welcome, User " + number);

    jsdom.env({
    	features : { QuerySelector : true }, html : htmlStub, 
    	done : function(errors, window) {
    	
    		var bitmap = new Bitmap();
    		bitmap.buildArray(48, 24);

    		var svg = d3.select('body').append('svg')
    			.attr('width', 48)
    			.attr('height', 24);
    		
    		var path = svg.append('path').attr("d", lineFunction(lineData));
    		
    		bitmap.parseD(path.attr('d'));
    		bitmap.draw();
    		bitmap.debugFrame();

    		setInterval(function() {
    			conn.write(path.attr('d'));

    			for (var i = 0; i < lineData.length; i++) {
    				lineData[i] = randomPoint(48, 24);
    			};
    			// console.log(lineData);
    			path.attr("d", lineFunction(lineData));
    		}, 100);
    	}
    });

    conn.on('data', function(message) {
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
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
socket.installHandlers(server, {prefix:'/socket'});