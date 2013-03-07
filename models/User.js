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
  	'enum': ['user', 'admin'],
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
  	this.passwordHash = bcrypt.encrypt_sync(value, salt);
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
            this.invalidate('password2', 'must match confirmation.');
        }
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Benötigt');
    }
}, null);

UserSchema.path('emailAddress').validate(function(v) {
    if (!val.check(v).isEmail()) {
        this.invalidate('emailAddress', 'must be a valid email address');
    }
}, null);

module.exports = mongoose.model('User', UserSchema);