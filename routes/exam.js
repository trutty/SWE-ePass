/*
 * Routes for exam creation, manipulation and view
 */

module.exports = function (app, ensureLoggedIn, User, Course, Criteria, Exam, ExamPoints, async){

	// exam overview
	app.get('/exam',
		ensureLoggedIn('/login'),
		function (req, res) {


		var exams = [];

		Exam
			.find({})
			.populate('course', 'userlist')
			.or([{'assessor': req.user.id}, {'user': req.user.id}, {'course.userlist': req.user.id}])
			.exec(function (error, docs) {
				res.render('exam/view/exam', {
					title: 'Exams',
					message: req.flash('error'),
					exam: docs,
					user: req.user
				});
			});

	});

	// exam create
	var createEditExam = function( req, res, selectedExam ) {

		var courses 	= []
		  , assessors 	= []
		  , tutors 		= []
		  , exam 		= null;

		async.series([
			function (callback) {
				if(selectedExam) {

					Exam.findOne({ _id : selectedExam })
						.populate('user')
						.populate('course')
						.populate('assessor')
						.populate('criteria')
						.exec( function( err, docsExam ) {
							exam = docsExam;
							callback(err);
						});
				} else {
					callback();
				}
			},
			function (callback) {
				Course.find({}, function (err, docsCourse) {
					courses = docsCourse;
					callback(err);
				});
			},
			function (callback) {
				User.find( {role: 'assessor'}, function (err, docsAssessor) {
					
					docsAssessor.forEach(function(item){
						var assessor 		= {};
						assessor.name 		= item.name;
						assessor.firstname	= item.firstname;
						assessor.lastname 	= item.lastname;
						assessor.id 		= item.id;

						assessors.push(assessor);
					});

					callback(err);
				});
			},
			function (callback) {
				User.find({role: 'tutor'}, function (err, docsTutor) {	

					docsTutor.forEach(function(item){
						var tutor 		= {};
						tutor.name 		= item.name;
						tutor.firstname	= item.firstname;
						tutor.lastname 	= item.lastname;
						tutor._id 		= item.id;

						tutors.push(tutor);
					});

					callback(err);

				});

			}

		], function(error) {
            
            
			res.render('exam/manage/new', {
				title: exam == null ? 'New Exam' : 'Update Exam',
	    		message: req.flash('error'),
	    		tutors: tutors,
	    		registered: req.user,
				courses: courses,
				assessors: assessors.concat(tutors),
				exam: exam,
				user: req.user
			});

		});

	};

	app.get('/exam/new',
		ensureLoggedIn('/login'),
		function (req, res) {

		createEditExam(req, res, null);
	});

	app.get('/exam/edit/:selectedExam',
		ensureLoggedIn('/login'),
		function (req, res) {

		createEditExam(req, res, req.params.selectedExam);
	});

	// exam detail view
	app.get('/exam/view/:selectedExam',
		ensureLoggedIn('/login'),
		function (req, res) {


		Exam
			.findById(req.params.selectedExam)
			.populate('user')
			.populate('assessor')
			.populate('course')
			.populate('criteria')
			.exec(function (error, docs) {

				res.render('exam/view/details', {
					title: 'Exam Details',
					message: req.flash('error'),
					exam: docs,
					user: req.user
				});

			});

		res.render('exam/manage/new', {
				title: exam == null ? 'New Exam' : 'Update Exam',
	    		message: req.flash('error'),
	    		tutors: tutors,
	    		registered: req.user,
				courses: courses,
				assessors: assessors.concat(tutors),
				exam: exam,
				user: req.user
			});
		
	});

	app.get('/exam/assess/:selectedExam',
		ensureLoggedIn('/login'),
		function (req, res) {

		Exam
			.findOne({ _id : req.params.selectedExam })
			.populate('user')
			.populate('course', 'userlist')
			.populate('assessor')
			.populate('criteria')
			.exec( function( err, docsExam ) {
				if(!err) {

                    console.log("Exam:\n-------");
                    console.log(docsExam);
                    console.log("--------");
                    console.log(docsExam.course);
                    console.log("--------");
					
                    res.render('exam/manage/assess', {
						title: 'Assess Exam',
			    		message: req.flash('error'),
						exam: docsExam,
						user: req.user
					});
				}
			});

	});

	app.get('/exam/delete/:selectedExam', ensureLoggedIn('/login'), function (req, res) {

		// TODO do a cascaded deletion
		Exam.remove( { _id: req.params.selectedExam }, function (err, aff) {
			if (err) {
				console.log(err);
			}
		});
		ExamPoints.remove( { exam: req.params.selectedExam }, function (err, aff) {
			if (err) {
				console.log(err);
			}
		});

		res.redirect('/exam');

	});


	var saveOrUpdateExam = function (req, res, selectedExam) {

		var examBody 		= req.body;
		examBody.course 	= req.body.course;
		examBody.assessor 	= req.body.assessor;
		examBody.user 		= req.body.tutor[0];

		var criterias = [];
		if(!selectedExam) {
			req.body.criteria.forEach(function (item, index) {
				var newCriteria = new Criteria(item);
				newCriteria.save(function(err) {
					console.log("err" + err);
				});
				criterias.push(newCriteria.id);
			});
		} else {
			criterias = examBody.criteria;
		}

		if(selectedExam) {

			var criterias = [];
			var oldCriteria = [];
			Exam.findById(selectedExam, function (error, docs) {

				docs.criteria.forEach(function (id, index) {
					oldCriteria.push(id);
				});

				examBody.criteria.forEach(function(crit) {

                    if (oldCriteria.indexOf(crit.id) != -1) {

						oldCriteria.remove(crit.id);
						criterias.push(crit.id);
						Criteria.update( {_id: crit.id}, crit, function (err) {
							if(err) {
								console.log("err: " + err);
							}
						});
					} else {
                    
						var newCriteria = new Criteria(crit);
						newCriteria.save(function(err) {
							console.log("err: " + err);
						});
						criterias.push(newCriteria.id);
					}
				});


				oldCriteria.forEach(function (oc) {
					Criteria.remove({ _id: oc }, function (err) {
						if(err) {
							console.log("oldCriteria err: " + err);
						}
					});
				});

				examBody.criteria = criterias;

				Exam.update( { _id: selectedExam }, examBody, function(err, affected) {
                    console.log(examBody);

					if(err) {
						console.log('Update Exam Error: %s', err);
						res.redirect('/exam/edit/' + selectedExam);
					} else {
						res.redirect('/exam');
					}
				});

			});

		} else {

			var exam 			= new Exam(examBody);

			exam.save(function (err) {
				if(!err) {
					res.redirect('/exam');
				} else {
					console.log(examBody);
					console.log(err);
				}
			});

		}

	};

	app.post('/exam/new',
		ensureLoggedIn('/login'),
		function (req, res) {

		saveOrUpdateExam(req, res, null);
	});

	app.post('/exam/update/:selectedExam',
		ensureLoggedIn('/login'),
		function (req, res) {

		saveOrUpdateExam(req, res, req.params.selectedExam);
	});

	app.post('/exam/assess/:selectedExam',
		ensureLoggedIn('/login'),
		function (req, res) {


		Criteria.findById('515bee674b2dd9d2c5000004', function(error, criteria) {
			console.log("muh");
			console.log(error);
			console.log(criteria);
			console.log('mäh');
		});

		Exam.findById(req.params.selectedExam, function(error, exam) {
			exam.criteria.forEach(function(item, index) {
				console.log(item._id);
			});
		});


		/*
		var criteriaBody = req.body;
		criteriaBody.criteria = req.body.criteria;

		console.log(criteriaBody.criteria[0].subcriteria[1]);

		var criteria = new Criteria(criteriaBody.criteria);
		criteria.save(function (err) {
			if (err) {
				console.log(err);
				res.redirect('/exam/assess/' + req.params.selectedExam);
			}
		});
		*/

	});	

}
