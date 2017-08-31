function test (event) {
    if (event) {
        alert(event.target.tagName)

        var settings = {
            ville: dashboard.villeInput,
            movieRange: dashboard.movieRange
        }

        socket.emit('settings', settings );

        $('#settings').modal('hide');
    }
}

var dashboard = new Vue({
    el: "#dashboard",
    data: {
        title: "SpeakToMe",
        phrase: '',
        isActiveMovieModule: false,
        isActiveMovieInformationsModule: false,
        isActiveMovieAfficheModule: false,
        isActiveMovieSeanceModule: false,
        isActiveMusicModule: false,
        isActiveTravelModule: false,
        isActiveWeatherModule: false,
        contentWeather: '',
        tempWeather: '',
        contentTravel: '',        
        contentMovie: '',
        contentMusic:'',
        compteur: 0,
        villeInput: '',
        movieRange: 5,
        weatherRange: 5,
        spotifyRange: 5,
        travelRange: 5
    },
    methods: {
        init: function () {
            this.isActiveMovieModule = false
            this.isActiveMovieInformationsModule = false
            this.isActiveMovieAfficheModule = false
            this.isActiveMovieSeanceModule = false
            this.isActiveMusicModule = false
            this.isActiveTravelModule = false
            this.isActiveWeatherModule = false
            this.contentWeather = ''
            this.tempWeather = ''
            this.contentTravel = ''
            this.contentMovie = ''
            this.contentMusic = ''
            this.compteur = 0            
        },
        saveSettings: function (event) {
            test(event);
        },
        reinitSettings: function (event) {
            // Valeur pa rdéfaut
            this.villeInput = ''
            this.movieRange = 5
            this.weatherRange = 5
            this.spotifyRange = 5
            this.travelRange = 5
            test(event);
        }
    }
});

