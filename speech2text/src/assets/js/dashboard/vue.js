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
        contentTravel: '',
        tempWeather: '',
        contentMovie: '',
        contentMusic:'',
    },
    methods: {
        init: function () {
            this.isActiveMovieModule = false
            this.œisActiveMovieInformationsModule = false
            this.isActiveMovieAfficheModule = false
            this.isActiveMovieSeanceModule = false
            this.isActiveMusicModule = false
            this.isActiveTravelModule = false
            this.isActiveWeatherModule = false
            this.contentWeather = ''

            this.contentTravel = ''

            this.contentMusic = ''

        }
    }
});