/* Rules for user management, creation and view */


module.exports = function(app, ensureLoggedIn, async, User, Course, requireRoles) {

	app.get('/profile', ensureLoggedIn('/login'), requireRoles(['user', 'tutor', 'assessor', 'student', 'manager']), function(req, res) {
		res.render('user/profile', {
			title: 'Profile',
			message: req.flash('error'),
			user: req.user
		});
	});

	app.post('/profile', ensureLoggedIn('/login'), requireRoles(['user', 'tutor', 'assessor', 'student', 'manager']), function(req, res) {

        var user = req.user;
        user.set('emailAddress', req.body.emailAddress);

        if(req.body.password)
            user.set('password', req.body.password);

        if(req.body.passwordConfirm)
            user.set('passwordConfirm', req.body.passwordConfirm);

        user.save(function(err) {
            if(err)
                for(var errorField in err.errors) {
                    req.flash('error', err.errors[errorField].message);
                }

            res.redirect('/profile');
        });

	});

	

	app.post('/user/update',
        ensureLoggedIn('/login'), 
        requireRoles(['manager']),
		function (req, res) {
            if (req.body.deleteUser != undefined) {

                    var studentID = req.body.studentid;
                    async.series([
                    function (callback) {
                        Course
                        .find({})
                        .populate('userlist')
                        .exec(function (err, courses) {

                            async.forEach(courses, function (course, index) {

                                var courseBody = course;
                                course.userlist.forEach(function (user, i) {
                                    if(user.id == studentID) {
                                        courseBody.userlist.splice(i, 1);
                                    }
                                });

                                var updateData = { userlist: courseBody.userlist };
                                Course.update({ _id: course.id }, updateData, function (err, affected) {
                                    if (err)
                                        console.log(err);
                                });

                            });

                            callback(err);

                        });
                    },
                    function (callback) {
                        User.remove( { _id: req.body.studentid }, function (err, affected) {
                            if(err) {
                                console.log(err);
                            }
                        });

                        callback();
                    }
                ],
                function (error, result) {
                    res.redirect('/');
                });

            } else {
            
                
                User.findOne( { _id : req.body.studentid }, function (err, student) {
                    

                    student.set('firstname', req.body.firstname);
                    student.set('lastname', req.body.lastname);
                    student.set('username', req.body.username);
                    student.set('studentNumber', req.body.studentNumber);
                    student.set('emailAddress', req.body.emailAddress);
                    student.set('role', req.body.role);

                    if(req.body.password)
                        student.set('password', req.body.password);

                    if(req.body.passwordConfirm)
                        student.set('passwordConfirm', req.body.passwordConfirm);

                    

                    student.save(function(err) {
                        if(err) {
                            req.flash('error', err);

                            res.render('user/manage/edit', {
                                title: 'Users',
                                message: req.flash('error'),
                                user: req.user
                            });

                        } else {
                            console.log(student);
                            res.redirect('/user');
                        }
                    });

                });
            }
		});


	app.get('/user', ensureLoggedIn('/login'), requireRoles(['manager']), function (req, res) {

        res.render('user/manage/edit', {
            title: 'Users',
            message: req.flash('error'),
            user: req.user
        });

	});

	app.get('/user/manage/:selectedUser',
		ensureLoggedIn('/login'),
        requireRoles(['manager']),
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

