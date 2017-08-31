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

    getSousIntent() {
        return this._jsonMovie.sous-intent;
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

    getListMoviesInformation() {
        let list = this._jsonMovie.response.feed['movie'];

        var newList = [];

        list.forEach(function(element, index) {
            console.log(index + ' => ' + element.movie.originalTitle);
            let title = element.movie.originalTitle;
            element.msgVocal = title;                
            newList.push(element);
        }, this);

        return newList;
    }

    getNumberMovie() {
        if(this._jsonMovie.response.feed['movie'].length > 0){
            return this._jsonMovie.response.feed['movie'].length;
        }else{
            return false;
        }
    }
}

class MovieInformationsModule {
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

    getListMovies() {
        let list = this._jsonMovie.response.feed['movie'];

        var newList = [];

        list.forEach(function(element, index) {
            console.log(index + ' => ' + element.movie.originalTitle);
            let title = element.movie.originalTitle;
            element.msgVocal = title;                
            newList.push(element);
        }, this);

        return newList;
    }

    getNumberMovie() {
        if(this._jsonMovie.response.feed['movie'].length > 0){
            return this._jsonMovie.response.feed['movie'].length;
        }else{
            return false;
        }
    }
}

class MovieAfficheModule {
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

    getSousIntent() {
        return this._jsonMovie.sous-intent;
    }

    getNumberMovie() {
        if (this._jsonMovie.response.feed['movie'].length > 0) {
            return this._jsonMovie.response.feed['movie'].length;
        } else {
            return 0;
        }
    }

    getListMovies() {
        let list = this._jsonMovie.response.feed['movie'];

        var retourListMovie = [];

        // Si il y a bien des films comme résultat
        if (this.getNumberMovie() > 0) {
            list.forEach(function(movie, index) {                
                let title = movie.title;
                movie.msgVocal = title;                
                retourListMovie.push(movie);
            }, this);    
        };

        return retourListMovie;
    }
}

function voiceMsg (nbrMovies) {
    if(nbrMovies == 0 ){
        var stringVoiceMsg = "Je n'ai trouvé aucun film qui corresponde à votre recherche.";
    }else if (nbrMovies == 1){
        var stringVoiceMsg = "Je viens de trouver 1 film qui correspond à votre recherche.";
    }else{
        var stringVoiceMsg = "Je viens de trouver " + nbrMovies + " films qui correspondent à votre recherche.";
    }

    return stringVoiceMsg;
}   


function traitementMovieSeance (answer) {
    console.log('movie seance');
            
    let Movie = new MovieModule(answer);
    var nbrMovies = Movie.getNumberMovie();
    
    if( nbrMovies !== false){

        let stringVoiceMsg = voiceMsg(nbrMovies);

        // Pour chaque film, il faut créer une msgVocal personnalisé
        var listMovies = Movie.getListMovies();

        var content = {
            msgVocal: stringVoiceMsg,
            listMovies: listMovies
        }

        dashboard.contentMovie = content;
        dashboard.isActiveMovieModule = true;
        dashboard.isActiveMovieSeanceModule = true;
        parler(stringVoiceMsg);


    }else{

        dashboard.isActiveMovieModule = false;
        dashboard.isActiveMovieSeanceModule = false;
        parler("Désolé ! Je n'ai pas trouvé de réponse à votre question.");
    }
}

function traitementMovieInformations(answer) {
    console.log('movie informations');

    let Movie = new MovieInformationsModule(answer);

    var nbrMovies = Movie.getNumberMovie();
    if( nbrMovies !== false){
        let stringVoiceMsg = voiceMsg(nbrMovies);
        let listMovies = Movie.getListMovies();   

        var content = {
            msgVocal: stringVoiceMsg,
            listMovies: listMovies
        }

        dashboard.contentMovie = content;
        dashboard.isActiveMovieModule = true;
        dashboard.isActiveMovieInformationsModule = true;
        parler(stringVoiceMsg);
    }else{

        dashboard.isActiveMovieModule = false;
        dashboard.isActiveMovieInformationsModule = false;
        parler("Désolé ! Je n'ai pas trouvé de réponse à votre question.");
    }
}

function traitementMovieAffiche(answer) {
    console.log('movie affiche');

    let Movie = new MovieAfficheModule(answer);
    
    var nbrMovies = Movie.getNumberMovie();

    if (nbrMovies > 0) {
        let stringVoiceMsg = 'Voici la liste des films actuellement en salle';
        let listMovies     = Movie.getListMovies();   
    
        // Pour une raison mystérieuse, content ne fonctionne pas
        // var content = {
        //     msgVocal: stringVoiceMsg,
        //     listMovies: listMovies
        // }

        // On utilise directement listMovies
        dashboard.contentMovie = listMovies;
        dashboard.isActiveMovieModule = true;
        dashboard.isActiveMovieAfficheModule = true;
       
        parler(stringVoiceMsg);

    } else {
        dashboard.isActiveMovieModule = false;
        dashboard.isActiveMovieAfficheModule = false;
        parler("Désolé ! Je n'ai pas trouvé de réponse à votre question.");
    }
}