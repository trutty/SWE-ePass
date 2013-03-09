
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , flash = require('connect-flash')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose')
  , mongoStore = require('connect-mongodb')
  , User = require('./models/User.js');

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
  app.use(require('stylus').middleware(__dirname + '/public'));
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


// Routes
app.get('/', function(req, res) {
  res.render('index', { title: 'Express', user: req.user });
});

app.get('/login', function(req, res) {
  res.render('login', { title: 'Login', message: req.flash('error'), user: req.user });
});

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.get('/signup', function(req, res, signupInformation) {
  res.render('signup', { title: 'Signup', message: req.flash('error'), information: signupInformation});
});

app.get('/signup1', function(req, res, signupInformation) {
  res.render('signup1', { title: 'Signup1', message: req.flash('error'), information: signupInformation});
});

// exam
// exam overview
app.get('/exam', function(req, res) {
  res.render('exam/view/exam', { title: 'Exam Overview', message: req.flash('error') });
});



// exam create
app.get('/exam/new', function(req, res, examInformation) {
  res.render('exam/manage/new', { title: 'New Exam', message: req.flash('error'), information: { accessor: ['accessor 1', 'accessor 2'], course: ['course 1', 'course 2']} });
});

// exam edit
app.get('/exam/edit/:selectedExam', function(req, res, examInformation) {
  res.render('exam/manage/new', { title: 'New Exam', message: req.flash('error'), information: { accessor: ['accessor 1', 'accessor 2'], course: ['course 1', 'course 2']} });
});

// exam detail view
app.get('/exam/view/:selectedExam', function(req, res) {
  console.log(req.flash);
  res.render('exam/view/details', { title: 'Exam Details', message: req.flash('error'), exam: req.params.selectedExam });
});

app.post('/login',
  passport.authenticate(
        'local',
        {  successRedirect: '/',
           failureRedirect: '/login',
           failureFlash: true
        }
  )
);

app.post('/signup', function(req, res) {
  var user = new User(req.body);

  user.save(function(err) {
    if(err) {
      res.redirect('/signup', routes.signup, user);
    }

    //req.session.user_id = user._id;
    res.redirect('/');
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
