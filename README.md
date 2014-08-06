This repository currently includes 3 types of code.  
* firmware: INO files for various projects
* led-panel: code to control 16x24 led-panels using the fadecandy firmware
* puffer: code to control the fire puffers including an express node.js server, an iOS REST client and Johnny-five firmware.

Some Important Dependencies
===========================
* http://nodejs.org
* git@github.com:prasmussen/chrome-cli.git
* git@github.com:scanlime/fadecandy.git
* git@github.com:rwaldron/johnny-five.git

Getting Started
===============
* install node.js
* clone fadecandy: 
    git clone git@github.com:scanlime/fadecandy.git
* run the fadecandy server: 
```
    fadecandy/bin/fcserver-osx (or whatever your os is)
```
* use a config file appropriate for your pixel layout.  See the led-panel/fadecandy/layouts for examples
* you should see fadecandy connect to your controllers in the console.  Something like:
```
    cberkley@Syncline bin$ ./fcserver-osx ~/project/arduino/led-panel/fadecandy/config/triple-48per.config 
    [1407302502:5775] NOTICE: Server listening on 127.0.0.1:7890
    USB device Fadecandy (Serial# MMCYXJUUPZWJSTMB, Version 1.07) attached.
```
* run the node server that controls the LEDs
```
      cd led-panel/server
      node app.js
```
* You should now be able to send some simple http GETs from a browser to test.  Try:
```
    http://localhost:3000/pixel/latch/off
    http://localhost:3000/screen/latch/0/255/0/0
```
* the first request should turn all of the pixels off
* the second request should set screen 0 to red





