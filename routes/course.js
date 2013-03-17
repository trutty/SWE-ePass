
/*
 * Routes for course creation, manipulation and view
 */

module.exports = function(app, async, User, Course){


	app.get('/courses', function(req, res) {
	  res.render('course/view/course',
	  	{
	  		title: 'Courses', 
	  		message: req.flash('error') 
	  	}
	  );
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

	app.get('/course/new', function(req, res) {
	  console.log(User)
	  User.find({}, function (err, docs) {

	  	res.render('course/manage/new',
		  {
		    title: 'New Course',
		    message: req.flash('error'),
		    users: docs,
		    course: { id: 'abc'}
		  }
		);

	  });

	});

	app.get('/course/edit', function(req, res) {
		res.render('/course/manage/edit');
	});

	// exam edit
	app.get('/course/edit/:selectedCourse', function(req, res, examInformation) {
	  res.render('course/manage/edit', { title: 'New Course', message: req.flash('error'), information: { accessor: ['accessor 1', 'accessor 2'], course: ['course 1', 'course 2']} });
	});

	// Course detail view
	app.get('/course/view/:selectedCourse', function(req, res) {
	  console.log(req.flash);
	  res.render('course/view/details', { title: 'Course Details', message: req.flash('error'), course: req.params.selectedCourse });
	});
}