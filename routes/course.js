
/*
 * Routes for course creation, manipulation and view
 */

module.exports = function(app, ensureLoggedIn, async, User, Course, Exam, requireRoles) {

	app.get('/courses',
		ensureLoggedIn('/login'),
		requireRoles(['tutor', 'assessor', 'student', 'manager']),
		function (req, res) {

		Course.find({}, function (err, docs) {

			res.render('course/view/course', {
		  		title: 'Courses', 
		  		message: req.flash('error'),
		  		course: docs,
				user: req.user
		  	});

		});

	});

	app.post('/course/new',
		ensureLoggedIn('/login'),
		requireRoles(['tutor', 'manager']),
		function (req, res) {

		var course = new Course(req.body);
		course.save(function(err) {
			if (err) {
				res.redirect('/courses');
			}
			res.redirect('/courses');
		});
	});

	app.post('/course/update/',
		ensureLoggedIn('/login'),
		requireRoles(['tutor', 'manager']),
		function (req, res) {

		var updateData = {
			name: req.body.name,
			year: req.body.year,
			term: req.body.term,
            userlist: req.body.userlist
		};

		Course.update( { _id: req.body.courseId }, updateData, function (err, affected) {
			if(err) {
                console.log(err);
				res.redirect('/course/view/' + req.body.courseId);
			} else {
				res.redirect('/courses');
			}
		});

	});


	app.get('/course/delete/:selectedCourse',
		ensureLoggedIn('/login'),
		requireRoles(['tutor', 'manager']),
		function (req, res) {

        var courseID = req.params.selectedCourse;
        async.series([
            function (callback) {
                Exam
                .find({})
                .populate('course')
                .exec(function (err, exams) {

                    async.forEach(exams, function (exam, index) {

                        var examBody = exam;
                        exam.course.forEach(function (course, i) {
                            if(course.id == courseID) {
                                examBody.course.splice(i, 1);
                            }
                        });

                        var updateData = { course: examBody.course };
                        Exam.update({ _id: exam.id }, updateData, function (err, affected) {
                            if (err)
                                console.log(err);
                        });

                    });

                    callback(err);

                });
            },
            function (callback) {
                Course.remove( { _id: req.params.selectedCourse }, function (err, affected) {
                    if(err) {
                        console.log(err);
                    }
                });

                callback();
            }
        ],
        function (error, result) {
            res.redirect('/courses');
        });

	});

	app.get('/course/new',
		ensureLoggedIn('/login'),
		requireRoles(['tutor', 'manager']),
		function (req, res) {

		User.find({}, function (err, docs) {

		  	res.render('course/manage/new', {
			    title: 'New Course',
			    message: req.flash('error'),
			    users: docs,
			    course: { id: 'abc'},
                user: req.user
			});

		});

	});

	// exam edit
	app.get('/course/edit/:selectedCourse',
		ensureLoggedIn('/login'),
		requireRoles(['tutor', 'manager']),
		function (req, res) {

		Course
			.findById(req.params.selectedCourse)
			.populate('userlist')
			.exec(function (err, docs) {

				res.render('course/manage/edit', {
			  		title: 'Edit Course',
			  		message: req.flash('error'),
			  		course: docs,
                    user: req.user
			  	});

			})

	});

	// Course detail view
	app.get('/course/view/:selectedCourse',
		ensureLoggedIn('/login'),
		requireRoles(['tutor', 'assessor', 'student', 'manager']),
		function (req, res) {

		Course
			.findById(req.params.selectedCourse)
			.populate('userlist')
			.exec(function (err, docs) {

				res.render('course/view/details', {
			  		title: 'View Course',
			  		message: req.flash('error'),
			  		course: docs,
                    user: req.user
			  	});

			})

	});

}
