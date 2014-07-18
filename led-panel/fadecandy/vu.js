// Simple red/blue fade with Node and opc.js

var OPC = new require('./opc')
var client = new OPC('localhost', 7890);
var events = require('events');
var emitter = new events.EventEmitter();
var currentPixel = 0;
var currentTimeout = 10;
var numPixels = 72 * 16;
var coreAudio = require("node-core-audio");
var engine = coreAudio.createNewAudioEngine();

function processAudio( inputBuffer ) {
    console.log( inputBuffer.length + " channels" );
    console.log( "Channel 0 has " + inputBuffer[0].length + " samples" );
    console.log("inputBuffer: "+ inputBuffer[0]);

    return inputBuffer;
}

engine.addAudioCallback( processAudio );


var draw = function()
{
    var millis = new Date().getTime();

    for (var pixel = 0; pixel < numPixels; pixel++)
    {
        // var t = pixel * 0.2 + millis * 0.002;
        // var red = 128 + 96 * Math.sin(t + 0.1);
        // var green = 128 + 96 * Math.sin(t + 0.6);
        // var blue = 128 + 96 * Math.sin(t + 0.1);

        var t = pixel * 0.2 + millis * 0.002;
        var red = 128 + 96 * Math.sin(t);
        var green = 128 + 96 * Math.sin(t + 0.1);
        var blue = 128 + 96 * Math.sin(t + 0.3);

        client.setPixel(tpix(pixel), red, green, blue);
        // client.setPixel(pixel, red, green, blue);
    }
    client.writePixels();
}

function tpix(addr) {
    var actualPixPerChannel = 48;
    var pixPerRow = 16;
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

setInterval(draw, 30);