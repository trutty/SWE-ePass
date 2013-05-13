
/**
 * Module dependencies.
 */
 

var express = require('express')
  , http = require('http')
  , path = require('path')
  , async = require('async')
  , flash = require('connect-flash')
  , passport = require('passport')
  , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose')
  , mongoStore = require('connect-mongodb')
  , Schema = mongoose.Schema

  , Validator = require('validator').Validator
  , crypto = require('crypto')

  , User = require('./models/User.js')(mongoose, Validator, crypto, Schema) // returns User Schema
  , Course = require('./models/Course.js')(mongoose, Schema) // returns Course Schema
  , Criteria = require('./models/Criteria.js')(mongoose, Schema) // returns Criteria Schema
  , Exam = require('./models/Exam.js')(mongoose, Schema) // returns Exman Schema

  , CriteriaPoints = require('./models/CriteriaPoints.js')(mongoose, Schema) // returns Criteria Points Schema
  , ExamPoints = require('./models/ExamPoints.js')(mongoose, Schema) // returns Exam Points Schema
  
  ;

var app = express();

// turn Schemata into Models
User = mongoose.model('User', User);
Course = mongoose.model('Course', Course);
Criteria = mongoose.model('Criteria', Criteria);
Exam = mongoose.model('Exam', Exam);
CriteriaPoints = mongoose.model('CriteriaPoints', CriteriaPoints);
ExamPoints = mongoose.model('ExamPoints', ExamPoints);

app.configure(function(){
  app.set('port', process.env.PORT || 9999);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session(
    {
      secret: 'thereisahell'
    }
  ));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {

        process.nextTick(function () {

          User.findOne({ username: username }, function( err, user ) {

            if(err) { return done(err); }
            if( !user ) { return done(null, false, {message: 'Unknown User ' + username}); }
            if( !user.validPassword(password) ) { return done(null, false, {message: 'Invalid password'}); }

            return done(null, user);

          })

        });
  }
));

var requireRoles = function(roles) {
  return function(req, res, next) {
    if(req.user && roles.indexOf(req.user.role) > -1)
      next();
    else
      res.send(403);
  }
}

app.configure('development', function(){
  app.use(express.errorHandler());
});

//small test for git
mongoose.connect("mongodb://localhost:27017/epass", function(err){
    if(err) console.log(err);
});


// Routes
require('./routes')(app, User, passport, requireRoles); // user auth
require('./routes/exam')(app, ensureLoggedIn, User, Course, Criteria, Exam, ExamPoints, CriteriaPoints, async, requireRoles);
require('./routes/criteria')(app, ensureLoggedIn, requireRoles);
require('./routes/course')(app, ensureLoggedIn, async, User, Course, Exam, requireRoles);
require('./routes/api')(app, User, Course, Exam, ExamPoints, requireRoles);
require('./routes/user')(app, ensureLoggedIn, async, User, Course, requireRoles);

app.enable('trust proxy');
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
