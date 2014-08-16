var pcon = require('../puffer-controller');

exports.p1 = function(req, res)
{
	pcon.puffMulti(1, 0, 0, 0, 0);
	res.send(200, {"status":"OK"});
};

exports.p2 = function(req, res)
{
	pcon.puffMulti(0, 1, 0, 0, 0);
	res.send(200, {"status":"OK"});
};

exports.p3 = function(req, res)
{
	pcon.puffMulti(0, 0, 1, 0, 0);
	res.send(200, {"status":"OK"});
};

exports.p123 = function(req, res)
{
	pcon.puffSeq('SEQ_123');
	res.send(200, {"status":"OK"});
};

exports.p321 = function(req, res)
{
	pcon.puffSeq('SEQ_321');
	res.send(200, {"status":"OK"});
};

exports.pAll = function(req, res)
{
	pcon.puffSeq('SEQ_ALL');
	res.send(200, {"status":"OK"});
};

exports.random = function(req, res)
{
	if(req.params.on == '1')
	{ //turn random puffs on
		pcon.random(true);
	}
	else
	{ //turn random puffs off
		pcon.random(false);
	}
	res.send(200, {"status":"OK"});
};

exports.puff = function(req, res) {
	console.log("puffing with body: ", req.body );
	var body = req.body;
	//example body:
	// {
	// 	"puffer1": 1,
	// 	"puffer2": 1,
	// 	"puffer3": 0, 
	// 	"puffer4": 1,
	// 	"puffer5": 1
	// }
	pcon.puffMulti(body.puffer1, 
		           body.puffer2, 
		           body.puffer3, 
		           body.puffer4, 
		           body.puffer5);

	res.send(200, {"status":"OK"});
};
