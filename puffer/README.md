Fire effects control module
===========================
The fire puffs are emitted when a 12V charge is sent to the solenoid valve which releases excess gas from the accumulator.  The custom hardware that controls the valves includes an arduino UNO and a set of relays.  When a specified pin of the arduino goes to high (+5V), the relay is turned on and which provides 12V to the solenoid valve and actuates the puff.  

The arduino runs the johnny-five (https://github.com/rwaldron/johnny-five) firmware to allow the board to be controlled by node.js (http://nodejs.org/).  

This directory includes:
* firmware: test firmware for an arduino to control the fire effects directly from the board.  Not normally used, but maybe useful for testing.
* ios: iOS (iphone) client code to control the puffers
* server: node.js REST and WebSocket server that controls the fire effects