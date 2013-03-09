var mongoose = require('mongoose')
  , Validator = require('validator').Validator;

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , val = new Validator();

Validator.prototype.error = function(msg) {
    return false;
};

var CourseSchema = new Schema({

  name: {
  	type: String,
  	required: true
  },

  year: {
    type: Integer,
    required: true
  },

  //Sommersemester/Wintersemester
  term: {
    type: String,
    'enum': ['winter', 'summer'],
    default: 'winter',
    required: true
  },

  userlist: {
    type: [User]
  }

});

module.exports = mongoose.model('Course', CourseSchema);