
/*
 * Routes for exam creation, manipulation and view
 */

module.exports = function (app, User, Course, Criteria, Exam, async){
	// exam
	// exam overview
	app.get('/exam', function(req, res) {
	  res.render('exam/view/exam', { title: 'Exam Overview', message: req.flash('error') });
	});

	// exam create
	app.get('/exam/new', function(req, res) {

		var courses = []
		  , assessors = []
		  , tutors = [];

		async.series([
			
			function (callback) {
				Course.find({}, function (err, docsCourse) {
					courses = docsCourse;
					callback(err);
				});
			},
			function (callback) {
				User.find( {role: 'assessor'}, function (err, docsAssessor) {
					
					docsAssessor.forEach(function(item){
						var assessor = {};
						assessor.name = item.name;
						assessor.firstname = item.firstname;
						assessor.lastname = item.lastname;
						assessor._id = item.id;

						assessors.push(assessor);
					});

					callback(err);
				});
			},
			function (callback) {
				User.find({role: 'tutor'}, function (err, docsTutor) {	

					docsTutor.forEach(function(item){
						var tutor = {};
						tutor.name = item.name;
						tutor.firstname = item.firstname;
						tutor.lastname = item.lastname;
						tutor._id = item.id;

						tutors.push(tutor);
					});

					callback(err);

				});

			}

		], function(error) {

			res.render('exam/manage/new', {
				title: 'New Exam',
	    		message: req.flash('error'),
	    		tutors: tutors,
	    		registered: req.user,
				courses: courses,
				assessors: assessors.concat(tutors)
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

		var crits 			= [];

		var examBody 		= req.body;
		examBody.criteria 	= req.body.criteria;
		examBody.assessor 	= req.body.assessor;
		examBody.user 		= req.body.tutor[0];
		examBody.course 	= req.body.course;

		var exam 			= new Exam(examBody);

		console.log(req.body.criteria[0].subcriteria);

		exam.save(function (err) {
			console.log('error: ' + err);
		});

		// Exam
		// 	.find({})
		// 	.populate('user')
		// 	.populate('assessor')
		// 	.populate('course')

		// 	.exec(function (error, docs) {
		// 	console.log(error);
		// 	console.log(docs);
		// });

	// });
		
	});

}
