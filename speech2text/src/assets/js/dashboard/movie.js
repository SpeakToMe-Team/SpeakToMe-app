class MovieModule {
    constructor (json) {
        this._jsonMovie = json;
        this._jour = false;
    }

    get jsonMovie() {
        return this._jsonMovie;
    }

    set jsonMovie(newJson){
        this._jsonMovie = newJson;
    }

    getIntent () {
        return this._jsonMovie.intent;
    }

    getNumberMovie() {
        if(this._jsonMovie.response.feed['movie'].length > 0){
            return this._jsonMovie.response.feed['movie'].length;
        }else{
            return false;
        }
    }

    getListMovies() {
        let list = this._jsonMovie.response.feed['movie'];

        var newList = [];

        list.forEach(function(element, index) {                
            console.log(index + ' => ' + element.originalTitle);
            let title = element.originalTitle;
            element.msgVocal = title;                
            newList.push(element);
        }, this);

        return newList;
    }
}

function traitementMovie (answer) {
    console.log('movie');
            
    let Movie = new MovieModule(answer);
    var nbrMovies = Movie.getNumberMovie();
    console.log('nombre movie : ' + nbrMovies);
    if( nbrMovies !== false){

        if(nbrMovies == 0 ){
            var stringVoiceMsg = "Je n'ai trouvé aucun film qui corresponde à votre recherche.";
        }else if (nbrMovies == 1){
            var stringVoiceMsg = "Je viens de trouver 1 film qui correspond à votre recherche.";
        }else{
            var stringVoiceMsg = "Je viens de trouver " + nbrMovies + " films qui correspondent à votre recherche.";
        }

        // Pour chaque film, il faut créer une msgVocal personnalisé
        var listMovies = Movie.getListMovies();

        var content = {
            msgVocal: stringVoiceMsg,
            listMovies: listMovies
        }

        dashboard.contentMovie = content;
        dashboard.isActiveMovieModule = true;
        parler(stringVoiceMsg);


    }else{

        dashboard.isActiveMovieModule = false;
        parler("Désolé ! Je n'ai pas trouvé de réponse à votre question.");
    }
}