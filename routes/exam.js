
/*
 * Routes for exam creation, manipulation and view
 */

module.exports = function(app, User, Course, Criteria, Exam){
	// exam
	// exam overview
	app.get('/exam', function(req, res) {
	  res.render('exam/view/exam', { title: 'Exam Overview', message: req.flash('error') });
	});

	// exam create
	app.get('/exam/new', function(req, res) {

		Course.find({}, function (err, docs) {
			User.find({role: 'assessor'}, function(err, result) {
				res.render('exam/manage/new',
	    		{
	    			title: 'New Exam',
	    			message: req.flash('error'),
	    			tutor: req.user,
	    			courses: docs,
	    			assessors: result
	    		});
			});
		});

	});

	// exam edit
	app.get('/exam/edit/:selectedExam', function(req, res, examInformation) {
	  res.render('exam/manage/new', { title: 'New Exam', message: req.flash('error'), information: { accessor: ['accessor 1', 'accessor 2'], course: ['course 1', 'course 2']} });
	});

	// exam detail view
	app.get('/exam/view/:selectedExam', function(req, res) {
	  console.log(req.flash);
	  res.render('exam/view/details', { title: 'Exam Details', message: req.flash('error'), exam: req.params.selectedExam });
	});

	app.post('/exam/new', function(req, res) {
		//console.log(req.body);

		var exam = new Exam(req.body);
		exam.save(function(err) {
	    	if(err) {
	      		console.log(err);
	    	}
		});
	});

}
