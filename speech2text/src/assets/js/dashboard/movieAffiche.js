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

function traitementMovieAffiche(answer) {

    let Movie = new MovieAfficheModule(answer);
    
    var nbrMovies = Movie.getNumberMovie();
    console.log('nbrMovies : '+ nbrMovies);


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