
/*
 * Routes for User auth
 */

module.exports = function(app, User, passport){

    app.get('/', function(req, res) {
        res.render('index', { title: 'SWE ePass', user: req.user });
    });

    app.get('/login', function(req, res) {
        res.render('login', { title: 'Login/Signup', message: req.flash('error'), user: req.user});
    });

    app.get('/logout', function(req, res) {
        //req.session.destroy();
        req.logout();
        res.redirect('/');
    });

    // post
    app.post('/login',
      passport.authenticate(
            'local',
            {  successReturnToOrRedirect: '/',
               failureRedirect: '/login',
               failureFlash: true
            }
      )
    );

    app.post('/signup', function(req, res) {
      var user = new User(req.body);

      user.save(function(err) {
        if(err) {
          req.flash('error', err);
          res.render('login', { title: 'Login/Signup', message: req.flash('error')});
        } else {
          res.redirect('/');
        }
      });
    });
}
