// Try HTML5 geolocation.

function geo(){

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function(position) {
            _position = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
           

            return _position;
        
        });
    } else {
        // Browser doesn't support Geolocation
        console.log('Erreur, le navigateur ne supporte pas la géolocalisation !');
        
        return false;
    }    
}

_position = geo();

console.log('pos 2 : ' + _position);