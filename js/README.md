#Flame Effect Controls

Backend Express Routes
==============
* POST http://localhost:5000/puff - puff 1 or more puffers.
  JSON body looks like: 
	{
		"puffer1": 0,
		"puffer2": 1,
		"puffer3": 0, 
		"puffer4": 1,
		"puffer5": 1
	}

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
