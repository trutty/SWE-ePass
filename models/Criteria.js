var mongoose = require('mongoose')
  , Validator = require('validator').Validator;

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , val = new Validator();

Validator.prototype.error = function(msg) {
    return false;
};

var CriteriaSchema = new Schema({

  name: {
  	type: String,
  	required: true
  },

  description: {
      type: String
  },

  score: {
      type: Number,
      required: true
  }

});

module.exports = mongoose.model('Criteria', CriteriaSchema);
