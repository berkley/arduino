//basic params about the LED array(s)
//note you must have your fadecandy server configured correctly for your OPC setup
var pixPerRow = 16;
var numRows = 48;
var WIDTH = pixPerRow;
var HEIGHT = numRows;
var numPixels = pixPerRow * numRows;

//setup the OPC and pixel util libs
var OPC = new require('../../pixel-util/opc.js');
var client = new OPC('localhost', 7890);
var pixUtil = new require('../../pixel-util/pixel-utils')(client, pixPerRow, numRows);

var setSerialPixel = function(pix, r, g, b) {
	console.log("pix: ", pix, "r: ", r, "g: ", g, "b: ", b);
	pixUtil.setPixel(pix, r, g, b);
};

var setXYPixel = function(x, y, r, g, b) {
	console.log("x: ", x, "y: ", y, "r: ", r, "g: ", g, "b: ", b);
	pixUtil.setXYPixel(x, y, r, g, b);
};

var setRow = function(row, r, g, b) {
	pixUtil.setRow(row, r, g, b);
};

var setCol = function(col, r, g, b) {
	pixUtil.setColumn(col, r, g, b);
};

var setScreen = function(screen, r, g, b) {
	for(var i=0; i<HEIGHT; i++)
	{
		setRow(i, r, g, b);
	}
};

var drawBitmap = function(bitmap) {
	for (var i = 0; i < bitmap.length; i++) {
		var row = bitmap[i];
		for (var j = 0; j < row.length; j++) {
			var col = row[j];
			if (col != null) {
				// console.log(i, j, col[0], col[1], col[2]);
				pixUtil.setXYPixel(i, j, col[0], col[1], col[2]);
			}
		}
	}
};

var latch = function() {
	// console.log("latching pixels");
	pixUtil.refresh();
};

var line1 = function(x1, y1, x2, y2, r, g, b) {

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

	setXYPixel(x1,y1,r,g,b);
	while (x1 < x2) {
		if (e + 2 * dy < dx) {
			x1 += 1;
			e += 2 * dy;
			setXYPixel(x1,y1,r,g,b);
		}
		else {
			y1 += 1;
			e -= 2 * dx;
		}
	}
};

var line = line1;

//====================================================
//============WS======================================
//====================================================

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3001});

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received:', typeof message, message);
        if (typeof message === 'string') {
        	var json = JSON.parse(message);
        	if (json.command == "latchScreen") {
        		setScreen(json.screen, json.r, json.g, json.b);
        		latch();
        	}
        	else if (json.command == "latchBitmap") {
        		drawBitmap(json.bitmap);
        		latch();
        	}
        	ws.send("ok");
        }
    });
});

//====================================================
//============REST====================================
//====================================================
exports.latchAllOff = function(req, res) {
	pixUtil.allOff();
	latch();
	res.send("{status:ok}");
};

exports.setAllOff = function(req, res) {
	pixUtil.allOff();
	res.send("{status:ok}");
};

exports.setSerialPixel = function(req, res) {
	var params = req.params;
	var pix = params.address;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setSerialPixel(pix, r, g, b);
	res.send("{status:ok}");
};

exports.latchSerialPixel = function(req, res) {
	var params = req.params;
	var pix = params.address;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setSerialPixel(pix, r, g, b);
	latch();
  	res.send("{status:ok}");
};

exports.setXYPixel = function(req, res) {
	var params = req.params;
	var x = params.x;
	var y = params.y;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setXYPixel(x, y, r, g, b);
	res.send("{status:ok}");
};

exports.latchXYPixel = function(req, res) {
	var params = req.params;
	var x = params.x;
	var y = params.y;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setXYPixel(x, y, r, g, b);
	latch();
	res.send("{status:ok}");
};

exports.setRow = function(req, res) {
	var params = req.params;
	var row = params.row;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setRow(row, r, g, b);
	res.send("{status:ok}");
};

exports.latchRow = function(req, res) {
	var params = req.params;
	var row = params.row;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setRow(row, r, g, b);
	latch();
	res.send("{status:ok}");
};

exports.setCol = function(req, res) {
	var params = req.params;
	var col = params.col;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setCol(col, r, g, b);
	res.send("{status:ok}");
};

exports.latchCol = function(req, res) {
	var params = req.params;
	var col = params.col;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setCol(col, r, g, b);
	latch();
	res.send("{status:ok}");
};

exports.setScreen = function(req, res) {
	var params = req.params;
	var screen = params.col;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setScreen(screen, r, g, b);
	res.send("{status:ok}");
};

exports.latchScreen = function(req, res) {
	var params = req.params;
	var screen = params.col;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setScreen(screen, r, g, b);
	latch();
	res.send("{status:ok}");
};

exports.setBitmap = function(req, res) {
	var params = req.params;
	var bitmap = req.body;
	drawBitmap(bitmap);
	res.send("{status:ok}");
};

exports.latchBitmap = function(req, res) {
	var params = req.params;
	var bitmap = req.body;
	drawBitmap(bitmap);
	latch();
	res.send("{status:ok}");
};

exports.latch = function(req, res) {
	latch();
	res.send("{status:ok}");	
};

exports.setLine = function(req, res) {
	line(req.params.x1, req.params.y1, req.params.x2, req.params.y2, req.params.r, req.params.g, req.params.b);
	res.send("{status:ok}");	
};

exports.latchLine = function(req, res) {
	line(req.params.x1, req.params.y1, req.params.x2, req.params.y2, req.params.r, req.params.g, req.params.b);
	latch();
	res.send("{status:ok}");	
};

exports.drawBitmap = drawBitmap;
