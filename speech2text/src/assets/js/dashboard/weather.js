class WeatherModule {
    constructor (json) {
        this._jsonWeather = json;
        this._jour = false;
    }

    get jsonWeather() {
        return this._jsonWeather;
    }

    set jsonWeather(newJson){
        this._jsonWeather = newJson;
    }

    getIntent () {
        return this._jsonWeather.intent;
    }

    getLocation () {
        return this._jsonWeather.response.city.name;
    }

    getNumberList() {
        if(this._jsonWeather.response['list'].length > 0){
            return this._jsonWeather.response['list'].length;
        }else{
            return false;
        }
    }

    getElementDisplay () {
        let number = this.getNumberList();
        if(number > 0 ){
            let list = this._jsonWeather.response['list'];
            list.forEach(function(element, index) {
                if(element.display === true){
                    console.log(index + ' => ' + element.temp.min);
                    this._jour = index;
                }
            }, this);
            console.log('jour ? : ' + this._jour);
            if (this._jour == false) {
                this._jour = 0;
            }
            return this._jour;
        }else{
            return "Pas d'informations !";
        }          
    }        
}

function traitementWeather (answer) {
    /* Traitement pour le weather */
    let  weather = new WeatherModule(answer);
    let stringIntent = weather.getIntent();
    console.log('intent : ' + stringIntent);
    let stringLocation = weather.getLocation();
    console.log('ville : ' + stringLocation);
    console.log('nombre : ' + weather.getNumberList());

    if( weather.getNumberList() !== false){

        console.log('jour ? ' + weather.getElementDisplay());
        let jourAfficher = weather.getElementDisplay();
        let jourAfficherContent = weather.jsonWeather.response['list'][jourAfficher];
        let dateJourAfficher = jourAfficherContent.dt * 1000;
        console.log('time : ' + dateJourAfficher);
        var stringJour = moment(dateJourAfficher).format("dddd D MMMM YYYY");
        var stringDescription = jourAfficherContent.weather['0']['description'];
        var stringDescriptionId = "owf owf-" + jourAfficherContent.weather['0']['id'];
        var iconDescription = 'http://openweathermap.org/img/w/' + jourAfficherContent.weather['0'].icon + '.png';
        console.log('icone : ' + iconDescription);
        var temperatureDescription = jourAfficherContent.temp;
        var srcStart = "https://maps.google.com/maps?q=";
        var srcLoc = stringLocation;
        var srcEnd = "%2C%20FR&t=&z=14&ie=UTF8&iwloc=&output=embed";
        var src = srcStart + srcLoc + srcEnd;
        $("#iframeMeteo")[0].setAttribute("src", src);
        $(".details i")[0].setAttribute("class", stringDescriptionId);

        console.log('moment js : ' + stringJour);

        var stringVoiceMsg = 'La météo de ' + stringJour + ' à ' + stringLocation + ', ' + stringDescription + ' avec des températures de ' + Math.floor(temperatureDescription.morn) + ' degré le matin, ' + Math.floor(temperatureDescription.day) + ' degré l\'après-midi, ' + Math.floor(temperatureDescription.eve) + ' degré le soir et ' + Math.floor(temperatureDescription.night) + ' degré la nuit.';
        console.log('msg vocal ' + stringVoiceMsg);

        //Vue js
        var content = {
            location: stringLocation,
            date: stringJour,
            msgVocal: stringVoiceMsg,
            picture: iconDescription,
            description: stringDescription,
            icon: stringDescriptionId,
            map: src
        }

        var temp = {
            day: temperatureDescription.day,
            morn: temperatureDescription.morn,
            eve: temperatureDescription.eve,
            night: temperatureDescription.night
        }
        
        dashboard.contentWeather = content;
        dashboard.tempWeather = temp;
        dashboard.isActiveWeatherModule = true;

        parler(stringVoiceMsg);

    }else{
        dashboard.isActiveWeatherModule = false;
        parler("Désolé ! Je n'ai pas trouvé de réponse à votre question.");
    }
}