_position = {
    latitude: null,
    longitude: null
}

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        _position = {
            latitude: 45.77,
            longitude: 4.86              
        }        
    }
}

function showPosition(position) {
    _position = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }     
}

getLocation();