/* Rules for user management, creation and view */


module.exports = function(app, ensureLoggedIn, async, User, Course) {

	app.get('/profile', ensureLoggedIn('/login'), function(req, res) {
		res.render('user/profile', {
			title: 'Profile',
			message: req.flash('error'),
			user: req.user
		});
	});

	app.post('/profile', ensureLoggedIn('/login'), function(req, res) {

	});

	

	app.post('/user/update/', ensureLoggedIn('/login'), 
		function (req, res) {

			var updateData = {
				emailAddress 	: req.body.email,
				password 		: req.body.password,
			};

			User.update( { _studentNumber : req.body._studentNumber }, updateData, function (err, affected) {
				if(err) {
					console.log(err);
					res.redirect('/user/manage/' + req.body.studentNumber);
				} else {
					res.redirect('/user');
				}

			});
		});


	app.get('/user', ensureLoggedIn('/login'), function (req, res) {
		async.parallel([
			function (callback) {

				var users = [];

				User.find( {}, function (err, docsUser) {
					docsUser.forEach(function(item){
						var user 		= {};
						user.name 		= item.name;
						user.firstname	= item.firstname;
						user.lastname	= item.lastname;
						user._id 		= item._id;

						users.push(user);
					});

					callback(err, users);
				});
			}
		],
		function (err, result) {
			res.render('user/manage/edit', {
				title: 'Users',
				message: req.flash('error'),
				user: req.user,
				users: result[0]
			});
		});
	});
	

	
}

