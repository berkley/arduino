var OPC = new require('./opc'); 
var client = new OPC('localhost', 7890);

var numRows = 8;
var numCols = 8;
var numPixels = (numCols * numRows);
var PixelUtils = new require('./pixel-utils')(client, numCols, numRows);

var bmp1 = [[{r:255, g: 0, b:0}, {r:0, g:255, b:0}],
           [{r:0, g:255, b:0}, {r:0, g:0, b:255}],
           [{r:0, g:0, b:0}, {r:0, g:0, b:0}],
           [{r:0, g:0, b:0}, {r:0, g:0, b:0}]];

var bmp2 = [[{r:0, g: 0, b:0}, {r:0, g:0, b:0}],
           [{r:0, g:0, b:0}, {r:0, g:0, b:0}],
           [{r:255, g:0, b:0}, {r:0, g:255, b:0}],
           [{r:0, g:255, b:0}, {r:0, g:0, b:255}]];


var run = function(bmp) {
    PixelUtils.setBitmap(bmp1);
    PixelUtils.refresh();
    setTimeout(run2, 200);
};

var run2 = function(bmp) {
    PixelUtils.allOff();
    PixelUtils.setBitmap(bmp2);
    PixelUtils.refresh();
}

PixelUtils.allOff();
setInterval(run, 400);


