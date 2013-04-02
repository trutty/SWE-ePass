module.exports = function( mongoose, Schema, CriteriaPoints ){

	var ExamPoints = new Schema({

		user:		{ type: Schema.ObjectId, ref: 'User', required: true },
		exam:		{ type: Schema.ObjectId, ref: 'Exam', required: true },
		points:		{ type: Number, required: true },
		criteriaPoints:	{ type: [CriteriaPoints], required: true }

	});

	return ExamPoints;

}