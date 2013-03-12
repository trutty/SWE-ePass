
/*
 * Routes for User auth
 */

module.exports = function(app, passport){
	app.get('/', function(req, res) {
		res.render('index', { title: 'Express', user: req.user });
	});

	app.get('/login', function(req, res) {
		res.render('login', { title: 'Login', message: req.flash('error'), user: req.user });
	});

	app.get('/logout', function(req, res) {
		req.session.destroy();
		res.redirect('/');
	});

	app.get('/signup', function(req, res, signupInformation) {
		res.render('signup', { title: 'Signup', message: req.flash('error'), information: signupInformation});
	});





	// post
	app.post('/login',
	  passport.authenticate(
	        'local',
	        {  successRedirect: '/',
	           failureRedirect: '/login',
	           failureFlash: true
	        }
	  )
	);

	app.post('/signup', function(req, res) {
	  var user = new User(req.body);

	  user.save(function(err) {
	    if(err) {
	      res.redirect('/signup', routes.signup, user);
	    }

	    //req.session.user_id = user._id;
	    res.redirect('/');
	  });
	});
}