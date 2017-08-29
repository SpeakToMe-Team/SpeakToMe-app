<?php
namespace App\Http\Controllers\Api\v1;

use GuzzleHttp\Client;

class MusicController extends ApiController
{
    protected $name = 'music';
    private $query = [];
    private $regenerate;
    private $prep= array (' de ','%20de%20',' des ','%20des%20',' par ','%20par%20');
    private $limit = 10;
    private $searchType = [];


    public function __construct($intent) {
        $client = new Client([
            'base_uri' => 'https://api.wit.ai/',
            'headers' => [
                'Authorization' => 'Bearer ' . env('WIT_MUSIC_TOKEN'),
            ],
            'http_errors' => false
        ]);
        $params = [
            'query' => [
                'q' => $intent['_text'],
            ]
        ];
        $response = $client->request('GET', 'message', $params);
        $body = $response->getBody();
        $intent = json_decode($body, true);

        if (isset($intent['entities']['music_track'][0]['value'])) {
            $this->searchType[] = 'track';
            $this->query[] = $intent['entities']['music_track'][0]['value'];
        }
        if (isset($intent['entities']['music_artist'][0]['value'])) {
            $this->searchType[] = 'artist';
            $this->query[] = $intent['entities']['music_artist'][0]['value'];
        }
        if (isset($intent['entities']['music_album'][0]['value'])) {
            $this->searchType[] = 'album';
            $this->query[] = $intent['entities']['music_album'][0]['value'];
        }
    }

    public function run()
    {
        $client = new Client([
            'base_uri' => 'https://api.spotify.com/v1/',
            'headers'=>[
                'Authorization'=>'Bearer '.$this->getToken(),
            ],
            'http_errors' => false
        ]);

        $params = [
            'query' => [
                'query' => implode(' ', $this->query),
                'type' => implode(',', $this->searchType),
                'limit' => $this->limit,
            ]
        ];


        $response = $client->request('GET','search', $params);

        if ($response->getStatusCode() == 401) {

            return $this->regenerateTokenAndRun();
        }

        $body = $response->getBody();
        $objResponse = json_decode($body, true);

        return $objResponse;
    }

    /* Supprime les prépositions de la query*/
    public function filterPrep($query){
        $filtered=str_replace($this->prep,' ',$query);
        return $filtered;

    }

    public function generateToken() {
        
        $client = new Client([
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode(env('SPOTIFY_CLIENT_ID') . ':' . env('SPOTIFY_CLIENT_SECRET'))
            ]
        ]);
        $params = [
            'form_params' => [
                'grant_type' => 'client_credentials'
            ]
        ];

        $response = $client->request('POST', 'https://accounts.spotify.com/api/token', $params);
        $body = $response->getBody();
        $objResponse = json_decode($body);
        $token = $objResponse->access_token;
        $this->saveToken($token);

        return $token;
    }

    public function regenerateTokenAndRun() {
        if ($this->regenerate != true) {

            $this->regenerate = true;
            $this->generateToken();

            return $this->run();

        } else {
            return json_encode(['error' => true, 'message' => "Accès refusé"]);
        }
    }


}
