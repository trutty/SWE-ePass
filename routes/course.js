
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

	app.get('/course/new', function(req, res) {

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

	// exam edit
	app.get('/course/edit/:selectedCourse', function(req, res, examInformation) {
	  res.render('course/manage/edit', { title: 'New Exam', message: req.flash('error'), information: { accessor: ['accessor 1', 'accessor 2'], course: ['course 1', 'course 2']} });
	});

	// exam detail view
	app.get('/exam/view/:selectedCourse', function(req, res) {
	  console.log(req.flash);
	  res.render('course/view/details', { title: 'Exam Details', message: req.flash('error'), exam: req.params.selectedExam });
	});
}