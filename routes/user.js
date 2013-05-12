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

	

	app.post('/user/update', ensureLoggedIn('/login'), 
		function (req, res) {
			console.log('PING');
			console.log(req.body);
			var updateData = {
				firstname		: req.body.firstname,
				lastname		: req.body.lastname,
				username		: req.body.username,
				studentNumber  	: req.body.studentNumber,
				emailAddress 	: req.body.emailAddress,
				password 		: req.body.password,
				role			: req.body.role,
			};

			if (req.body.deleteUser = 'on'){
				//delete shit;
			};

			User.update( { _id : req.body.studentid }, updateData, function (err, affected) {
				console.log('UPDATE');
				if(err) {
					console.log(err);
					res.redirect('/user');
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
						var user 			= {};
						user.name 			= item.name;
						user.firstname		= item.firstname;
						user.lastname		= item.lastname;
						user._id 			= item._id;
						user.username		= item.username;
						user.emailAddress	= item.emailAddress;
						user.studentNumber 	= item.studentNumber;
						user.role			= item.role;


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
	app.get('/user/manage/:selectedUser',
		ensureLoggedIn('/login'),
		function (req, res) {

		User
			.findById(req.params.selectedUser)
			.exec(function (err, docs) {

				res.render('user/manage/edit', {
			  		title: 'Edit User',
			  		message: req.flash('error'),
			  		user: docs
			  	});

			})

	});
	

	
}

