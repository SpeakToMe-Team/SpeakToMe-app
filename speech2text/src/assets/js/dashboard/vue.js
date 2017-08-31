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
        compteur: 0
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
        }
    }
});

