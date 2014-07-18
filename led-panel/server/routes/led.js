var pixPerRow = 16;
var numRows = 24;
var numPixels = pixPerRow * numRows;

var OPC = new require('../../pixel-util/opc.js');
var client = new OPC('localhost', 7890);
var pixUtil = new require('../../pixel-util/pixel-utils')(client, pixPerRow, numRows);

var setSerialPixel = function(pix, r, g, b) {
	console.log("pix: ", pix, "r: ", r, "g: ", g, "b: ", b);
	pixUtil.setPixel(pix, r, g, b);
};

exports.latchAllOff = function(req, res) {
	pixUtil.allOff();
	latch();
	res.send("{status:ok}");
};

exports.setAllOff = function(req, res) {
	pixUtil.setAllOff();
	res.send("{status:ok}");
};

exports.setSerialPixel = function(req, res) {
	var params = req.params;
	var pix = params.address;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setSerialPixel(pix, r, g, b);
	res.send("{status:ok}");
};

exports.latchSerialPixel = function(req, res) {
	var params = req.params;
	var pix = params.address;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setSerialPixel(pix, r, g, b);
	latch();
  	res.send("{status:ok}");
};

var latch = function() {
	console.log("latching pixels");
	pixUtil.refresh();
};

exports.latch = function(req, res) {
	latch();
	res.send("{status:ok}");	
};