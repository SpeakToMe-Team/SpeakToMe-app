class TravelModule {
    constructor(json) {
        this._json = json;
    }

    get json() {
        return this._json;
    }

    get coordinates() {
        return this._json.response.coordinates;
    }

    set json(newJson) {
        this._json = newJson;
    }

    getNumberList() {
           if(this._json.response.length > 0){
               return this._json.response.length;
           }else{
               return false;
           }
    }

    getList() {
        let list = this._json.response;
        var newList = [];

        list.forEach(function(element, index) {
            let categoriesArr = [];
            element.categories.forEach(function(e,i) {
                categoriesArr.push(e.title);
            });
            element.categories = categoriesArr.join(', ');
            let categorieMsgVocal = categoriesArr.count > 0 ? 'Catégorie ' + element.categories + ', ' : '';
            element.address = element.location.display_address.join('<br>');
            element.msgVocal =
                element.name + ', ' +
                element.rating.toString().replace('.', ',') + ' étoile sur 5, ' +
                element.review_count + ' avis, ' +
                categorieMsgVocal +
                element.address.replace('<br>', ' ') + ', ' +
                element.display_phone;
            newList.push(element);
        }, this);

        return newList;
    }
}

function traitementTravel(answer) {
    let travel = new TravelModule(answer);
    let nbrBusiness = travel.getNumberList();

    if (nbrBusiness !== false) {

        if (nbrBusiness == 0){
            var stringVoiceMsg = "Je n'ai trouvé aucun résultat qui corresponde à votre recherche.";
        } else if (nbrBusiness == 1) {
            var stringVoiceMsg = "Je viens de trouver 1 résultat qui correspond à votre recherche.";
        } else {
            var stringVoiceMsg = "Je viens de trouver " + nbrBusiness + " résultats qui correspondent à votre recherche.";
        }

        var list = travel.getList();

        let content = {
            msgVocal: stringVoiceMsg,
            list: list
        }

        dashboard.contentTravel = content;
        dashboard.isActiveTravelModule = true;
        parler(stringVoiceMsg);

    } else {

        dashboard.isActiveTravelModule = false;
        parler("Désolé ! Je n'ai pas trouvé de réponse à votre question.");
    }
}