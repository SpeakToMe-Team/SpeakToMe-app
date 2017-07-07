<?php
namespace App\Http\Controllers\Api\v1;

use GuzzleHttp\Client;

class WeatherController extends ApiController
{
    protected $name = 'travel';
    private $query;
    private $longitude;
    private $latitude;
    private $city;
    private $countryCode;

    public function __construct($intent) {
        if (isset($intent['entities']['location'][0]['value'])) {
            $this->city = $intent['entities']['location'][0]['value'];
        } else {
            $this->latitude = '45.770297';
            $this->longitude = '4.863703';
        }
    }

    public function run() {

        $client = new Client();
        $response = $client->request('GET', 'api.openweathermap.org/data/2.5/forecast/daily', $this->getQueryParams());
        $body = $response->getBody();
        $objResponse = json_decode($body, true);
        return $objResponse;
    }
    
    public function getQueryParams() {

        $params = [
            'query' => [
                'cnt' => config('external_api.params.weather.day_count'),
                'units' => config('external_api.params.weather.units'),
                'APPID' => env('OPENWEATHERMAP_APPID'),
            ]
        ];

        if (!is_null($this->city)) {
            $params['query']['q'] = $this->city . (!is_null($this->countryCode) ? $this->countryCode : null);
        } else {
            $params['query']['lat'] = $this->latitude;
            $params['query']['lon'] = $this->longitude;
        }
        return $params;
    }

    public function generateToken() {}
}