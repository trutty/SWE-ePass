module.exports = function( mongoose, Validator, crypto, Schema ){

	var val = new Validator();

	Validator.prototype.error = function( msg ) {
		return false;
	}

	var User = new Schema({

		firstname:		{ type: String, required: true },
		lastname:		{ type: String, required: true },
		studentNumber:	{ type: String },
		username:		{ type: String, required: true, unique: true },
		emailAddress:	{ type: String, required: true, lowercase: true },
		passwordHash:	{ type: String, required: true },
		role:			{ type: String, required: true,
						  enum: ['user', 'tutor', 'assessor', 'student', 'manager'],
						  default: 'user'
						  }

	});

	User.virtual('name').get( function() {
		return this.firstname + " " + this.lastname;
	});

	User.virtual('newUser')
		.get( function() {
			return this._newUser;
		})

		.set( function( value ) {
			this._newUser = value;
		});

	User.virtual('password')
		.get( function() {
			return this._password;
		})

		.set( function( value) {
			this._password = value;
			var salt = crypto.createHash('sha512');
			this.passwordHash = salt.update( value ).digest('hex');
		});

	User.virtual('passwordConfirm')
		.get( function() {
			return this._passwordConfirm;
		})

		.set( function( value ) {
			this._passwordConfirm = value;
		});

	User.path('passwordHash').validate( function(v) {
		if (this._password || this._passwordConfirm) {
			if (this._password.length < 6) {
				this.invalidate('password', 'The password must be at least 6 characters long.');
			}

			if (this._password !== this._passwordConfirm) {
				this.invalidate('passwordConfirm', 'The password must match confirmation.');
			}
		}

		if (this._newUser && !this._password) {
			this.invalidate('password', 'You have to provide a password.');
		}
	}, null);

	User.methods.validPassword = function( password ) {
		var passwordHash = crypto.createHash('sha512').update(password).digest('hex');

		if ( passwordHash === this.passwordHash ) {
			return true;
		}

		return false;
	}

	User.path('emailAddress').validate( function (v) {
		if (!val.check(v).isEmail()) {
			this.invalidate('emailAddress', 'Must be a valid email address.');
		}
	}, null);


	return User;

}
