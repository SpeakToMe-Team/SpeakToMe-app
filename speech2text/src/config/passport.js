var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStategy = require('passport-google-oauth').OAuth2Strategy;
var BearStrategy = require('passport-http-bearer').Strategy;

var User = require('../models/user').User;
var Token = require('../models/user').Token;
var configAuth = require('./auth');

module.exports = function (passport){

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        process.nextTick(function(){
            User.findOne({'local.email': email}, function(err, user){  
                if(err){ return done(err); }
                if(user){
                    return done(null, false, req.flash('error_msg', 'Sorry ! That email already taken !'));
                }
                
                if(!req.user){
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err){
                        if(err){
                            throw err;
                        }

                        return done(null, newUser, req.flash('success_msg', 'Account created !'));
                    });
                }else{
                    var user = req.user;
                    user.local.email = email;
                    user.local.password = user.generateHash(password);

                    user.save(function(err){
                        if(err){
                            throw err;
                        }

                        return done(null, user);
                    });
                }
            });
        });        
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        process.nextTick(function(){
            User.findOne({'local.email': email}, function(err, user){
                if(err){ return done(err); }
                if(!user){ return done(null, false, req.flash('error_msg', 'No User found !')); }                
                if(!user.validPassword(password)){ return done(null, false, req.flash('error_msg', 'Password is wrong !')); }

                return done(null, user);
            });
        });        
    }));

    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            enableProof: true,
            passReqToCallback: true,
            profileFields: ['id', 'gender', 'last_name', 'first_name', 'displayName', 'photos', 'email']
        },
        function(req, accessToken, refreshToken, profile, done) {
            process.nextTick(function(){
                // User is not logged in yet
                if(!req.user){
                    User.findOne({'facebook.id': profile.id}, function(err, user){
                        if(err){ return done(err);}
                        if(user){
                            if(!user.facebook.token){
                                user.facebook.token = accessToken;
                                user.facebook.name = profile.displayName;
                                user.facebook.email = profile.emails[0].value;
                                user.facebook.picture = profile.photos[0].value;

                                user.save(function(err){
                                    if(err) throw err;

                                    return done(null, user);
                                });
                            }else{

                            }

                            return done(null, user)
                        }else{
                            var newUser = new User();
                            newUser.facebook.id = profile.id;
                            newUser.facebook.token = accessToken;
                            newUser.facebook.name = profile.displayName;
                            newUser.facebook.email = profile.emails[0].value;
                            newUser.facebook.picture = profile.photos[0].value;

                            newUser.save(function(err){
                                if(err) throw err;

                                return done(null, newUser);
                            });
                        }
                    });

                } 
                //user is logged in already, and needs to be merged
                else{
                    var user = req.user;
                    user.facebook.id = profile.id;
                    user.facebook.token = accessToken;
                    user.facebook.name = profile.displayName;
                    user.facebook.email = profile.emails[0].value;
                    user.facebook.picture = profile.photos[0].value;

                    user.save(function(err){
                        if (err){ throw err }

                        return done(null, user);
                    });
                }                
            });
        }
    ));


    passport.use(new GoogleStategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,
            passReqToCallback: true           
        },
        function(req, accessToken, refreshToken, profile, done) {
            process.nextTick(function(){
                if(!req.user){
                    User.findOne({'google.id': profile.id}, function(err, user){
                        if(err){ return done(err);}
                        if(user){
                            if(!user.google.token){
                                user.google.token = accessToken;
                                user.google.name = profile.displayName;
                                user.google.email = profile.emails[0].value;
                                user.google.picture = profile.photos[0].value;


                                user.save(function(err){
                                    if(err) throw err;

                                    return done(null, user);
                                });
                            }else{
                                return done(null, user)
                            }
                        }else{
                            var newUser = new User();
                            newUser.google.id = profile.id;
                            newUser.google.token = accessToken;
                            newUser.google.name = profile.displayName;
                            newUser.google.email = profile.emails[0].value;
                            newUser.google.picture = profile.photos[0].value;

                            newUser.save(function(err){
                                if(err) throw err;

                                return done(null, newUser);
                            });
                        }
                    });
                }else{
                    var user = req.user;
                    user.google.id = profile.id;
                    user.google.token = accessToken;
                    user.google.name = profile.displayName;
                    user.google.email = profile.emails[0].value;
                    user.google.picture = profile.photos[0].value;

                    user.save(function(err){
                        if (err){ throw err }

                        return done(null, user);
                    });
                }
            });
        }
    ));


    /* Bearer */
    passport.use(new BearStrategy({},
    function(token, done){        
        /*User.findOne({ _id: token }, function(err, user){
            if(err){ return done(err); }
            if(!user){ return done(null, false, req.flash('error_msg', 'No User found !')); }                
            
            return done(null, user);
        });*/

        Token.findOne({value : token}).populate('user').exec(function(err, token){
            if(!token)
                return done(null, false);
            return done(null, token.user);
        });        
    }));

}
