// Simple red/blue fade with Node and opc.js

var OPC = new require('./opc')
var client = new OPC('localhost', 7890);
var events = require('events');
var emitter = new events.EventEmitter();

var HEIGHT = 72;
var WIDTH = 16;
var numPixels = (WIDTH * HEIGHT);
var PixelUtils = new require('./pixel-utils')(client, WIDTH, HEIGHT);
var millis = 0;


exports.flash = function(tower) {
	console.log("flashing", tower);
    var ppb = 384;  //24 * 16;
    var start = (tower * ppb);
    PixelUtils.randomColorWipeRange(start, (start + ppb));
}

