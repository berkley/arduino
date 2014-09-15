LED panel control modules
=========================
This directory includes server and client code to control 3 16x24 LED panels each with an individual Fadecandy (https://github.com/scanlime/fadecandy) controller.  The panel controllers are teensy 3.0 (https://www.pjrc.com/store/teensy3.html) microcontroller boards with the Fadecandy firmware installed.  This allows each pixel on each panel to be addressable via USB.

The subdirectories include:
* fadecandy: control, test, example and config code for the Fadecandy subsystem.
* ios: iOS (iphone) code to control the led panels remotely
* pixel-util: a pixel utility with example and test code.  pixel-util is used by other javascript classes to control the led panel array.
* server: node.js REST and WebSocket server that directly controls the panels
