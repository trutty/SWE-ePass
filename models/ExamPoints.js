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
  	type: User,
  	required: true
  },
  
  exam: {
    type: Exam,
    required: true
  },

  points: {
    type: Integer,
    required: true
  },

  criteriaPoints: {
    type: [CriteriaPoints],
    required: true;
  }

});

module.exports = mongoose.model('ExamPoints', ExamPointsSchema);
