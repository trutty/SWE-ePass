/* Rules for user management, creation and view */


module.exports = function(app, ensureLoggedIn, async, User, Course) {
	app.get('/user', ensureLoggedIn('/login'), function (req, res) {
		User.find({}, function(err, docs){
			res.render('/user/view/user', {
				title: 'Users',
				message: req.flash('error'),
				user: docs;
			});
		});
	});
};