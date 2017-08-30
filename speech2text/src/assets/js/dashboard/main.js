class Module {
    /* 
    constructor (json) {
        this._json = json;
    }*/
    // Ici on parse car c'est une string qu'on envoie un string json
    constructor (json) {
        this._json = json;
    }

    get json() {
        return this._json;
    }

    set json(newJson){
        this._json = newJson;
    }

    getIntent () {
        return this._json.intent;
    }

}

var repeterModule = function() {
    var text = $('#msgVocal').text();
    if(text.length > 0){
        var stringVoiceMsg = text;
    }else{
        var stringVoiceMsg = "Désolé, je n'ai pas de message à vous dire !";
    }

    parler(stringVoiceMsg);
}

var parler = function (stringVoiceMsg){
    annyang.pause();

    var synth = window.speechSynthesis;

    var utterThis = new SpeechSynthesisUtterance(stringVoiceMsg);
    utterThis.lang = 'fr-FR';
    utterThis.pitch = 1;
    utterThis.rate = 1;

    synth.speak(utterThis);

    annyang.resume();
    annyang.resume();
}

var show = function(answer) {
    console.log(answer);

    // Réinitialisation
    dashboard.init();        

    let mainModule = new Module(answer);
    var intent = mainModule.getIntent();

    console.log('intent : ' + intent);

    switch (intent) {
        case "weather":
            traitementWeather(answer);

            break;
        case "movie":
            traitementMovie(answer);
                
            break;
        case "travel":
            traitementTravel(answer);

            break;
        case "music":

            break;
        default:
            
            break;        
    }        
}

/* Partie Socket IO pour l'envoi et la réception des questions/réponses */
var emitQuestion = function(question){
    console.log('question ? ' + question);
    socket.emit('question', question);
    
    parler('Je viens de lancer la recherche, merci de patienter !');
}

socket.on('answer', function(answer) {
    console.log('réception de la réponse');
    //console.log(answer);

    show(answer);
});