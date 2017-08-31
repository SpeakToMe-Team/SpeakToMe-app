var User = require('../../models/user').User;
var Token = require('../../models/user').Token;

module.exports = function(router, passport){

    router.use(function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }

        res.redirect('/auth');
    });

    router.get('/profile', function(req, res){
        User.findOne({ _id: req.user._id }).populate('token').exec(function(err, user){

            res.render('secured/profile.ejs', { user : user });
        });
    });

    router.post('/settings', function(req, res){
        User.findOne({ _id: req.user._id }).exec(function(err, user){
            
            console.log(req.body);

           /* user.settings.couleur = '';
            user.settings.ville = 'Aubagne';
            user.settings.nbrResultatMovie = 7;
            user.settings.nbrResultatTravel = 7;
            user.settings.nbrResultatSpotify = 7;
            user.settings.nbrResultatWeather = 7; 
            
            user.save(function(err){
                if(err){
                    throw err;
                }

                res.redirect('/dashboard', { user : user });
                //return done(null, newUser, req.flash('success_msg', 'Account created !'));
            });   */    

            res.redirect('/dashboard', { user : user });     
        });
    });

    router.get('/dashboard', function(req, res){
        User.findOne({ _id: req.user._id }).
        exec(function(err, user){
            console.log(user);
            
            res.render('secured/dashboard.ejs');
        });
	});

    router.get('/getToken', function(req, res){
        User.findOne({ _id: req.user._id }).populate('token').exec(function(err, user){
            if(user.token == null)
                user.generateToken();
            req.user = user;    
            res.redirect('/profile');
        });
    });

    /*router.get('/testToken', function(req, res){
        User.findOne({ _id: req.user._id }).populate('token').exec(function(err, user){
            
            res.json(user);
        });        
    });*/

    router.get('/*', function(req, res){

        res.redirect('/dashboard');
    });
        

}