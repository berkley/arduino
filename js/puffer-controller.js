var five = require("johnny-five");
var webSocket = require('ws');

//websocket for the LeapMotion
var ws = new webSocket('ws://127.0.0.1:6437');

var PORT_P1 = 8;
var PORT_P2 = 9;
var PORT_P3 = 10;
var PORT_P4 = 11;
var PORT_P5 = 12;

var P1_ON = 0;
var P2_ON = 0;
var P3_ON = 0;
var SEQ_123 = 0;
var SEQ_321 = 0;
var SEQ_ALL = 0;
var SEQ_CIRCLE = 0;

//set this to 1 when the arduino is connected, 
//set to 0 for debugging without and arduino
var BOARD_CONNECTED = 0;

exports.puffMulti = function(p1, p2, p3, p4, p5) {
	P1_ON = 0;
	P2_ON = 0;
	P3_ON = 0;
	P4_ON = 0;
	P5_ON = 0;

	if(p1)
		P1_ON = 1;
	if(p2)
		P2_ON = 1;
	if(p3)
		P3_ON = 1;
	if(p4)
		P4_ON = 1;
	if(p5)
		P5_ON = 1;

	console.log("p1:", p1, "p2:", p2, "p3:", p3, "p4:", p4, "p5:", p5);
};

if(BOARD_CONNECTED)
{
five.Board().on("ready", function() {
	var that = this;
	this.pinMode(PORT_P1, 1);
	this.pinMode(PORT_P2, 1);
	this.pinMode(PORT_P3, 1);
	this.pinMode(PORT_P4, 1);
	this.pinMode(PORT_P5, 1);

	function P1Set(onOrOff) {
		if(onOrOff) {
			that.digitalWrite(PORT_P1, 1);
			console.log("PUFF1:ON");
		} else {
			console.log("PUFF1:OFF");
			that.digitalWrite(PORT_P1, 0);
		}
	}	

	function P2Set(onOrOff) {
		if(onOrOff) {
			console.log("PUFF2:ON");
			that.digitalWrite(PORT_P2, 1);
		} else {
			console.log("PUFF2:OFF");
			that.digitalWrite(PORT_P2, 0);
		}
	}

	function P3Set(onOrOff) {
		if(onOrOff) {
			console.log("PUFF3:ON");
			that.digitalWrite(PORT_P4, 1);
		} else {
			console.log("PUFF3:OFF");
			that.digitalWrite(PORT_P4, 0);
		}
	}

	function P4Set(onOrOff) {
		if(onOrOff) {
			console.log("PUFF4:ON");
			that.digitalWrite(PORT_P4, 1);
		} else {
			console.log("PUFF4:OFF");
			that.digitalWrite(PORT_P4, 0);
		}
	}

	function P5Set(onOrOff) {
		if(onOrOff) {
			console.log("PUFF5:ON");
			that.digitalWrite(PORT_P5, 1);
		} else {
			console.log("PUFF5:OFF");
			that.digitalWrite(PORT_P5, 0);
		}
	}	

	function allOff()
	{
		P1Set(0);
		P2Set(0);
		P3Set(0);
		P4Set(0);
		P5Set(0);
	}

	function PMulti(P1, P2, P3, P4, P5) {
		allOff();
		if(P1)
			P1Set(1);
		if(P2)
			P2Set(1);
		if(P3)
			P3Set(1);
		if(P4)
			P4Set(1);
		if(P5)
			P5Set(1);
	}

	
	var val = 0;
	var delay = 250;
	this.loop( 100, function() {
	  	if(P1_ON) 
	  	{
	  		PMulti(1,0,0,0,0);
	  		setTimeout(function(){
	  			PMulti(0,0,0,0,0);
	  		}, delay);
	  		P1_ON = 0;
	  	} 
	  	else if(P2_ON)
	  	{
	  		PMulti(0,1,0,0,0);
	  		setTimeout(function(){
	  			PMulti(0,0,0,0,0);
	  		}, delay);
	  		P2_ON = 0;
	  	}
	  	else if(P3_ON)
	  	{
	  		PMulti(0,0,1,0,0);
	  		setTimeout(function(){
	  			PMulti(0,0,0,0,0);
	  		}, delay);
	  		P3_ON = 0;
	  	}
	  	else if(SEQ_123)
	  	{
	  		console.log("seq 123");
	  		SEQ_123 = 0;
	  		P1Set(1);
	  		setTimeout(function(){
	  			P1Set(0);
	  			P2Set(1);
	  			setTimeout(function(){
		  			P2Set(0);
		  			P3Set(1);
		  			setTimeout(function(){
		  				P3Set(0);
		  			}, delay);
	  			},delay);	
	  		},delay);
	  	}
	  	else if(SEQ_321)
	  	{
	  		console.log("seq 321");
	  		SEQ_321 = 0;
	  		P3Set(1);
	  		setTimeout(function(){
	  			P3Set(0);
	  			P2Set(1);
	  			setTimeout(function(){
		  			P2Set(0);
		  			P1Set(1);
		  			setTimeout(function(){
		  				P1Set(0);
		  			}, delay);
	  			},delay);	
	  		},delay);
	  	}
	  	else if(SEQ_ALL)
	  	{
	  		console.log("PUFF ALL");
	  		SEQ_ALL = 0;
	  		P1Set(1);
	  		P2Set(1);
	  		P3Set(1);
	  		setTimeout(function() {
	  			P1Set(0);
		  		P2Set(0);
		  		P3Set(0);
	  		}, delay);
	  	}
	  	else if(SEQ_CIRCLE)
	  	{
	  		console.log("SEQ_CIRCLE");
		  	SEQ_CIRCLE = 0;
	  		P1Set(1);
	  		setTimeout(function(){
	  			P1Set(0);
	  			P2Set(1);
	  			setTimeout(function(){
		  			P2Set(0);
		  			P3Set(1);
		  			setTimeout(function(){
		  				P3Set(0);
				  		setTimeout(function(){
				  			P2Set(1);
				  			setTimeout(function(){
					  			P2Set(0);
					  			P1Set(1);
					  			setTimeout(function(){
					  				P1Set(0);
					  				setTimeout(function () {
								  		P1Set(1);
								  		P2Set(1);
								  		P3Set(1);
								  		setTimeout(function() {
								  			P1Set(0);
									  		P2Set(0);
									  		P3Set(0);
								  		}, delay);	
								  	}, delay);
					  			}, delay);
				  			},delay);	
				  		},delay);
		  			}, delay);
	  			},delay);	
	  		},delay);
	  	}
	});
});
}

var numFingers;

ws.on('message', function(data, flags) {
	//controls:
	//1 pointable and swipe up: fire puffer 1
	//2 pointables and swipe up: fire puffer 2
	//3 pointables and swipe up: fire puffer 3
	//4 pointables and swipe up: fire all puffers
	//swipe left: fire puffers 1, 2, 3 in sequence
	//swipe right: fire puffers 3, 2, 1 in sequence


    // console.log(data);
    var json = JSON.parse(data);
    // if(json.gestures && json.gestures.length > 0)
	   //  console.log("json.gestures:", json.gestures, "length:", json.gestures.length, "\n");

	if(json.gestures && json.gestures.length > 0)
	{
		var g = json.gestures[0];

		if(g.type == 'swipe' && 
		   g.state == 'start')
		{ //start with 0 fingers
			numFingers = 0;
		}

		// if(g.type == 'circle' && 
		//    g.state == 'stop')
		// {
		// 	SEQ_CIRCLE = 1; 
		// }

		if(g.type == 'swipe' && 
		   g.state == 'update')
		{  //check how many fingers each update is recognizing
		   //increment if needed.
			if(!numFingers || json.gestures.length > numFingers)
			{
				numFingers = json.gestures.length;
			}
		}

		if(g.type == 'swipe' &&
		   g.state == 'stop')
		{
			var swipeStart = g.startPosition;
			var swipeEnd = g.position;
			var deltaX = swipeEnd[0] - swipeStart[0];
			var deltaY = swipeEnd[1] - swipeStart[1];

			if(Math.abs(deltaX) > Math.abs(deltaY))
			{ //swipe left/right
				if(deltaX < 0)
				{ //left
					console.log("swipe left with ", numFingers, " fingers");
					SEQ_321 = 1;
				}
				else
				{ //right
					console.log("swipe right with ", numFingers, " fingers");
					SEQ_123 = 1;
				}
			}
			else
			{ //swipe up/down
				if(deltaY < 0)
				{ //down
					console.log("swipe down with ", numFingers, " fingers");
				}
				else
				{ //up
					console.log("swipe up with ", numFingers, " fingers");
					if(numFingers == 1)
					{
						P1_ON = 1;
					}
					else if(numFingers == 2)
					{
						P2_ON = 1;
					}
					else if(numFingers == 3)
					{
						P3_ON = 1;
					}
					else if(numFingers == 4)
					{
						SEQ_ALL = 1;
					}
				}
			}
		}
	}
});
