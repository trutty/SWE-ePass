var mongoose = require('mongoose')
  , Validator = require('validator').Validator;

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , val = new Validator();

Validator.prototype.error = function(msg) {
    return false;
};

var ExamSchema = new Schema({

  name: {
  	type: String,
  	required: true
  },

  //user is tutor
  user: {
    type: User,
    required: true
  },

  accessor: {
    type: User
  },

  course: {
    type: [Course]
  },

  lecture: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: new Date(),
    required: true
  },

  //duration in minutes
  duration: {
    type: Integer
  }
  
  maxPoints: {
    type: Integer,
    required: true
  },

  criteria: {
    type: [Criteria],
    required: true
  }

});

module.exports = mongoose.model('Exam', CriteriaSchema);
