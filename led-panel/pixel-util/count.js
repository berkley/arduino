var OPC = new require('./opc')
var client = new OPC('localhost', 7890);
var events = require('events');
var emitter = new events.EventEmitter();

var numRows = 8;
var pixPerRow = 8;
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
        }
        else
        {
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

setInterval(count, 20);
// setInterval(xyCount, 1000);


