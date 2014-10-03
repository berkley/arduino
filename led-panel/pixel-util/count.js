var OPC = new require('./opc')
var client = new OPC('localhost', 7890);

var numRows = 8;
var numCols = 8;
var numPixels = (numCols * numRows);
var PixelUtils = new require('./pixel-utils')(client, numCols, numRows);
var slot = 0;

var count = function()
{
    for (var pixel = 0; pixel < numPixels; pixel++)
    {
        if(pixel == slot)
        {
            var red = PixelUtils.randomColor();
            var blue = PixelUtils.randomColor();
            var green = PixelUtils.randomColor();
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

setInterval(count, 20);


