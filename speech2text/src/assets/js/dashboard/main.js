class Module {
    /* 
    constructor (json) {
        this._json = json;
    }*/
    // Ici on parse car c'est une string qu'on envoie un string json
    constructor(json) {
        this._json = json;
    }

    get json() {
        return this._json;
    }

    set json(newJson) {
        this._json = newJson;
    }

    getIntent() {
        if (this._json.hasOwnProperty('intent')) {
            return this._json.intent;
        } else {
            return false;
        }
    }

    getSousIntent() {
        if (this._json.hasOwnProperty('sous-intent')) {
            return this._json["sous-intent"];
        } else {
            return false;
        }
    }
}

var repeterModule = function () {
    var text = $('#msgVocal').text();
    if (text.length > 0) {
        var stringVoiceMsg = text;
    } else {
        var stringVoiceMsg = "Désolé, je n'ai pas de message à vous dire !";
    }

    parler(stringVoiceMsg);
}

var parler = function (stringVoiceMsg) {
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
            var sousIntent = mainModule.getSousIntent();
            dashboard.isActiveMovieModule = true;
            switch (sousIntent) {
                case "informations":
                    traitementMovieInformations(answer);

                    break;
                case "seance":
                    traitementMovieSeance(answer);

                    break;
                case "affiche":
                    traitementMovieAffiche(answer);

                    break;
                default:
                    parler("Désolé, je n'ai pas bien compris votre demande de film !");
                    
                    break;
            }
            
            break;
        case "music":
            console.log(answer);
            traitementMusic(answer);

            break;
        case "travel":
            traitementTravel(answer);

            break;
        default:
            parler("Désolé, je n'ai rien trouvé ! Veuillez recommencer !");

            break;
    }
}
/* Partie Socket IO pour l'envoi et la réception des questions/réponses */
var emitQuestion = function (question) {
    console.log('question ? ' + question);
    console.log('position ? ' + _position);
    socket.emit('question', { question: question, position: _position });

    parler('Je viens de lancer la recherche, merci de patienter !');
}

var emitResultRequest = function (number) {
    console.log('number ' + number);
    // let text = $('.msgVocal[data-result-number="' + number + '"]').text();

    $('.msgVocal').each(function(i,e) {
        if (i+1 == number) {
            let text = $(e).text();
            if (typeof text != 'undefined') {
                parler(text);
            }
            return false;
        }
    });
}

$('#input-emitQuestion').keyup(function(event) {
	if (event.which == 13) {
		$('#bouton-emitQuestion').click();
	};
});

$('#bouton-emitQuestion').click(function(e) {
	e.preventDefault();
	var question = $('#input-emitQuestion').val();

	console.log('question ? ' + question);
    console.log('position ? ' + _position);
    socket.emit('question', { question: question, position: _position });
        
    parler('Je viens de lancer la recherche avec le bouton !');
});

socket.on('answer', function (answer) {
    console.log('réception de la réponse');
    console.log(JSON.stringify(answer));

    show(answer);
});