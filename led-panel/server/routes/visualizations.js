
/*
 * GET home page.
 */

exports.spiral = function(req, res){
  res.render('spiral', { title: 'Express' });
};

exports.bezier = function(req, res){
  res.render('bezier', { title: 'Express' });
};

exports.sample = function(req, res){
  res.render('sample', { title: 'Express' });
};

exports.audioSample = function(req, res){
  res.render('audio-sample', { title: 'Express' });
};