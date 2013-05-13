module.exports = function( mongoose, Schema ){

	var Criteria = new Schema({

		name:			{ type: String, required: true },
		description:	{ type: String },
		score:			{ type: Number, required: true },
		classification: { type: Number, enum: [1, 2, 3, 4, 5], default: 3 },
		subcriteria:	[Criteria]

	});
	
	return Criteria;

}