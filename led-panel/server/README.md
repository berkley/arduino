This server provides REST and WebSocket connects to the LED panel configured by a running fadecandy server.  

Port: 3000

Note that for all REST "set" routes, you must call /latch after setting the buffer.  If you call the "latch" routes, latch will be called for you.

REST routes
===========
* GET /pixel/set/:address/:r/:g/:b - set a pixel at address with RGB value
* GET /pixel/set/off - set all pixels to #000000
* GET /pixel/set/:x/:y/:r/:g/:b - set pixel at (x, y) to RGB
* GET /pixel/latch/:x/:y/:r/:g/:b - latch pixel at (x, y) to RGB
* GET /pixel/latch/:address/:r/:g/:b - latch a pixel at address with RGB value
* GET /pixel/latch/off - latch all pixels to #000000
* GET /row/set/:row/:r/:g/:b - set row to RGB
* GET /row/latch/:row/:r/:g/:b - latch row to RGB
* GET /col/set/:col/:r/:g/:b - set col to RGB
* GET /col/latch/:col/:r/:g/:b - latch col to RGB
* GET /latch - latch (display) the current buffer

TODO
====
Add websockets commands for each of the REST routes