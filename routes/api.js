var async = require('async');
var alphabet = [
	
	['a', 'ä'],
	['b'],
	['c'],
	['d'],
	['e'],
	['f'],
	['g'],
	['h'],
	['i'],
	['j'],
	['k'],
	['l'],
	['m'],
	['n'],
	['o', 'ö'],
	['p'],
	['q'],
	['r'],
	['s'],
	['t'],
	['u', 'ü'],
	['v'],
	['w'],
	['x'],
	['y'],
	['z']

];

module.exports = function(app, User, Course, Exam){

	app.get('/api/students/:type/:attr', function (req, res) {
		if(req.params.type == 'az') {
			var splitting = req.params.attr;

			//build request alphabet
			var splittedAlphabet = [];
			for (var i = 0; i < alphabet.length; i++) {
				
				if(i % splitting == 0) {
					
					if(splittedAlphabet.length > 0) {
						splittedAlphabet[splittedAlphabet.length - 1].push(alphabet[i - 1]);
					}

					splittedAlphabet[splittedAlphabet.length] = [alphabet[i]];

				}

			};
			splittedAlphabet[splittedAlphabet.length - 1].push(alphabet[alphabet.length - 1]);

			var splittedUsers = [];
			async.forEach(splittedAlphabet, function (item, callback) {
				
				var re = new RegExp('^([' + item[0][0] + '-' + item[1][0] + '])', 'i');

				User.find({ lastname: re }, function (err, docs) {
					var cat = {};
					cat.categoryName = item[0][0] + '-' + item[1][0];
					cat.categoryItems = docs;

					splittedUsers.push(cat);
					callback();
				});

			}, function (err) {
				res.json(splittedUsers);
			});
		}

		if(req.params.type == 'course') {
			var courseId = req.params.attr;

			/*Course.findOne({ _id: courseId }, function (err, doc) {
				
				console.log(err);

				var courseUsers = [];
				
				var course = {};
				course.categoryName = doc.name;
				course.categoryItems = doc.userlist;

				courseUsers.push(course);
				res.json(courseUsers);
			});
			*/

			var cat = {};
			cat.categoryName = "Kurs TINF11A";
			cat.categoryItems = [];

			res.json([cat]);
		}
	});


}