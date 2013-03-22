
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

		var ObjectId = require('mongoose').Types.ObjectId;

		var crits = [];
		var courses = [];

		async.forEach(req.body.course, function (itemCourse, courseCallback) {
			
			console.log('id: %s', itemCourse);
			var id = new ObjectId(itemCourse);

			User.findById(id, function (err, docsCourse) {

				console.log('docsCourse: ' + docsCourse);

				courseCallback(err);
			});
			
		});

		console.log('Course Objects: ' + courses);

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
			examBody.course = courses;

			var exam = new Exam(examBody);

			/*
			exam.save(function (err) {
				console.log(errFromCriteria);
				console.log(err);
			});
			*/

		});

	});

}
