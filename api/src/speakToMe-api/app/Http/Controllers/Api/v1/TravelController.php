<?php
namespace App\Http\Controllers\Api\v1;

use GuzzleHttp\Client;

class TravelController extends ApiController
{
    protected $name = 'travel';

    public function run() {
        $client = new Client();

        $params = [
            'query' => [
                'latitude' => '45.770297',
                'longitude' => '4.863703',
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->getToken(),
            ]
        ];

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