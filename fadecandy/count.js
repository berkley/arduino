// Simple red/blue fade with Node and opc.js

var OPC = new require('./opc')
var client = new OPC('localhost', 7890);
var events = require('events');
var emitter = new events.EventEmitter();

var currentPixel = 0;
var currentTimeout = 10;

var actualPixPerChannel = 48;
var expectedPixPerChannel = 64;
var pixPerRow = 16;
var numChannels = 8;
var numPixels = actualPixPerChannel * 8;

var count = function()
{
    theta += thetaDelta;

    var millis = new Date().getTime();
    for (var pixel = 0; pixel < numPixels; pixel++)
    {
        var red = 255;
        var blue = 255;
        var green = 255;

        if(pixel == slot)
        {
            

            client.setPixel(tpix(pixel), red, green, blue);
            // console.log("newpix: ", newpix);
            // console.log("slot: ", slot);
        }
        else
        {
            // console.log("pixel: ", pixel);
            client.setPixel(tpix(pixel), 0, 0, 0);
        }
    }

    slot++;
    if(slot > numPixels)
        slot = 0;
    client.writePixels();
}

function tpix(addr) {
    var actualPixPerChannel = 48;
    var expectedPixPerChannel = 64;
    var pixPerRow = 16;
    var numChannels = 8;
    var numPixels = actualPixPerChannel * 8;


    var mod = addr % actualPixPerChannel;
    var base = addr - mod;
    var newaddr;
    var upperBounds = actualPixPerChannel - pixPerRow - 1;
    var addrMinusBase = addr - base;

    if(addrMinusBase >= 0 && addrMinusBase < pixPerRow)
    {
        newaddr = addrMinusBase;
    }
    if(addrMinusBase >= pixPerRow && addrMinusBase <= upperBounds)
    { //invert
        var offset = addrMinusBase - pixPerRow;
        newaddr = upperBounds - offset;
    }
    if(addrMinusBase > upperBounds)
    {
        newaddr = addrMinusBase;
    }
    
    return newaddr + base;
};

var theta = 0;
var thetaDelta = 0.001;
var slot = 0;

setInterval(count, 100);
// var millis = new Date().getTime();
// var t = 65 * 0.2 + millis * 0.002;
// // setInterval(count, 30);
