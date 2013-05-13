module.exports = function( mongoose, Schema ){

	var Criteria = new Schema({

		name:			{ type: String, required: true },
		description:	{ type: String },
		score:			{ type: Number, required: true },
		subcriteria:	[Criteria]

	});
	
	return Criteria;

}