var pixPerRow = 16;
var numRows = 24;
var WIDTH = 16;
var HEIGHT = 24;
var numPixels = pixPerRow * numRows;

var OPC = new require('../../pixel-util/opc.js');
var client = new OPC('localhost', 7890);
var pixUtil = new require('../../pixel-util/pixel-utils')(client, pixPerRow, numRows);

var setSerialPixel = function(pix, r, g, b) {
	console.log("pix: ", pix, "r: ", r, "g: ", g, "b: ", b);
	pixUtil.setPixel(pix, r, g, b);
};

var setXYPixel = function(x, y, r, g, b) {
	console.log("x: ", x, "y: ", y, "r: ", r, "g: ", g, "b: ", b);
	pixUtil.setXYPixel(x, y, r, g, b);
};

var setRow = function(row, r, g, b) {
	pixUtil.setRow(row, r, g, b);
};

var setCol = function(col, r, g, b) {
	pixUtil.setColumn(col, r, g, b);
};

var latch = function() {
	console.log("latching pixels");
	pixUtil.refresh();
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

exports.setXYPixel = function(req, res) {
	var params = req.params;
	var x = params.x;
	var y = params.y;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setXYPixel(x, y, r, g, b);
	res.send("{status:ok}");
};

exports.latchXYPixel = function(req, res) {
	var params = req.params;
	var x = params.x;
	var y = params.y;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setXYPixel(x, y, r, g, b);
	latch();
	res.send("{status:ok}");
};

exports.setRow = function(req, res) {
	var params = req.params;
	var row = params.row;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setRow(row, r, g, b);
	res.send("{status:ok}");
};

exports.latchRow = function(req, res) {
	var params = req.params;
	var row = params.row;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setRow(row, r, g, b);
	latch();
	res.send("{status:ok}");
};

exports.setCol = function(req, res) {
	var params = req.params;
	var col = params.col;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setCol(col, r, g, b);
	res.send("{status:ok}");
};

exports.latchCol = function(req, res) {
	var params = req.params;
	var col = params.col;
	var r = params.r;
	var g = params.g;
	var b = params.b;
	setCol(col, r, g, b);
	latch();
	res.send("{status:ok}");
};

exports.latch = function(req, res) {
	latch();
	res.send("{status:ok}");	
};