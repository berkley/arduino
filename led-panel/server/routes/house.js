var request = require('request');

var sparkUrl = "https://api.spark.io/v1/devices";
var access_token = "78af8b10fe8d01dfdf824d00604a360cc62a5758";
var deviceId = "53ff70065067544818350687";


exports.allOff = function(req, res) {
	var url = buildUrl("run");
	var data = "setAll,0,0,0";
	request.post(url, function(err, response, body) {
		res.send(body);
	}).form(buildFormData(data));
};

exports.setAll = function(req, res) {
	var url = buildUrl("run");
	var data = "setAll," + req.query.r + "," + req.query.g + "," + req.query.b;
	console.log("url: " + url);
	console.log("data: " + data);
	request.post(url, function(err, response, body) {
		res.send(body);
	}).form(buildFormData(data));
};

exports.alternate = function(req, res) {
	var url = buildUrl("run");	
    var data = "alternate," + req.query.r1 + "," + req.query.g1 + "," + req.query.b1 + "," + req.query.r2 + "," + req.query.g2 + "," + req.query.b2;
	console.log("url: " + url);
	console.log("data: " + data);
	request.post(url, function(err, response, body) {
		res.send(body);
	}).form(buildFormData(data));
};

exports.rainbow = function(req, res) {
	var url = buildUrl("run");
	var data = "rainbow,";
	request.post(url, function(err, response, body) {
		res.send(body);
	}).form(buildFormData(data));
};

var buildFormData = function(params) {
	var formData = {"access_token":access_token ,"params":params};
	return formData;
};

var buildUrl = function(action) {
	var url = sparkUrl + "/" + deviceId + "/" + action;// + "?access_token=" + access_token;
	return url;
};