class MusicModule {


    constructor(json) {
        this._jsonMusic = json;
        this._limit = 3;
    }

    get jsonMusic() {
        return this._jsonMusic;
    }


    set jsonMusic(newJson) {
        this._jsonMusic = newJson;
    }

    getIntent() {
        return this._jsonMusic.intent;
    }

    /*getNumberMusic() {
        if(this._jsonMusic.response.feed['music'].length > 0){
            return this._jsonMusic.response.feed['music'].length;
        }else{
            return false;
        }
    }*/

    getArtistsList() {

        let response = this._jsonMusic.response;
        if (typeof (response.artists) !== 'undefined') {
            if (response.artists.items.length > 0) {
                let artistsItems = response.artists.items;
                if (artistsItems !== 'undefined') {
                    return artistsItems.slice(0, this._limit);
                }
            }
        }
    }

    getAlbumsList() {

        let response = this._jsonMusic.response;
        if (typeof (response.albums) !== 'undefined')
            if (response.albums.items.length > 0) {
                let albumsItems = response.albums.items;
                if (albumsItems !== 'undefined') {
                    return albumsItem.slice(0, this._limit);
                }
            }
    }

    getTracksList() {

        let response = this._jsonMusic.response;
        if (typeof (response.tracks) !== 'undefined')
            if (response.tracks.items.length > 0) {
                let tracksItems = response.tracks.items;
                if (tracksItems !== 'undefined') {
                    return tracksItems.slice(0, this._limit);
                }

            }
    }

}

function traitementMusic(answer) {


    let Music = new MusicModule(answer);
    artistList = Music.getArtistsList();
    albumList = Music.getAlbumsList();
    trackList = Music.getTracksList();

    console.log('artists=' + artistList);
    console.log('albums=' + albumList);
    console.log('tracks=' + trackList);
    let display = [];
    if (typeof (artistList) !== 'undefined') {
        display.artists = artistList;
        display.length ++
    }
    if (typeof (albumList) !== 'undefined') {
        display.albums = albumList;
        display.length ++
    }
    if (typeof (trackList) !== 'undefined') {
        display.tracks = trackList;
        display.length ++
    }
    console.log(display);

    if (display.length <= 0) {

        var stringVoiceMsg = "Je n'ai trouvé aucune musique qui corresponde à votre recherche.";
    }
    else if (display.length == 1) {
        var stringVoiceMsg = "Je viens de trouver " + display.length + " résultats qui correspondent à votre recherche.";

    }

    else {
        var stringVoiceMsg = "Je viens de trouver " + display.length + " résultats qui correspondent à votre recherche.";
    }
    console.log(stringVoiceMsg);

    var content = {
        msgVocal: stringVoiceMsg,
        listMusic: display
    }
    console.log(content);

    dashboard.contentMusic = content;
    dashboard.isActiveMusicModule = true;
    parler(stringVoiceMsg);
}


    //dashboard.isActiveMusicModule = false;
    //parler("Désolé ! Je n'ai pas trouvé de réponse à votre question.");

