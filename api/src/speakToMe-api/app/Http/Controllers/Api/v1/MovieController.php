<?php
namespace App\Http\Controllers\Api\v1;

use GuzzleHttp\Client;

class MovieController extends ApiController
{
    protected $name = 'movie';
    private $query;
    private $longitude;
    private $latitude;
    private $city;
    private $countryCode;
    private $token;

    public function __construct($intent) 
    {
        echo "<pre>";
            print_r($intent); 
        echo "</pre>";
        die;
        
        // On regarde dans l'intention si on trouve une 'wit/location'
        if (isset($intent['entities']['location'][0]['value'])) {
            $this->city = $intent['entities']['location'][0]['value'];

            // On récupère les coordonnées GPS
            $coord = $this->getCoordinates($this->city);
            if (!empty($coord)) {
                $this->latitude = $coord[0];
                $this->longitude = $coord[1];
            }
        }

        // Sinon on prend les coordonnées GPS par défaut
        else {
            // $this->latitude = '45.770297';
            // $this->longitude = '4.863703';

            $this->latitude = null;
            $this->longitude = null;
        }

        // On prépare le token
        $this->token = $this->getToken();
        
    }

    public function run() 
    {
        // Préparation du client Guzzle
        $client = new Client();

        // Récupération des paramètres de la requête
        $parametres = $this->getQueryParams();

        // Si nous avons bien une ville, on veut les séances de cinéma à proximité de la ville
        if (!empty($this->latitude) && !empty($this->longitude)) {
            $response = $this->getSeancesCinema($client, $parametres);
            while ($response->getStatusCode() != '200') {
                $response = $this->getSeancesCinema($client, $parametres);
            }
        } 

        // Sinon on sort la liste des films du moment
        else {
            $response = $this->getFilmsDuMoment($client, $parametres);
            while ($response->getStatusCode() != '200') {
                $response = $this->getFilmsDuMoment($client, $parametres);
            }
        }

        // Récupération de la réponse et encodage en JSON
        $body = $response->getBody();
        $json = json_decode($body, true);
        
        // Retour de la réponse
        return $json;
    }
    
    public function getQueryParams() 
    {
        $parametres = [
            'query' => [
                'partner' => env('ALLOCINE_TOKEN'),
                'format' => 'json',
                // 'theaters' => 'P0671,P0035', // UGC Ciné cité, UGC Part Dieu
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . env('ALLOCINE_TOKEN'),
                'User-Agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
            ]
        ];

        $sed = date('Ymd');
        $sig = urlencode(base64_encode(sha1($this->_secret_key.http_build_query($parametres['query']).'&sed='.$sed, true)));
        $parametres['query']['sed'] = $sed;
        $parametres['query']['sig'] = $sig;

        // Si on a bien une location
        if (!empty($this->latitude) && !empty($this->longitude)) {
            $parametres['query']['lat'] = $this->latitude;
            $parametres['query']['long'] = $this->longitude;
            $parametres['query']['radius'] = '15';
        }

        // Retour des paramètres
        return $parametres;
    }

    public function generateToken() {}


    public function getCoordinates($ville)
    {
        // On se sert de Google Maps
        $ville  = urlencode($ville);
        $url    = "http://maps.google.com/maps/api/geocode/json?sensor=false&address=" . $ville;
        $retour = file_get_contents($url);
        $json   = json_decode($retour, true);

        // On retourne les coordonnées
        if (!empty($json) && !empty($json['results'])) {
            $lat = $json['results'][0]['geometry']['location']['lat'];
            $lng = $json['results'][0]['geometry']['location']['lng'];         
            return array($lat, $lng);
        } 

        // Sinon on retourne false
        else {
            return false;
        }
     
    }

    public function getInformationsFilm($client, $parametres)
    {

    }

    public function getSeancesCinema($client, $parametres) 
    {
        // Envoi de la requête
        try {
            $response = $client->request('GET', 'http://api.allocine.fr/rest/v3/theaterlist', $parametres);
        }
        
        catch (GuzzleHttp\Exception\ClientException $e) {
            $response = $e->getResponse();
        }
        
        // Retour de la réponse
        return $response;
    }

    public function getFilmsDuMoment($client, $parametres) 
    {
        // On ajoute certains paramètres pour avoir des résultats plus pertinents
        $parametres['query']['filter']  = 'nowshowing';
        $parametres['query']['order']   = 'toprank';
        $parametres['query']['profile'] = 'medium';

        // Envoi de la requête
        try {
            $response = $client->request('GET', 'http://api.allocine.fr/rest/v3/movielist', $parametres);
        }
        
        catch (GuzzleHttp\Exception\ClientException $e) {
            $response = $e->getResponse();
        }

        // Retour de la réponse
        return $response;   
    }
}