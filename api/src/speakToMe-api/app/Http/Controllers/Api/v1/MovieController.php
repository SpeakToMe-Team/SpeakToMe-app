<?php
namespace App\Http\Controllers\Api\v1;

use GuzzleHttp\Client;

class MovieController extends ApiController
{
    protected $name = 'movie';
    private $query;
    private $longitude;
    private $latitude;
    private $ville;
    private $codePostal;
    private $token;
    private $demande;
    private $recherche;
    private $cinema;

    public function __construct($intent, $geolocation) 
    {
        // On prépare le token
        $this->token = $this->getToken();

        // On initialise toutes les variables
        $this->recherche  = '';
        $this->demande    = '';
        $this->cinema     = '';
        $this->codePostal = '';
        $this->ville      = '';
        $this->longitude  = '';
        $this->latitude   = '';

        // On regarde si on souhaite trouver une séance 
        if (array_key_exists('movie_seance', $intent['entities'])) {
            $this->demande = 'seance';

            // On regarde si on a une salle précisée
            if (array_key_exists('movie_nom_cinema', $intent['entities'])) {
                $this->cinema = strtolower($intent['entities']['movie_nom_cinema'][0]['value']);
            }

            // On regarde aussi si on a une search_query
            if (array_key_exists('search_query', $intent['entities'])) {
                foreach ($intent['entities']['search_query'] as $search_query) {
                    $this->recherche .= ' ' . $search_query['value'];                             
                }

                $this->recherche = trim($this->recherche);
            }
        } 

        // Sinon on veut peut-être des informations sur un film
        else if (array_key_exists('movie_informations', $intent['entities'])) {
            $this->demande = 'informations';

            // Si on a bien une search query
            if (array_key_exists('search_query', $intent['entities'])) {
                foreach ($intent['entities']['search_query'] as $search_query) {
                    $this->recherche .= ' ' . $search_query['value'];                             
                }

                $this->recherche = trim($this->recherche);
            }

            // Si la search_query est vide, peut-être que le nom de film a été compris comme une ville
            if (empty($this->recherche)) {
                if (array_key_exists('location', $intent['entities'])) {
                    foreach ($intent['entities']['location'] as $location) {
                        $this->recherche .= ' ' . $location['value'];                             
                    }
                }
            }

            // Si à ce stade, la recherche est toujours vide, on passe la demande générale pour avoir quelquechose
            if (empty($this->recherche)) {
                $this->demande = '';
            }
        }

        // On regarde si on trouve une 'wit/location'
        if (isset($intent['entities']['location'][0]['value'])) {
            
            // On vérifie si c'est un code postal, si c'est ça c'est chiant
            if (is_numeric($intent['entities']['location'][0]['value'])) {
                // Code Postal
                $this->codePostal = $intent['entities']['location'][0]['value'];
                // Ville
                $this->ville = $this->getCoordinatesCP($this->codePostal);
            }

            // Sinon, alors on a peut-être une ville (espérons, sinon c'est la merde)
            else {
                // Ville
                $this->ville = $intent['entities']['location'][0]['value'];
            }

            if (!empty($this->ville)) {
                // On récupère les coordonnées GPS
                $coord = $this->getCoordinatesVille($this->ville);
                if (!empty($coord)) {
                    $this->latitude = $coord[0];
                    $this->longitude = $coord[1];
                }    
            }
        }
        // Si on nous a pas préciser de wit/location, mais qu'on a une search_query
        else if (array_key_exists('search_query', $intent["entities"]) && $this->demande != 'seance') {
            // On parcourt les search_query
            foreach ($intent['entities']['search_query'] as $search_query) {
                $this->recherche .= ' ' . $search_query['value'];                             
            }

            // On a notre recherche
            $this->recherche = trim($this->recherche);

            // On passe la demande à informations
            $this->demande = 'informations';
        }
        
        // Si à ce stade on n'a pas trouvé de coordonnées, ni de codePostal, ni de ville
        if (empty($this->ville) && empty($this->codePostal) && $this->demande == 'seance') {

            // Si on a une search_query on va chercher dedans si on trouve pas un code postal
            if (array_key_exists('search_query', $intent["entities"])) {
                // On parcourt tous les search_query pour vérifier si on n'a pas trouvé un code postal par hasard
                foreach ($intent["entities"]['search_query'] as $search_query => $informations_search_query) {
                    if (is_numeric($informations_search_query['value']) && strlen($informations_search_query['value']) == 5) {
                        // Code Postal
                        $this->codePostal = $informations_search_query['value'];
                        // Ville
                        $this->ville = $this->getCoordinatesCP($this->codePostal);
                    }
                }    
            }
            
            // Si on a bien une ville
            if (!empty($this->ville)) {
                // On récupère les coordonnées GPS
                $coord = $this->getCoordinatesVille($this->ville);
                if (!empty($coord)) {
                    $this->latitude = $coord[0];
                    $this->longitude = $coord[1];
                }

            // Si on n'a pas trouvé de ville, on prend les coordonnées GPS transmises
            } else {
                if (!empty($geolocation['longitude']) && !empty($geolocation['latitude'])) {
                    $this->latitude  = $geolocation['latitude'];
                    $this->longitude = $geolocation['longitude'];
                }
            }
            
        }
    }

    public function run() 
    {
        // Préparation du client Guzzle
        $client = new Client();

        // Récupération des paramètres de la requête
        $parametres = $this->getQueryParams();

        // Si nous avons une demande pour un cinéma en particulier, on effectue un pré-traitement
        if ($this->cinema) {
            $listeSalles = $this->getListeSalles($client, $parametres);
            // $listeSalles = json_decode($listeSalles->getBody(), true);

            // Si on a des résultats (normalement toujours, mais bon on sait jamais hein)
            if (array_key_exists('feed', $listeSalles) && array_key_exists('theater', $listeSalles['feed'])) {
                // On a petit tableau avec les codes des différentes salles
                $correspondanceCodeChaineCinema          = array();
                $correspondanceCodeChaineCinema['ugc']   = '81001';
                $correspondanceCodeChaineCinema['pathé'] = '81003';
                $correspondanceCodeChaineCinema['pathe'] = '81003';

                $listeCodesCinema = array();
                foreach ($listeSalles['feed']['theater'] as $salleCinema) {
                    // Si la distance est trop grande, on ne prend pas
                    if ($salleCinema['distance'] > 20) {
                        continue;
                    }

                    // Si le nom du cinéma correspond
                    if (similar_text(strtolower($salleCinema['name']), strtolower($this->cinema)) == strlen($this->cinema)) {
                        // On l'ajoute à nos cinémas intéressants
                        $listeCodesCinema[] = $salleCinema['code'];
                    } 
                    // Ou si le chaine du cinéma correspond
                    elseif ($correspondanceCodeChaineCinema[$this->cinema] == $salleCinema['cinemaChain']['code']) {
                        // On l'ajoute à nos cinémas intéressants
                        $listeCodesCinema[] = $salleCinema['code'];
                    }
                }
            
                // Cette liste contient les codes des salles de cinéma qui peuvent nous intéresser
                $parametres['query']['theaters'] = implode(',', $listeCodesCinema);
            }
        }
        
        // Si nous avons une search_query, c'est problablement un film
        if ($this->recherche) {
            // On veut trouver le code du film, comme ça on récupèrera les séances de ce film uniquement
            $parametres['query']['q']      = $this->recherche;
            $parametres['query']['filter'] = 'movie';
            $parametres['query']['count']  = '10';

            $informationsFilm = $this->getInformationsFilm($client, $parametres);
            // $informationsFilm = json_decode($informationsFilm->getBody(), true);
            
            // Si on a des résultats
            if (array_key_exists('feed', $informationsFilm) && array_key_exists('movie', $informationsFilm['feed'])) {
                // On enregistre le code du film
                $parametres['query']['movie'] = $informationsFilm['feed']['movie'][0]['code'];
            }

            // On unset les filtres de requête inutiles
            unset($parametres['query']['filter']);
            unset($parametres['query']['count']);
        }

        // Si nous avons bien une ville, on veut les séances de cinéma à proximité de la ville
        if (!empty($this->latitude) && !empty($this->longitude) && $this->demande == 'seance') {
            $response = $this->getSeancesCinema($client, $parametres);
        } 

        // Sinon, si la demande est informations
        else if ($this->demande == 'informations') {
            // On récupère les informations sur le film
            $informationsFilm = $this->getInformationsFilm($client, $parametres);

            // Si on a des résultats, on les parcourt pour récupérer + d'informations
            if (array_key_exists('feed', $informationsFilm) && array_key_exists('movie', $informationsFilm['feed'])) {
                if (count($informationsFilm['feed']['movie']) > 0) {
                    foreach ($informationsFilm['feed']['movie'] as &$film) {
                        $parametres['query']['code'] = $film['code'];
                        $film              = $this->getDetailsFilm($client, $parametres);
                    }    
                }
            }
            
            // On retournera ce jeu de résultat + complet
            $response = $informationsFilm;
        }

        // Sinon on sort la liste des films du moment
        else {
            $response = $this->getFilmsDuMoment($client, $parametres);
        }
        
        // Retour de la réponse
        return $this->addIntent($response);
    }
    
    public function getQueryParams() 
    {
        $parametres = [
            'query' => [
                'partner' => env('ALLOCINE_TOKEN'),
                'format'  => 'json',
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . env('ALLOCINE_TOKEN'),
                'User-Agent'    => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
            ]
        ];

        // Si on a bien une location
        if (!empty($this->latitude) && !empty($this->longitude)) {
            $parametres['query']['lat']    = $this->latitude;
            $parametres['query']['long']   = $this->longitude;
            $parametres['query']['radius'] = '20';
        }

        // Si on a une search query et que la demande est informations
        if ($this->demande == 'informations' && !empty($this->recherche)) {
            $parametres['query']['q'] = $this->recherche;
        }

        // Si on a une salle de cinéma, la demande est séance
        if ($this->cinema) {
            // La demande devient une demande de Séance
            $this->demande = 'seance';
        }

        // Retour des paramètres
        return $parametres;
    }

    public function generateToken() {}

// ========================================================================================================================================================== //

    /*
        *       Fonctions de requête
        *       
        *       getListeSalles
        *       getInformationsFilm
        *       getSeancesCinema
        *       getFilmsDuMoment
        *
    */  

    public function getListeSalles($client, $parametres)
    {
        // On veut les 100 premiers résultats pour être tranquille et bien tout parcourir
        $parametres['query']['count'] = '100';

        // Envoi de la requête
        $response = $client->request('GET', 'http://api.allocine.fr/rest/v3/theaterlist', $parametres);
        $compteurRequete = 0;

        // On insiste jusqu'à obtenir une réponse
        while ($response->getStatusCode() != '200' && $compteurRequete < 100) {
            $response = $client->request('GET', 'http://api.allocine.fr/rest/v3/theaterlist', $parametres);
            $compteurRequete++;
        }

        // On parse la réponse
        $response = $response->getBody();
        $response = json_decode($response, true);

        // Retour de la réponse
        return $response;
    }

    public function getInformationsFilm($client, $parametres)
    {
        // Envoi de la requête
        $response = $client->request('GET', 'http://api.allocine.fr/rest/v3/search', $parametres);
        $compteurRequete = 0;

        // On insiste jusqu'à obtenir une réponse
        while ($response->getStatusCode() != '200' && $compteurRequete < 100) {
            $response = $client->request('GET', 'http://api.allocine.fr/rest/v3/search', $parametres);
            $compteurRequete++;
        }

        // On parse la réponse
        $response = $response->getBody();
        $response = json_decode($response, true);
        
        // Retour de la réponse
        return $response;
    }

    public function getDetailsFilm($client, $parametres)
    {
        // Envoi de la requête
        $response = $client->request('GET', 'http://api.allocine.fr/rest/v3/movie', $parametres);
        $compteurRequete = 0;

        // On insiste jusqu'à obtenir une réponse
        while ($response->getStatusCode() != '200' && $compteurRequete < 100) {
            $response = $client->request('GET', 'http://api.allocine.fr/rest/v3/movie', $parametres);
            $compteurRequete++;
        }
        
        // On parse la réponse
        $response = $response->getBody();
        $response = json_decode($response, true);

        // Retour de la réponse
        return $response;   
    }

    public function getSeancesCinema($client, $parametres) 
    {
        // Envoi de la requête
        $response = $client->request('GET', 'http://api.allocine.fr/rest/v3/showtimelist', $parametres);
        $compteurRequete = 0;

        // On insiste jusqu'à obtenir une réponse
        while ($response->getStatusCode() != '200' && $compteurRequete < 100) {
            $response = $client->request('GET', 'http://api.allocine.fr/rest/v3/showtimelist', $parametres);
            $compteurRequete++;
        }
        
        // On parse la réponse
        $response = $response->getBody();
        $response = json_decode($response, true);

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
        $response = $client->request('GET', 'http://api.allocine.fr/rest/v3/movielist', $parametres);
        $compteurRequete = 0;

        // On insiste jusqu'à obtenir une réponse
        while ($response->getStatusCode() != '200' && $compteurRequete < 100) {
            $response = $client->request('GET', 'http://api.allocine.fr/rest/v3/movielist', $parametres);
            $compteurRequete++;
        }

        // On parse la réponse
        $response = $response->getBody();
        $response = json_decode($response, true);

        // Retour de la réponse
        return $response;   
    }

// ========================================================================================================================================================== //

    /*
        *       Fonctions de localisation
        *       
        *       getCoordinatesCP
        *       getCoordinatesVille
        *
        *
    */
    public function getCoordinatesCP($codePostal)
    {
        // On ajoute le pays France sinon ça marche pas terrible
        $codePostal .= " France";
        $codePostal = urlencode($codePostal);

        // On se sert de Google Maps
        $url        = "http://maps.google.com/maps/api/geocode/json?sensor=false&address=" . $codePostal;
        $retour     = file_get_contents($url);
        $json       = json_decode($retour, true);

        if (array_key_exists('results', $json) && count($json['results']) > 0) {
            if (array_key_exists('address_components', $json['results'][0]) && array_key_exists(1, $json['results'][0]['address_components'])) {
                $ville = $json['results'][0]['address_components'][1]['long_name'];
            }
        }
        
        return $ville;
    }

    public function getCoordinatesVille($ville)
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
}