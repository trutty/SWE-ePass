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
  	type: User,
  	required: true
  },
  
  criteria: {
    type: Criteria,
    required: true
  },

  points: {
    type: Integer,
    required: true
  }

});

module.exports = mongoose.model('CriteriaPoints', CriteriaPointsSchema);
