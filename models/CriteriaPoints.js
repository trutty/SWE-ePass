module.exports = function(Criteria){

  var mongoose = require('mongoose')
  , Validator = require('validator').Validator;

  var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , val = new Validator();

  Validator.prototype.error = function(msg) {
    return false;
  };

  var CriteriaPointsSchema = new Schema({

    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    },

    criteria: {
      type: Schema.ObjectId,
      ref: 'Criteria',
      required: true
    },

    points: {
      type: Number,
      required: true
    }

  });

  return mongoose.model('CriteriaPoints', CriteriaPointsSchema);

}
