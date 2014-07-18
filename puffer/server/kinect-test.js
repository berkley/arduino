// kinect-test.js

var WS = require('ws');
var WebSocketServer = WS.Server
var wss = new WebSocketServer({port: 8081});
var kinectPixels = require('./kinect-pixels.js');

var wsPuffer = new WS('ws://127.0.0.1:8080');

var MAX_X = 1200;
var MIN_X = -1200;

var lastWaveAt = null;
var lastTower = -1;

wss.on('connection', function(ws) {

	console.log("\n\nws client connected\n\n");

	ws.on('open', function() {
		console.log("client open");
	});

	ws.on('message', function(data, flags) {
	    // flags.binary will be set if a binary data is received
	    // flags.masked will be set if the data was masked

		// console.log("message: ", data);
		var o = JSON.parse(data);
		console.log("message: ", o);

		var now = new Date().getTime();
		lastWaveAt = lastWaveAt || now;
		var sinceMillis = (now - lastWaveAt);

		var ix = parseInt(o.x) + MAX_X;

		var ux = (ix / (MAX_X*2.0));

		
		// console.log("ux:", ux);


		if (sinceMillis > 200 && tower != lastTower) {
			lastWaveAt = now;
			// console.log("wave: ", o);

			var tower = 1;
			var repeats = 1;

			if (ux < 0.33) {
				tower = 0;
				wsPuffer.send('{"SEQ_321":1}');
			}
			else if (ux > 0.66) {
				tower = 2;
				wsPuffer.send('{"SEQ_123":1}');
			}
			else {
				wsPuffer.send('{"P' + (tower+1) + '_ON":1}');
			}


			// kinectPixels.flash(tower);

			lastTower = tower;
		}

	});

});

console.log("Waiting for connection...");
