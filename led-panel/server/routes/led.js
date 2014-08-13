//basic params about the LED array(s)
//note you must have your fadecandy server configured correctly for your OPC setup
var pixPerRow = 16;
var numRows = 72;
var WIDTH = pixPerRow;
var HEIGHT = numRows;
var SCREEN_HEIGHT = 24;
var NUM_SCREENS = 3;
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
	pixUtil.setWideXYPixel(x, y, r, g, b);
};

var setRow = function(row, r, g, b) {
	pixUtil.setRow(row, r, g, b);
};

var setCol = function(col, r, g, b) {
	pixUtil.setColumn(col, r, g, b);
};

var setRowOnScreen = function(screen, row, r, g, b) {
	if(screen != 99) //all screens
	{
		var trueRow = (screen * SCREEN_HEIGHT) + row;
		console.log("trueRow: ", trueRow);
		if(row < 0 || row >= SCREEN_HEIGHT) //don't set rows outside the bounds of the screen
		{
			console.log("skipping row ", trueRow);
			return;
		}
		setRow(trueRow, r, g, b);
	}
	else
	{
		setRow(row, r, g, b);
		setRow(row + SCREEN_HEIGHT);
	    setRow(row + SCREEN_HEIGHT + SCREEN_HEIGHT);
	}
};

var setScreen = function(screen, r, g, b) {
	var start = 0;
	var end = SCREEN_HEIGHT;
	// console.log("screen: ", screen);
	if(screen == 99)
	{
		start = 0;
		end = HEIGHT;
	}
	else if(screen != 0)
	{
		start = SCREEN_HEIGHT * screen;
		end = SCREEN_HEIGHT + start;
	}

	// console.log("start: ", start, " end: ", end);

	for(var i=start; i<end; i++)
	{
		setRow(i, r, g, b);
	}
};

var drawBitmap = function(bitmap) {
	pixUtil.allOff();
	for (var i = 0; i < bitmap.length; i++) {
		var row = bitmap[i];
		for (var j = 0; j < row.length; j++) {
			var col = row[j];
			if (col != null) {
				// console.log(i, j, col[0], col[1], col[2]);
				pixUtil.setWideXYPixel(i, j, col[0], col[1], col[2]);
			}
		}
	}
	latch();
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
console.log("opening web socket on 3001");
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
        	else if (json.command == "latchRowOnScreen") {
        		setRowOnScreen(parseInt(json.screen), 
        			           parseInt(json.row),
        			           parseInt(json.r), 
        			           parseInt(json.g),
        			           parseInt(json.b));
        		latch();
        	} 
        	else if(json.command == "allOff") {
        		pixUtil.allOff();
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

exports.setRowOnScreen = function(req, res) {
	var params = req.params;
	setRowOnScreen(parseInt(params.screen), parseInt(params.row), 
		parseInt(params.r), parseInt(params.g), parseInt(params.b));
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

exports.latchRowOnScreen = function(req, res) {
	var params = req.params;
	setRowOnScreen(parseInt(params.screen), parseInt(params.row), 
		parseInt(params.r), parseInt(params.g), parseInt(params.b));
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
	var screen = params.screen;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setScreen(screen, r, g, b);
	res.send("{status:ok}");
};

exports.latchScreen = function(req, res) {
	var params = req.params;
	var screen = params.screen;
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

var noiseTimeout;
var startNoise = function(req, res) {
	var cycleLength = parseInt(req.params.cycleLength);
	var maxr = parseInt(req.params.maxr);
	var maxg = parseInt(req.params.maxg);
	var maxb = parseInt(req.params.maxb);
	if(cycleLength == -1) //make it random
	{
		cycleLength = parseInt(Math.random() * 5);
	}
	console.log("setting noise");
	for(var i=0; i<numPixels; i++)
	{
		var r = pixUtil.randomColor(maxr);
		var g = pixUtil.randomColor(maxg);
		var b = pixUtil.randomColor(maxb);
		pixUtil.setPixel(i, r, g, b);
	}
	pixUtil.refresh();
	console.log("new noise in ", cycleLength, " seconds");
	noiseTimeout = setTimeout(function(){startNoise(req, res);}, cycleLength * 1000);
	res.send("{status:ok}");
};
exports.startNoise = startNoise;

var runningProgram;

exports.runProgram = function(req, res) {
	var program = "node " + req.params.program;
	console.log("program: ", program);
	runningProgram = require('child_process').exec(program);
	res.send("{status:ok}");
};

exports.stopProgram = function(req, res) {
	console.log("runningProgram: ", runningProgram);
	if(runningProgram == "browser")
	{
		console.log("stopping browser program");
		var program = "chrome-cli close"
		console.log("program: ", program);
		runningProgram = require('child_process').exec(program);
		runningProgram = null;
	}
	else if(runningProgram)
	{
		console.log("stopping program");
		runningProgram.kill();
	}
	else if(noiseTimeout)
	{
		console.log("stopping noise");
		clearTimeout(noiseTimeout);
		noiseTimeout = null;
	}

	res.send("{status:ok}");
};

exports.runBrowserProgram = function(req, res) {
	runningProgram = "browser";
	var program = "chrome-cli open " + "http://localhost:3000/" + req.params.program;
	console.log("browser program: ", program);
	require('child_process').exec(program);
	res.send("{status:ok}");
};

exports.drawBitmap = drawBitmap;
