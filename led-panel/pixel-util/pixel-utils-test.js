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

var timestamp = function() {
    return new Date().getTime();
}

var fillColumns = function(wait) {
    console.log("fillColumns");
    wait = wait || 100;
    var red = PixelUtils.randomColor();
    var blue = PixelUtils.randomColor();
    var green = PixelUtils.randomColor();

    for (var column = 0; column < WIDTH/2.0; column++)
    {
        PixelUtils.setColumn(column, red, green, blue);
        PixelUtils.refresh();
    }
}

var fillRows = function(wait) {
    wait = wait || 100;
    var red = PixelUtils.randomColor();
    var blue = PixelUtils.randomColor();
    var green = PixelUtils.randomColor();

    for (var row = 0; row < HEIGHT/2.0; row++)
    {
        PixelUtils.setRow(row, red, green, blue);
        PixelUtils.refresh();
    }
}

var colorWipes = function() {
    PixelUtils.colorWipe(10, PixelUtils.randomColor(), PixelUtils.randomColor(), PixelUtils.randomColor());
}

var BPM = 120;



var fakeVU = function() {

    var power = HEIGHT;
    var color = PixelUtils.randomColor();

    for (var row = HEIGHT-1; row >= 0; row--) {
        PixelUtils.setRow(row, color, color, color);
    }

    PixelUtils.refresh();

    // TODO: handle loop timing better
}


var atozX = atozY = 0;
function atoz() {
    // PixelUtils.allOff();
    atozX++;
    atozY++;

    if (atozX > 48) { atozX = 0;}
    if (atozY > 16) { atozY = 16}
    for (var x=0; x < 48; x++) {
        for (var y=0; y < 24; y++) {
            console.log("x", x, "y", y);
            
            if (x == atozX && y == atozY) {
                // paint
                PixelUtils.setWideXYPixel(x, y, 0, 0, 200);
            }            
            else {
                PixelUtils.setWideXYPixel(x, y, 0, 0, 0);                
            }
        }
    }
    
    PixelUtils.refresh();

}


var program = 0;

var allPrograms = [
    fillColumns,
    fillColumns,
    fillRows,
    fillRows,
    colorWipes,
    fakeVU
];


var MODE = 0;

if (MODE == 0) {
    console.log("\n\ntesting...\n")
    setInterval(atoz, 250);
}
else {    
    function nextProgram() {
        PixelUtils.colorWipe(0, 0,0,0);
        PixelUtils.refresh();
        console.log("program", program);

        allPrograms[program++]();
        if (program >= allPrograms.length) { program = 0; } 
    }

    setInterval(nextProgram, 1000);
}
