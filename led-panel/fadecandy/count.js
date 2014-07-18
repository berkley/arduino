// Simple red/blue fade with Node and opc.js

var OPC = new require('./opc')
var client = new OPC('localhost', 7890);
var events = require('events');
var emitter = new events.EventEmitter();

var currentPixel = 0;
var currentTimeout = 10;

// var actualPixPerChannel = 48;
// var expectedPixPerChannel = 64;
var numRows = 72;
var pixPerRow = 16;
var numPixels = (pixPerRow * numRows);
var PixelUtils = new require('./pixel-utils')(client, pixPerRow, numRows);

var count = function()
{
    theta += thetaDelta;

    var millis = new Date().getTime();
    for (var pixel = 0; pixel < numPixels; pixel++)
    {
        var red = PixelUtils.randomColor();
        var blue = PixelUtils.randomColor();
        var green = PixelUtils.randomColor();

        if(pixel == slot)
        {
            

            PixelUtils.setPixel(pixel, red, green, blue);
            // console.log("newpix: ", newpix);
            // console.log("slot: ", slot);
        }
        else
        {
            // console.log("pixel: ", pixel);
            PixelUtils.setPixel(pixel, 0, 0, 0);
        }
    }

    slot++;
    if(slot > numPixels)
        slot = 0;

    PixelUtils.refresh();
}

var theta = 0;
var thetaDelta = 0.001;
var slot = 0;

setInterval(count, 10);
// var millis = new Date().getTime();
// var t = 65 * 0.2 + millis * 0.002;
// // setInterval(count, 30);
