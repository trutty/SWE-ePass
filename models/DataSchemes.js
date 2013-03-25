module.exports = function(){


  var mongoose = require('mongoose')
  , Validator = require('validator').Validator;

  var crypto = require('crypto')
  , uuid = require('node-uuid');

  var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , val = new Validator();

  Validator.prototype.error = function(msg) {
    return false;
  };

  var UserSchema = new Schema({

    firstname: {
      type: String,
      required: true
    },

    lastname: {
      type: String,
      required: true
    },

    studentNumber: {
      type: String
    },

    username: {
      type: String,
      required: true,
      unique: true
    },

    emailAddress: {
      type: String,
      lowercase: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    active: {
      type: Boolean,
      default: false,
      required: true
    },

    passwordResetToken: String,
    passwordResetExpiration: Date,

    emailConfirmationToken: {
      type: String,
      'default': uuid()
    },

    role: {
      type: String,
      'enum': ['user', 'tutor', 'assessor', 'student', 'manager'],
      'default': 'user',
      required: true
    }
  });

  UserSchema.virtual('name').get(function() {
    return this.firstname + " " + this.lastname;
  });

  UserSchema.virtual('newUser')
    .get(function() {
      console.log('am i getting');
      return this._newUser;
    })

    .set(function(value) {
      console.log('i am setting ' + value);
      this._newUser = value;
    });

  UserSchema.virtual('password')
    .get(function() {
      return this._password;
    })

    .set(function(value) {
      this._password = value;
      var salt = uuid();
      //this.passwordHash = bcrypt.encrypt_sync(value, salt);
      var cryptoSalt = crypto.createHash('sha512');
      this.passwordHash = cryptoSalt.update(value).digest('hex');
    });

  UserSchema.virtual('passwordConfirm')
    .get(function() {
      return this._passwordConfirm;
    })

    .set(function(value) {
      this._passwordConfirm = value;
    });

  UserSchema.path('passwordHash').validate(function(v) {
      if (this._password || this._passwordConfirm) {
          //if (!val.check(this._password).min(6)) {
          if((this._password).length < 6) {
            console.log('password length doesn`t match');
            this.invalidate('password', 'must be at least 6 characters.');
          }
          if (this._password !== this._passwordConfirm) {
              this.invalidate('passwordConfirm', 'must match confirmation.');
          }
      }

      console.log('newUser: ' + this.newUser);
      console.log('_newUser: ' + this._newUser);
      if (this._newUser && !this._password) {
          this.invalidate('password', 'Needed');
      }
  }, null);

  UserSchema.methods.validPassword = function( password ) {

    var passwordHash = crypto.createHash('sha512').update(password).digest('hex');

    if ( passwordHash === this.passwordHash ) {
      return true;
    }
    
    return false;
  };

  UserSchema.path('emailAddress').validate(function(v) {
      if (!val.check(v).isEmail()) {
          this.invalidate('emailAddress', 'must be a valid email address');
      }
  }, null);

  /*
  authSchema.methods.validPassword = function( pwd ) {
      // EXAMPLE CODE!
      return ( this.password === pwd );
  };
  */

  var validPassword = function(password) {
    return true;
  }

  var User = mongoose.model('User', UserSchema);


  var CourseSchema = new Schema({

    name: {
      type: String,
      required: true,
      unique: true
    },

    year: {
      type: Number,
      required: true
    },

    //Sommersemester/Wintersemester
    term: {
      type: String,
      'enum': ['winter', 'summer'],
      default: 'winter',
      required: true
    },

    userlist: [
      {
        type: Schema.ObjectId,
        ref: 'User'
      }
    ]

  });
  var Course = mongoose.model('Course', CourseSchema);
  

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
    },

    subcriteria: {
      type: [CriteriaSchema]
    }

  });

  var Criteria = mongoose.model('Critiera', CriteriaSchema);

  var ExamSchema = new Schema({

    name: {
      type: String,
      required: true
    },

    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },

    assessor: [{ type: Schema.ObjectId, ref: 'User' }],

    course: [{ type: Schema.ObjectId, ref: 'Course' }],

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
      type: Number
    },
  
    maxPoints: {
      type: Number,
      required: true
    },

    criteria: {
      type: [CriteriaSchema]
    }

  });

  var Exam = mongoose.model('Exam', ExamSchema);

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

  var CriteriaPoints = mongoose.model('CriteriaPoints', CriteriaPointsSchema);


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
      type: [CriteriaPointsSchema],
      required: true
    }

  });

  var ExamPoints = mongoose.model('ExamPoints', ExamPointsSchema);


  var dataObj = {
    criteria: Criteria,
    exam: Exam,
    user: User,
    course: Course,
    criteriaPoints: CriteriaPoints,
    examPoints: ExamPoints
  };

  return dataObj;

}
