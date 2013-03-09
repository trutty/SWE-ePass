
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.login = function(req, res) {
  res.render('login', { title: 'Login', message: req.flash('error') });
};

exports.signup = function(req, res, signupInformation) {
	res.render('signup', { title: 'Signup', message: req.flash('error'), information: signupInformation});
};

exports.testcase = function( req, res, next ) {
	console.log('START');
	console.log(!!req);
	console.log(!!res);
	console.log(!!next);
	console.log(!!test);
	console.log('END');
}