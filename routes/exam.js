
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
					assessors = docsAssessor;
					callback(err);
				});
			},
			function (callback) {
				User.find({role: 'tutor'}, function (err, docsTutor) {					
					tutors = docsTutor;
					callback(err);
				});
			}

		], function(error) {

			console.log(req.user);
			console.log(courses);

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

		var crits = [];
		async.forEach(req.body.criteria, function (item, callback) {
			
			var subcrits = [];
			if(item.subcriteria) {

				async.forEach(item.subcriteria, function (subitem, subCallback){

					var subcriteria = new Criteria(subitem);
					subcriteria.save(function (err) {
						if(err) {
							subCallback(err);
						}
					});

					subcrits.push(subcriteria);
					subCallback();

				}, function (err) {


					console.log(subcrits);
					item.criteria = subcrits;

					var criteria = new Criteria(item);
					criteria.save(function (err) {
						if(err){
							callback(err);
						}
					});

					crits.push(criteria);
					callback();

				});

			} else {

				var criteria = new Criteria(item);
				criteria.save(function (err) {
					if(err){
						callback(err);
					}
				});

				crits.push(criteria);
				callback();				
			}
			
		}, function (errFromCriteria) {

			var examBody = req.body;
			examBody.criteria = crits;

			var exam = new Exam(examBody);
			exam.save(function (err) {
				console.log(errFromCriteria);
				console.log(err);
			});

		});

	});

}
