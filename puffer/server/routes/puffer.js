var pcon = require('../puffer-controller');

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

	var done = function() {
		res.send(200, {message:"OK"});
	};

	pcon.puffMulti(body.puffer1, 
		           body.puffer2, 
		           body.puffer3, 
		           body.puffer4, 
		           body.puffer5);

	done();
};
