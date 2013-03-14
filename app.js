
/**
 * Module dependencies.
 */
 

var express = require('express')
  , http = require('http')
  , path = require('path')
  , flash = require('connect-flash')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose')
  , mongoStore = require('connect-mongodb')
  , User = require('./models/User.js')
  , Course = require('./models/Course.js')(User);

var app = express();

app.set('db-uri', 'mongodb://localhost/epass');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session(
    {
      secret: 'cockring'
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
    console.log(user);
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

// app.use(function(req, res, next){
//     // set current_user

//     //console.log(req.session);

//     if(req.session.user_id){
//         User.find({
//             _id: req.session.user_id
//         }, function(err, docs){
//             if(docs.length == 1){
//                 req.current_user = docs[0];
//             }
//             next();
//         });
//     }
//     else{
//         next();
//     }
// });

app.configure('development', function(){
  app.use(express.errorHandler());
});

mongoose.connect(app.set('db-uri'), function(err){
    if(err) console.log(err);
});


// get all users
findUsers = function() {
  User.find({}, function (err, docs) {
    return docs;
  });
}


// Routes
require('./routes')(app, passport); // user auth
require('./routes/exam')(app);
require('./routes/criteria')(app);
require('./routes/course')(app, findUsers);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
