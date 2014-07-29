#Flame Effect Controls

REST Port: 4000
WS Port: 4001

Backend Express Routes
==============
* POST /puff - puff 1 or more puffers.
  JSON body looks like: 
	{
		"puffer1": 0,
		"puffer2": 1,
		"puffer3": 0, 
	}
* GET /puff/p1 - fire puffer 1
* GET /puff/p2 - fire puffer 2
* GET /puff/p3 - fire puffer 3
* GET /puff/s123 - fire the 123 sequence
* GET /puff/s321 - fire the 321 sequence
* GET /puff/sAll - fire all puffers at once


* WebSocket connection
	- the puffers can be controlled via websockets by sending a json formatted command.
	Here's some example code:
	var webSocket = require('ws');
	var ws = new webSocket('ws://127.0.0.1:8080');
    ws.on('message', function(data, flags) {
        var json = JSON.parse(data);
        console.log("websocket msg rcvd: ", json);
    });

    ws.on('open', function() {
        console.log("sending command");
        // ws.send('{"P1_ON":1, "P2_ON":0, "P3_ON":0, "P4_ON":0, "P5_ON":0}');
        ws.send('{"SEQ_123":1}');
    });

    The json format includes commands for the following:
    {"P1_ON":1}
    {"P2_ON":1}
    {"P3_ON":1}
    ("SEQ_123":1}
    ("SEQ_321":1}
    ("SEQ_ALL":1}

    Any sequence command that puffer-controller.js can handle can be sent over the websocket on port 4001.

LeapMotion Support
==============
This app listens on port 6437 for websocket output from a LeapMotion sensor.  Currently, it responds to several gestures:
* 1 finger swipe up: fire p1
* 2 finger swipe up: fire p2
* 3 finger swipe up: fire p3
* 4 finger swipe up: fire all puffers
* swipe right: fire p1, p2, p3 in sequence
* swipe left: fire p3, p2, p1 in sequence
* 1 finger circle: fire p1, p2, p3, p2, p1, all

curl.cmd contains a curl command to debug the websocket connection.

Arduino Control
==============
This app uses JohnnyFive to control the puffers via a USB attached arduino board.  The arduino board must be connected prior to starting the app.  There is a constant that can be set to 0 if you do not want to look for the arduino...mostly for test purposes.  The constant is defined in puffer-controller.js and is called BOARD_CONNECTED.
