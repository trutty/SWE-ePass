module.exports = function( mongoose, Schema ){

	var CriteriaPoints = new Schema({

		user:		{ type: Schema.ObjectId, ref: 'User', required: true },
		criteria:	{ type: Schema.ObjectId, ref: 'Criteria', required: true },
		points:		{ type: Number, required: true }

	});

	return CriteriaPoints;

}