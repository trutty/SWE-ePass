module.exports = function( mongoose, Schema ){

	var Exam = new Schema({

		name:		{ type: String, required: true },
		user:		{ type: Schema.ObjectId, ref: 'User' },
		assessor:	[{ type: Schema.ObjectId, ref: 'User' }],
		course:		[{ type: Schema.ObjectId, ref: 'Course' }],
		lecture:	{ type: String, required: true },
		date:		{ type: Date, required: true, default: new Date() },
		duration:	{ type: Number },
		criteria:	[{ type: Schema.ObjectId, ref: 'Criteria'}],
		
		tolerance:	{ type: Number, default: 0.25, required: true },
		gradeType:	{ type: String, enum: ['discrete', 'continuous'], default: 'discrete', required: true},
		mapping:	{ type: String, enum: ['dhbw', 'pass1', 'pass2', 'pass3'], default: 'dhbw', required: true}

	});

	return Exam;

}