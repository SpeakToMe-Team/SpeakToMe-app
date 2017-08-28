<?php
namespace App\Http\Controllers\Api\v1;

use GuzzleHttp\Client;

class MusicController extends ApiController
{
    protected $name = 'music';

    protected $query;
    protected $regenerate;
    protected $i = 0;
    protected $prep= array (' de ','%20de%20',' des ','%20des%20',' par ','%20par%20');


    public function __construct($intent) {
        //dd($intent);
        if (isset($intent['entities']['search_query'][0]['value'])) {
            $this->query = $intent['entities']['search_query'][0]['value'];
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



        $response = $client->request('GET','search?query='.$this->filterPrep($this->query).'&type=track,album,artist&limit=10');

        if ($response->getStatusCode() == 401) {

            return $this->regenerateTokenAndRun();
        }

        $body = $response->getBody();
        $objResponse = json_decode($body, true);

        //dd($objResponse);
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
