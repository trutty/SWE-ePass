module.exports = function( mongoose, Schema ){

	var Course = new Schema({

		name:		{ type: String, required: true, unique: true },
		year:		{ type: Number, required: true },
		term:		{ type: String, required: true,
						enum: ['winter', 'summer'],
						default: true },
		userlist:	[{ type: Schema.ObjectId, ref: 'User' }]

	});

	return Course;

}