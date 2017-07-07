<?php
namespace App\Http\Controllers\Api\v1;

use GuzzleHttp\Client;

class WeatherController extends ApiController
{
    protected $name = 'weather';

    public function run() {
        $client = new Client();

        $params = [
            'query' => [
                'lat' => '45.770297',
                'lon' => '4.863703',
                'cnt' => config('external_api.params.weather.day_count'),
                'units' => config('external_api.params.weather.units'),
                'APPID' => '9cb887bf5a6247eda43c5f6b56c3d308'
            ]
        ];

        $response = $client->request('GET', 'api.openweathermap.org/data/2.5/forecast/daily', $params);

        $body = $response->getBody();
        $objResponse = json_decode($body, true);
        return $objResponse;
    }

    public function generateToken() {}
}