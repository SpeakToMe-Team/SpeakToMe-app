var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var randtoken = require('rand-token');

var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    local:{
        email: String,
        password: String
    },
    facebook:{
        id: String,
        token: String,
        email: String,
        name: String,
        picture: String
    },
    google:{
        id: String,
        token: String,
        email: String,
        name: String,
        picture: String
    },   
    token:{
        type: Schema.Types.ObjectId,
        ref: 'Token',
        default: null
    },
    settings: {
        couleur: String,
        ville: String,
        nbrResultatMovie: { type: Number, min: 1, max: 20, default: 5 },
        nbrResultatTravel: { type: Number, min: 1, max: 20, default: 5 },
        nbrResultatSpotify: { type: Number, min: 1, max: 20, default: 5 },
        nbrResultatWeather: { type: Number, min: 1, max: 20, default: 5 }    
    }
});

var settingsSchema = mongoose.Schema({    
    local: {
        email: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

var tokenSchema = mongoose.Schema({
    value: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    expireAt: {
        type: Date,
        expires: 60,
        default: Date.now
    }
});

userSchema.methods.generateToken = function(){
    var token = new Token();
    token.value = randtoken.generate(32);
    token.user = this._id;
    this.token = token._id;
    this.save(function(err){
        if(err){ throw err; }
        token.save(function(err){
            if(err){ throw err; }            
        });
    });
}

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
}

var User = mongoose.model('User', userSchema);
var Token = mongoose.model('Token', tokenSchema);
var Models = { User: User, Token: Token };

module.exports = Models;