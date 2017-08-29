module.exports = function(router, passport){
    
    
    router.get('/', function(req, res){

        res.render('welcome.ejs');
    });

    router.get('/test', function(req, res){

        res.render('test.ejs');
    });

    router.get('/signup', function(req, res){

        res.render('auth/signup.ejs');
    });

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/speech2text',
        failureRedirect: '/speech2text/signup',
        failureFlash: true
    }));

    router.get('/login', function(req, res){

        res.render('auth/login.ejs');
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/speech2text/dashboard',
        failureRedirect: '/speech2text/auth/login',
        failureFlash: true
    }));

    router.get('/facebook', passport.authenticate('facebook', {authType: 'rerequest', scope: ['email']}));

    router.get('/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/speech2text/dashboard',
        failureRedirect: '/speech2text'
    }));

    router.get('/connect/facebook', passport.authorize('facebook', {authType: 'rerequest', scope: ['email']}));
    router.get('/connect/google', passport.authorize('google', {authType: 'rerequest', scope: ['https://www.googleapis.com/auth/plus.login', 'email']}));

    router.get('/connect/local', function(req, res){
        res.render('auth/connect-local.ejs', { message: req.flash('signupMessage')})
    });

    router.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/speech2text/dashboard',
        failureRedirect: '/speech2text/connect/local',
        failureFlash: true
    }));


    router.get('/google', passport.authenticate('google', {authType: 'rerequest', scope: ['https://www.googleapis.com/auth/plus.login', 'email']}));

    router.get('/google/callback', passport.authenticate('google', {
        successRedirect: '/speech2text/dashboard',
        failureRedirect: '/speech2text'
    }));


    router.get('/logout', function(req, res){
        req.logout();
        req.flash('success_msg', 'You are logged out !');

        res.redirect('/speech2text');
    });

    router.get('/unlink/facebook', function(req, res){
        var user = req.user;
        user.facebook.token = null;

        user.save(function(err){
            if(err)
                throw err;

            res.redirect('/profile');
        });
    });

    router.get('/unlink/local', function(req, res){
        var user = req.user;

        user.local.email = null;
        user.local.password = null;

        user.save(function(err){
            if(err)
                throw err;

            res.redirect('/speech2text/profile');
        });
    });

    router.get('/unlink/google', function(req, res){
        var user = req.user;
        user.google.token = null;

        user.save(function(err){
            if(err)
                throw err;
            res.redirect('/speech2text/profile');
        });
    });
}