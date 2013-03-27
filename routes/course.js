
/*
 * Routes for course creation, manipulation and view
 */

module.exports = function(app, async, User, Course){

	app.get('/courses', function(req, res) {

		Course.find({}, function (err, docs) {

			res.render('course/view/course', {
		  		title: 'Courses', 
		  		message: req.flash('error'),
		  		course: docs
		  	});

		});

	});

	app.post('/course/new', function(req, res) {
		var course = new Course(req.body);
			course.save(function(err) {
				if (err) {
					res.redirect('/courses');
				}
				res.redirect('/courses');
			});
	});

	app.post('/course/update/', function (req, res) {

		var updateData = {
			name: req.body.name,
			year: req.body.year,
			term: req.body.term
		};

		Course.update( { _id: req.body.courseId }, updateData, function(err, affected) {
			if(err) {
				res.redirect('/course/view/' + req.body.courseId);
			} else {
				res.redirect('/courses');
			}
		});

	});


	app.get('/course/delete/:selectedCourse', function (req, res) {

		// check if a user in in the course, if true than do not delete
		User.findOne( {course: req.params.selectedCourse}, function (error, docs) {
			if (!docs && !err) {
				Course.remove( { _id: req.params.selectedCourse }, function (err, affected) {
					if(err) {
						console.log(err);
					}
				});
			}
			console.log('Users still being in that course');
			res.redirect('/courses');
		});

	});

	app.get('/course/new', function(req, res) {

	  User.find({}, function (err, docs) {

	  	res.render('course/manage/new', {
		    title: 'New Course',
		    message: req.flash('error'),
		    users: docs,
		    course: { id: 'abc'}
		});

	  });

	});

	// exam edit
	app.get('/course/edit/:selectedCourse', function (req, res) {

		Course
			.findById(req.params.selectedCourse)
			.populate('userlist')
			.exec(function (err, docs) {

				res.render('course/manage/edit', {
			  		title: 'Edit Course',
			  		message: req.flash('error'),
			  		course: docs
			  	});

			})

	});

	// Course detail view
	app.get('/course/view/:selectedCourse', function (req, res) {

		Course
			.findById(req.params.selectedCourse)
			.populate('userlist')
			.exec(function (err, docs) {

				res.render('course/view/details', {
			  		title: 'View Course',
			  		message: req.flash('error'),
			  		course: docs
			  	});

			})

	});

}