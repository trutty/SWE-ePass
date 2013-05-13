module.exports = function( mongoose, Schema ){

	var ExamPoints = new Schema({

		user:		{ type: Schema.ObjectId, ref: 'User', required: true },
		exam:		{ type: Schema.ObjectId, ref: 'Exam', required: true },
		criteriaPoints:	{ type: [{ type: Schema.ObjectId, ref: 'CriteriaPoints'}], required: true }

	});

	return ExamPoints;

}