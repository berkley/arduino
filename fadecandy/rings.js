#!/usr/bin/env node

/*
 * Three dimensional Node.js pattern based on the "Rings" Processing example.
 *
 * Uses noise functions modulated by sinusoidal rings, which themselves
 * wander and shift according to some noise functions.
 *
 * 2014 Micah Elizabeth Scott
 */

var SimplexNoise = require('simplex-noise');
var simplex = new SimplexNoise(Math.random);
var webSocket = require('ws');

// websocket for the fire control


var OPC = new require('./opc');
var model = OPC.loadModel(process.argv[2] || './layouts/grid32x16z.json');
var client = new OPC('localhost', 7890);

//turn off for debugging without a fire controller
var PUFFERS_ON = false;
var ws;
if(PUFFERS_ON) {
    ws = new webSocket('ws://127.0.0.1:8080');
}

var noiseScale = 0.02;
var speed = 0.002;
var wspeed = 0.01;
var scale = 0.1;
var ringScale = 3.0;
var wanderSpeed = 0.00005;
var dx = 0, dz = 0, dw = 0;

var puffing = false;

var min = Math.min;
var max = Math.max;
var sin = Math.sin;
var cos = Math.cos;
var pow = Math.pow;
var sqrt = Math.sqrt;

var interval;

function fractalNoise(x, y, z, w)
{
    // 4D fractal noise (fractional brownian motion)

    var r = 0;
    var amp = 0.5;
    for (var octave = 0; octave < 4; octave++) {
        r += (simplex.noise4D(x, y, z, w) + 1) * amp;
        amp /= 2;
        x *= 2;
        y *= 2;
        z *= 2;
        w *= 2;
    }
    return r;
}

function noise(x, spin)
{
    // 1-dimensional noise. Cut a zig-zag path through
    // the simplex 2D noise space, so we repeat much less often.
    spin = spin || 0.01;
    var noise = simplex.noise2D(x, x * spin) * 0.5 + 0.5;
    return noise;
}

function draw()
{
    var now = new Date().getTime();

    var angle = sin(now * 0.001);
    var hue = now * 1.0;

    var saturation = min(max(pow(1.15 * noise(now * 0.000122), 2.5), 0), 1);
    var spacing = noise(now * 0.000124) * ringScale;

    // Rotate movement in the XZ plane
    dx += cos(angle) * speed;
    dz += sin(angle) * speed;

    // Random wander along the W axis
    dw += (noise(now * 0.00002) - 0.5) * wspeed;

    var centerx = (noise(now * wanderSpeed, 0.9) - 0.5) * 1.25;
    var centery = (noise(now * wanderSpeed, 1.4) - 0.5) * 1.25;
    var centerz = (noise(now * wanderSpeed, 1.7) - 0.5) * 1.25;

    function shader(p)
    {
        var x = p.point[0];
        var y = p.point[1];
        var z = p.point[2];

        // console.log("x: ", x, "y:", y, "z:", z);

        var distx = x - centerx;
        var disty = y - centery;
        var distz = z - centerz;

        var dist = sqrt(distx*distx + disty*disty + distz*distz);
        var pulse = (sin(dz + dist * spacing) - 0.3) * 0.3;
      
        var n = fractalNoise(
            x * scale + dx + pulse,
            y * scale,
            z * scale + dz,
            dw
        ) - 0.95;

        var m = fractalNoise(
            x * scale + dx,
            y * scale,
            z * scale + dz,
            dw  + 10.0
        ) - 0.75;

        var shaderVal = OPC.hsv(
            hue + 0.2 * m,
            saturation,
            min(max(pow(3.0 * n, 1.5), 0), 0.9)
        );

        return shaderVal;
    }

    client.mapPixels(shader, model);
}

function puff() {
    if(!PUFFERS_ON)
        return;

    console.log("!!!!!Sending fire command");

    var msg;
    var ran = Math.random() * 5;
    if(ran > 0 && ran <= 1)
        msg = {"P1_ON":1};
    else if(ran > 1 && ran <= 2)
        msg = {"P2_ON":1};
    else if(ran > 2 && ran <= 3)
        msg = {"P3_ON":1};
    else if(ran > 3 && ran <= 4)
        msg = {"SEQ_123":1};
    else if(ran > 4 && ran <= 5)
        msg = {"SEQ_ALL":1};
            
    var ws = new webSocket('ws://127.0.0.1:8080');

    ws.on('message', function(data, flags) {
        var json = JSON.parse(data);
        console.log("websocket msg rcvd: ", json);
        puffing = false;
        var ranTO = Math.random() * 20 * 1000;
        console.log("puffing again in ", ranTO, " ms");
        setTimeout(puff, ranTO);
    });

    ws.on('open', function() {
        console.log("sending command");
        // ws.send('{"P1_ON":1, "P2_ON":0, "P3_ON":0, "P4_ON":0, "P5_ON":0}');
        // ws.send('{"SEQ_123":1}');
        ws.send(JSON.stringify(msg));
    });
};

setInterval(draw, 10);
setTimeout(puff, 5000);
