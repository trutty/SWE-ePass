module.exports = function( mongoose, Schema ){

	var Exam = new Schema({

		name:		{ type: String, required: true },
		user:		{ type: Schema.ObjectId, ref: 'User' },
		assessor:	[{ type: Schema.ObjectId, ref: 'User' }],
		course:		[{ type: Schema.ObjectId, ref: 'Course' }],
		lecture:	{ type: String, required: true },
		date:		{ type: Date, required: true, default: new Date() },
		duration:	{ type: Number },
		maxPoints:	{ type: Number, required: true },
		criteria:	[{ type: Schema.ObjectId, ref: 'Criteria'}]

	});

	return Exam;

}