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
  
  score: {
    type: Number,
    required: true
  },

  criteria: {
    type: [Criteria],
    required: true
  }

});

module.exports = mongoose.model('Exam', CriteriaSchema);
