var dashboard = new Vue({
    el: "#dashboard",
    data: {
        title: "SpeakToMe",
        phrase: '',
        isActiveMovieModule: false,
        isActiveMusicModule: false,
        isActiveTravelModule: false,
        isActiveWeatherModule: false,
        contentWeather: '',
        tempWeather: '',
        contentMovie: ''
    },
    methods: {
        init: function () {
            this.isActiveMovieModule = false
            this.isActiveMusicModule = false
            this.isActiveTravelModule = false
            this.isActiveWeatherModule = false
            this.contentWeather = ''
        }
    }
});