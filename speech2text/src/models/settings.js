var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var settingsSchema = mongoose.Schema({    
    settings: {
        couleur: String,
        nbrResultatMovie: { type: Number, min: 1, max: 20 },
        nbrResultatTravel: { type: Number, min: 1, max: 20 },
        nbrResultatSpotify: { type: Number, min: 1, max: 20 },
        nbrResultatWeather: { type: Number, min: 1, max: 20 },
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

settingsSchema.methods.sauvegarde = function(){
    
    console.log('save');
}

var Settings = mongoose.model('Settings', settingsSchema);

var Models = { Settings: Settings };

module.exports = Models;
