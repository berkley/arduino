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
		setRow(row + SCREEN_HEIGHT, r, g, b);
		setRow(row + SCREEN_HEIGHT + SCREEN_HEIGHT, r, g, b);
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
	console.log('led.js: client connected.')

	ws.on('error', function(a,b,c) {
		console.log("ws error:", a, b, c);
	});
	
	ws.on('message', function(message) {
        // console.log('received:', typeof message, message);
        if (typeof message === 'string') {
        	var json = JSON.parse(message);
        	if (json.command == "latchScreen") {
        		setScreen(json.screen, json.r, json.g, json.b);
        		latch();
        	}
        	else if (json.command == "latchBitmap") {
        		var bitmap = json.bitmap;
        		try {
        			bitmap = JSON.parse(json.bitmap);
        		}
        		catch(ex) {
        			console.log("error parsing bitmap:", ex);
        		}
        		// drawBitmap(bitmap);

        		drawBitmap(JSON.parse(json.bitmap));
        		latch();

        		 // console.log("B");
        		 if (exports.delegate) {
        			// json.type = 'bitmap';
        			exports.delegate.didReceiveBitmap(message);
        		}

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
        	else if(json.command == "drawWaveAtRow") {
        		var row = parseInt(json.row);
        		var r = parseInt(json.r);
        		var g = parseInt(json.g); 
        		var b = parseInt(json.b);
        		drawWaveAtRow(-1, row, r, g, b);
        	}
        	else if(json.command == "animateOneWave") {
        		var r = parseInt(json.r);
        		var g = parseInt(json.g); 
        		var b = parseInt(json.b);
        		var cycleLength = parseInt(json.cycleLength);
        		clearTimeout(waveTimeout);
        		drawWaveAtRow(cycleLength, waveRow, r, g, b, true);
        	}
        	// ws.send("ok");
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

var waveTimeout;
var waveRow = SCREEN_HEIGHT;
var startWave = function(req, res) {
	var r = req.params.r;
	var g = req.params.g;
	var b = req.params.b;
	var cycleLength = req.params.cycleLength;
	var time = new Date().getTime();
	
	waveTimeout = setTimeout(function(){drawWaveAtRow(cycleLength, waveRow, r, g, b)}, cycleLength);
	res.send("{status:ok}");
};
exports.startWave = startWave;

var waveAtRow = function(req, res){
	var r = parseInt(req.params.r);
	var g = parseInt(req.params.g);
	var b = parseInt(req.params.b);
	var row = parseInt(req.params.row);
	drawWaveAtRow(-1, row, r, g, b);
	res.send("{status:ok}");
};
exports.waveAtRow = waveAtRow;

var animateOneWave = function(req, res) {
	var r = req.params.r;
	var g = req.params.g;
	var b = req.params.b;
	var cycleLength = parseInt(req.params.cycleLength);
	drawWaveAtRow(cycleLength, waveRow, r, g, b, true);
	res.send("{status:ok}");
};
exports.animateOneWave = animateOneWave;

var drawWaveAtRow = function(cycleLength, row, r, g, b, stopAfterOne) {
	console.log("drawing wave at row ", row);
	var waveSize = 11;
	var rIncrement = r / (waveSize / 2);
	var gIncrement = g / (waveSize / 2);
	var bIncrement = b / (waveSize / 2); 
	pixUtil.allOff();
	pixUtil.refresh();
	var j = 0;
	for(var i=row; i<(row + waveSize); i++)
	{
		// console.log("j: ", j, " i: ", i);
		if(i < SCREEN_HEIGHT && i >= 0)
		{
			pixUtil.setRow(i, rIncrement * j, gIncrement * j, bIncrement * j);
			pixUtil.setRow(i + SCREEN_HEIGHT, rIncrement * j, gIncrement * j, bIncrement * j);
			pixUtil.setRow(i + SCREEN_HEIGHT + SCREEN_HEIGHT, rIncrement * j, gIncrement * j, bIncrement * j);
		}

		if(i >= (row + parseInt(waveSize / 2)))
			j--;
		else
			j++;
	}
	pixUtil.refresh();
	waveRow--;
	if(waveRow == -1 * waveSize)
	{
		waveRow = SCREEN_HEIGHT;

		if(stopAfterOne)
		{
			clearTimeout(waveTimeout);
			waveTimeout = null;
			return;
		}
	}

	if(cycleLength > 0)
		waveTimeout = setTimeout(function(){drawWaveAtRow(cycleLength, waveRow, r, g, b, stopAfterOne)}, cycleLength);
}

var staticTimeout;
var startStatic = function(req, res) {
	var r = req.params.r;
	var g = req.params.g;
	var b = req.params.b;
	var cycleLength = req.params.cycleLength;
	pixUtil.allOff();
	pixUtil.refresh();
	var time = new Date().getTime();
	for(var i=0; i<numPixels; i++)
	{
		var on = parseInt(Math.random() * 2);
		// console.log("on: ", on);
		if(on == 1)
		{
			var red = parseInt(Math.abs(Math.sin(i * time) * r));
			var green = parseInt(Math.abs(Math.sin(i * time) * g));
			var blue = parseInt(Math.abs(Math.sin(i * time) * b));
			console.log("red: ", red);
			pixUtil.setPixel(i, red, green, blue);
		}
	}
	pixUtil.refresh();
	// console.log("refreshing static in 1000ms");
	staticTimeout = setTimeout(function(){startStatic(req, res)}, cycleLength);
	res.send("{status:ok}");
};
exports.startStatic = startStatic;

var heartCount = 0;
var heartTimeout;
var startHeartbeat = function(req, res) {
	var r = req.params.r;
	var g = req.params.g;
	var b = req.params.b;
	if(heartCount == 0)
	{ 
		setScreen(99, r, g, b);
		latch();
		heartCount++;
		heartTimeout = setTimeout(function(){startHeartbeat(req, res)}, 250);
	}
	else if(heartCount == 1)
	{
		setScreen(99, 0, 0, 0);
		latch();
		heartCount++;
		heartTimeout = setTimeout(function(){startHeartbeat(req, res)}, 250);
	}
	else if(heartCount == 2)
	{ 
		setScreen(99, r, g, b);
		latch();
		heartCount++;
		heartTimeout = setTimeout(function(){startHeartbeat(req, res)}, 250);
	}
	else if(heartCount == 3)
	{
		setScreen(99, 0, 0, 0);
		latch();
		heartCount = 0;
		heartTimeout = setTimeout(function(){startHeartbeat(req, res)}, 2000);
	}
	res.send("{status:ok}");
};
exports.startHeartbeat = startHeartbeat;

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

var startFastNoiseTimeout;
var startFastNoise = function(req, res) {
	var cycleLength = parseInt(req.params.cycleLength); //this should be in millis
	var maxr = parseInt(req.params.maxr);
	var maxg = parseInt(req.params.maxg);
	var maxb = parseInt(req.params.maxb);
	if(cycleLength == -1) //make it random
	{
		cycleLength = parseInt(Math.random() * 5000);
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
	console.log("new fastnoise in ", cycleLength, " milliseconds");
	startFastNoiseTimeout = setTimeout(function(){startFastNoise(req, res);}, cycleLength);
	res.send("{status:ok}");
};
exports.startFastNoise = startFastNoise;

var runningProgram;

exports.runProgram = function(req, res) {
	var program = "node " + req.params.program;
	console.log("program: ", program);
	runningProgram = require('child_process').exec(program);
	res.send("{status:ok}");
};

exports.stopProgram = function(req, res) {
	// console.log("runningProgram: ", runningProgram);
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
		runningProgram = null;
	}
	else if(noiseTimeout)
	{
		console.log("stopping noise");
		clearTimeout(noiseTimeout);
		noiseTimeout = null;
	}
	else if(startFastNoiseTimeout)
	{
		console.log("stopping fastNoise");
		clearTimeout(startFastNoiseTimeout);
		startFastNoiseTimeout = null;
	}
	else if(heartTimeout)
	{
		console.log("stopping heartbeat");
		clearTimeout(heartTimeout);
		heartTimeout = null;
	}
	else if(staticTimeout)
	{
		console.log("stopping static");
		clearTimeout(staticTimeout);
		heartTimeout = null;
	}
	else if(waveTimeout)
	{
		console.log("stopping wave");
		clearTimeout(waveTimeout);
		waveTimeout = null;
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
exports.delegate = null;
