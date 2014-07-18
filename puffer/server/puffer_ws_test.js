var webSocket = require('ws');

// websocket for the LeapMotion
var ws = new webSocket('ws://127.0.0.1:8080');

ws.on('message', function(data, flags) {
	var json = JSON.parse(data);
	console.log("websocket msg rcvd: ", json);
});

ws.on('open', function() {
    // ws.send('{"P1_ON":1, "P2_ON":0, "P3_ON":0, "P4_ON":0, "P5_ON":0}');
    // ws.send('{"SEQ_123":1}');
    ws.send('{"SEQ_ALL":1}');
});
