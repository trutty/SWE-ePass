var mongoose = require('mongoose')
  , Validator = require('validator').Validator;

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , val = new Validator();

Validator.prototype.error = function(msg) {
    return false;
};

var UserPointsSchema = new Schema({

  userId: {
  	type: [User],
  	required: true
  },
  
  exam: {
    type: [Exam],
    required: true
  },

  points: {
    type: Integer,
    required: true
  }

});

module.exports = mongoose.model('UserPoints', UserPointsSchema);
