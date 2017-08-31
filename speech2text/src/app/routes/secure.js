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
            user.settings.nbrResultatMovie = req.body.movieRange;
            user.settings.nbrResultatTravel = req.body.travelRange;
            user.settings.nbrResultatSpotify = req.body.spotifyRange;
            user.settings.nbrResultatWeather = req.body.weatherRange;
            
            user.save(function(err){
                if(err){
                    throw err;
                }
                req.user = user;

                res.redirect('/dashboard');                
            });       
        });
    });

    router.get('/dashboard', function(req, res){
        User.findOne({ _id: req.user._id }).
        exec(function(err, user){            
            
            res.render('secured/dashboard.ejs', { user: user });
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