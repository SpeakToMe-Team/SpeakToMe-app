<?php
namespace App\Http\Controllers\Api\v1;

use GuzzleHttp\Client;

class TravelController extends ApiController
{
    protected $name = 'travel';
    private $location;
    private $latitude;
    private $longitude;
    private $category;
    private $searchQuery;
    private $openAt;

    public function __construct($intent, $geolocation) {
        if (isset($intent['entities']['location'][0]['value'])) {
            if (count($intent['entities']['location']) > 1) {
                $this->location = implode(', ', array_column($intent['entities']['location'], 'value'));
            } else {
                $this->location = $intent['entities']['location'][0]['value'];
            }
        } elseif (!empty($geolocation['latitude']) && !empty($geolocation['latitude'])) {
            $this->latitude = $geolocation['latitude'];//'45.770297';
            $this->longitude = $geolocation['longitude'];//'4.863703';
        }

        if (isset($intent['entities']['travel_category'][0]['value']))
            $this->category = $intent['entities']['travel_category'][0]['value'];

        if (isset($intent['entities']['search_query'][0]['value']))
            $this->searchQuery = $intent['entities']['search_query'][0]['value'];

        if (isset($intent['entities']['travel_term'][0]['value']))
            $this->searchQuery .= ' ' . $intent['entities']['travel_term'][0]['value'];

        if (isset($intent['entities']['datetime'][0]['value'])) {
            $datetime = new \DateTime($intent['entities']['datetime'][0]['value'], new \DateTimeZone('GMT'));
            $datetime->setTimeZone(new \DateTimeZone('Europe/Paris'));
            $this->openAt = $datetime->getTimeStamp();
        }

    }

    public function run() {
        $client = new Client();

        $params = [
            'query' => [
                'term' => $this->searchQuery,
                'categories' => $this->category,
                'open_at' => $this->openAt,
                'locale' => 'fr_FR'
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->getToken(),
            ]
        ];

        if (!is_null($this->location)) {
            $params['query']['location'] = $this->location;
        } elseif (!empty($this->latitude && !empty($this->latitude))) {
            $params['query']['latitude'] = $this->latitude;
            $params['query']['longitude'] = $this->longitude;
        } else {
            return ['error' => true, 'message' => "Aucune ville ou coordonnée n'a été fournie"];
        }

        $response = $client->request('GET', 'https://api.yelp.com/v3/businesses/search', $params);
        $body = $response->getBody();
        $objResponse = json_decode($body);

        return $objResponse->businesses;
    }

    public function generateToken() {
        $client = new Client();

        $params = [
            'form_params' => [
                'client_id' => env('YELP_CLIENT_ID'),
                'client_secret' => env('YELP_CLIENT_SECRET')
            ]
        ];

        $response = $client->request('POST', 'https://api.yelp.com/oauth2/token', $params);
        $body = $response->getBody();
        $objResponse = json_decode($body);
        $token = $objResponse->access_token;
        $this->saveToken($token);

        return $token;
    }
}