/*
 * Routes for exam creation, manipulation and view
 */

//ref: http://dreaminginjavascript.wordpress.com
function productRange(a, b) {
	var product = a, i = a;

	while (i++ < b) {
		product *= i;
	}

	return product;
}

function combinations(n, k) {
	if (n == k) {
		return 1;
	} else {
		k = Math.max(k, n - k);
		return productRange(k+1, n) / productRange(1, n-k);
	}
}

function array_sum(myArray) {
	var sum = 0;
	for (var i = 0; i < myArray.length; i++) {
		sum = sum + myArray[i];
	}
	return sum;
};

module.exports = function (app, ensureLoggedIn, User, Course, Criteria, Exam, ExamPoints, CriteriaPoints, async){

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

		async.parallel({

			exam: function(callback) {
				Exam
					.findById(req.params.selectedExam)
					.populate('user')
					.populate('assessor')
					.populate('course')
					.populate('criteria')
					.exec(function (error, doc) {
						callback(error, doc);
					});
			},

			examPoints: function(callback) {
				ExamPoints
					.findOne({'exam': req.params.selectedExam, 'user': req.user})
					.populate('criteriaPoints')
					.exec(function (error, doc) {
						callback(error, doc);
					});
			}

		}, function(err, results) {

			var classificationPoints = [];
			classificationPoints[0] = 0;
			classificationPoints[1] = 0;
			classificationPoints[2] = 0;
			classificationPoints[3] = 0;
			classificationPoints[4] = 0;

			results.examPoints.criteriaPoints.forEach(function (cp) {
				results.exam.criteria.forEach(function (crit) {
					if(cp.criteria + "" == crit._id + "") {
						classificationPoints[parseInt(crit.classification) - 1] += parseInt(cp.points);
					}
				});
			});

			var cf = [];
			for (var i = 0; i < classificationPoints.length; i++) {
				cf[i] = classificationPoints[i];
				for (var j = 0; j < i; j++) {
					cf[i] += classificationPoints[j];
				};
			};


			var fc = [];
			for (var i = 0; i < classificationPoints.length; i++) {
				fc[i] = classificationPoints[i];
				for (var j = i+1; j < classificationPoints.length; j++) {
					fc[i] += classificationPoints[j];
				};
			};

			var xf = [];
			for (var i = 0; i < classificationPoints.length; i++) {
				xf[i] = combinations(cf[i]+i, i+1);
			};

			xf.splice(xf.length - 1, 1);
			var exf = array_sum(xf);

			var fx = [];
			for (var i = 0; i < classificationPoints.length; i++) {
				fx[i] = combinations(fc[i]+classificationPoints.length-i-1, classificationPoints.length-i);
			};

			fx.splice(0, 1);
			var efx = array_sum(fx);

			var n = array_sum(classificationPoints);
			var profiles = combinations(n+classificationPoints.length-1, classificationPoints.length-1);

			var us = 1;
			if(profiles - 1 > 0)
				us = 1 - exf / (profiles - 1);

			var ls = 0;
			if(profiles - 1 > 0)
				ls = efx / (profiles - 1);


			console.log("tolerance: %s", results.exam.tolerance);
			var tolerance = results.exam.tolerance;

			var tauScore = (1 - tolerance) * Math.min(us, ls) + tolerance * Math.max(us, ls);
			var grade = Math.floor(Math.max(1, 5 * Math.pow((1 - Math.floor(Math.pow(tauScore, 1.508) * 1000) / 1000), (1 / 1.508))) * 100) / 100;

			var discrete = {
				'xf': xf,
				'cf': cf,
				'pts': classificationPoints,
				'fc': fc,
				'fx': fx,
				'exf': exf,
				'efx': efx,
				'n': n,
				'profiles': profiles,
				'us': us,
				'ls': ls,
				'tauScore': tauScore,
				'grade': grade
			}

			var grade = discrete;

			res.render('exam/view/details', {
				title: 'Exam Details',
				message: req.flash('error'),
				exam: results.exam,
				examPoints: results.examPoints,
				user: req.user,
				grade: grade
			});
		});

		
	});

	app.get('/exam/assess/:selectedExam',
		ensureLoggedIn('/login'),
		function (req, res) {

		Exam
			.findOne({ _id : req.params.selectedExam })
			.populate('user')
			.populate('course')
			.populate('assessor')
			.populate('criteria')
			.exec( function( err, docsExam ) {
				if(!err) {

					var courses = [];
					async.forEach(docsExam.course, function(item, callback) {

						User.find({'_id': { $in: item.userlist }},
							function(err, docs) {

								var course = item.toObject();
								course.userlist = docs;
								courses.push(course);

								callback();
							});

					}, function(err) {

						res.render('exam/manage/assess', {
							'title': 'Assess Exam',
							'message': req.flash('error'),
							'exam': docsExam,
							'courses': courses,
							'user': req.user
						});

					});

                }
			});

	});

	app.get('/exam/delete/:selectedExam', ensureLoggedIn('/login'), function (req, res) {

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

		console.log(req.body);

		var criterias = [];
		if(!selectedExam) {
			req.body.criteria.forEach(function (item, index) {
				var newCriteria = new Criteria(item);
				newCriteria.save(function(err) {
					if(err)
						console.log("criteria creation err: " + err);
				});
				criterias.push(newCriteria.id);
			});

			examBody.criteria = criterias;
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

			async.waterfall([

				function (callback) {

					ExamPoints.findOne(
						{
							'user': req.body.student,
							'exam': req.params.selectedExam
						})
						.populate('criteriaPoints')
						.exec(function(err, doc) {
							callback(err, doc);
						});

				},

				function ( examPoint, callback ) {

					if(examPoint != null) {
						
						//collection.update(selector, document, {upsert:true});
						var criteriaPoints = [];
						async.forEach(req.body.criteria, function(criteria, callback) {

							CriteriaPoints.findOne(
								{
									'user': req.body.student,
									'criteria': criteria.id
								}, function(err, cp) {

									if(!cp) {
										cp = new CriteriaPoints();
										cp.set('user', req.body.student);
										cp.set('criteria', criteria.id);
									}

									cp.set('points', criteria.assessScore);
									cp.set('subpoints', []);

									if(criteria.subcriteria != undefined)
										criteria.subcriteria.forEach(function(subcriteria) {
											cp.subpoints.push({'myId': subcriteria.myId, 'assessScore': subcriteria.assessScore});
										});

									cp.save(function(err) {
										criteriaPoints.push(cp);
										callback(err);
									})

								}
							);

						}, function(err) {

							examPoint.set('points', req.body.assessMaxPoints);
							examPoint.set('criteriaPoints', criteriaPoints);

							callback(err, examPoint);

						});

					} else {

						var criteriaPoints = [];
						async.forEach(req.body.criteria, function(criteria, callback) {
							var criteriaPoint = new CriteriaPoints();

							criteriaPoint.set('user', req.body.student);
							criteriaPoint.set('criteria', criteria.id);
							criteriaPoint.set('points', criteria.assessScore);

							if(criteria.subcriteria != undefined)
								criteria.subcriteria.forEach(function(subcriteria) {
									criteriaPoint.subpoints.push({'myId': subcriteria.myId, 'assessScore': subcriteria.assessScore});
								});

							criteriaPoint.save(function(err) {
								criteriaPoints.push(criteriaPoint);
								callback(err);
							});

						}, function(err) {

							examPoint = new ExamPoints();

							examPoint.set('user', req.body.student);
							examPoint.set('exam', req.params.selectedExam);
							examPoint.set('points', req.body.assessMaxPoints);
							examPoint.set('criteriaPoints', criteriaPoints);

							callback(err, examPoint);

						});

					}
				}

			], function(err, result) {

				result.save(function(error) {
					if(error) {
						console.log(error);
						res.redirect('/exam/assess/' + req.params.selectedExam);
					} else {
						res.redirect('/exam');
					}
				});

			});

	});	

}
