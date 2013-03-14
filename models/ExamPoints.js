module.exports = function(User, Exam, CriteriaPoints) {

  var mongoose = require('mongoose')
  , Validator = require('validator').Validator;

  var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , val = new Validator();

  Validator.prototype.error = function(msg) {
    return false;
  };

  var ExamPointsSchema = new Schema({

    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    },

    exam: {
      type: Schema.ObjectId,
      ref: 'Exam',
      required: true
    },

    points: {
      type: Number,
      required: true
    },

    criteriaPoints: {
      type: [CriteriaPoints],
      required: true
    }

  });

  return mongoose.model('ExamPoints', ExamPointsSchema);

}
