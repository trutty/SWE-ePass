module.exports = function(app, User, Course, Exam){

	app.get('/api/students/:type/:attr', function (req, res) {
		if(req.params.type == 'az') {
			var position = 0;
			var splitting = req.params.attr;

			User.find({}, function (err, docs) {
				console.log(docs);
				res.json(docs);
			});
			
		}

		if(req.params.type == 'course') {
			var courseId = req.params.attr;

			console.log(courseId);
		}
	});


}