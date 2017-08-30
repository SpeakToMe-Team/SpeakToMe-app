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
            console.log(index + ' => ' + element.name);
            let categoriesArr = [];
            element.categories.forEach(function(e,i) {
                categoriesArr.push(e.title);
            });
console.log(categoriesArr.join(', '));
            element.categories = categoriesArr.join(', ');
            element.address = element.location.display_address.join('<br>');
            element.msgVocal = element.name;
            newList.push(element);
        }, this);

        return newList;
    }
}

function traitementTravel(answer) {
    let travel = new TravelModule(answer);
    let nbrBusiness = travel.getNumberList();

    if (nbrBusiness !== false) {
        // var content = {
        //     coordinates: stringGeolocation,
        //     name: stringJour,
        //     rating: stringJour,
        //     categories: stringJour,
        //     review_count: stringJour,
        //     address: stringJour,
        //     phone: stringJour,
        //     msgVocal: stringVoiceMsg,
        //     picture: iconDescription,
        // }
        //
        // dashboard.contentTravel = content;
        // dashboard.isActiveTravelModule = true;
        //
        // parler('Hello world!');


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