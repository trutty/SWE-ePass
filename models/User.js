var mongoose = require('mongoose')
  , crypto = require('crypto')
  , uuid = require('node-uuid')
  , Validator = require('validator').Validator;

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
  	required: true
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
  	'default': false,
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
  	'enum': ['user' 'tutor', 'evaluator', 'student', 'manager'],
  	'default': 'user',
  	required: true
  }
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
        if (!val.check(this._password).min(6)) {
            this.invalidate('password', 'must be at least 6 characters.');
        }
        if (this._password !== this._passwordConfirm) {
            this.invalidate('passwordConfirm', 'must match confirmation.');
        }
    }
    if (this.isNew && !this._password) {
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

module.exports = mongoose.model('User', UserSchema);
