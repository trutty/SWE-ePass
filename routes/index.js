
/*
 * Routes for User auth
 */

module.exports = function(app, User, passport){

	app.get('/', function(req, res) {
		res.render('index', { title: 'SWE ePass', user: req.user });
	});

	app.get('/login', function(req, res) {
		console.log('login user: ' + req.user);
		res.render('login', { title: 'Login/Signup', message: req.flash('error'), user: req.user });
	});

	app.get('/logout', function(req, res) {
		req.session.destroy();
		res.redirect('/');
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
