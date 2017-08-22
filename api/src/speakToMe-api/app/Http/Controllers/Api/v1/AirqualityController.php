<?php
namespace App\Http\Controllers\Api\v1;

use GuzzleHttp\Client;

class AirqualityController extends ApiController
{
    private $city;

    public function __construct($params) {

            $this->latitude = $params['lat'];
            $this->longitude = $params['lon'];

    }
    public function run()
    {
        $client = new Client();
        $response = $client->request('GET', 'http://api.waqi.info/feed/geo:'.$this->latitude.';'.$this->longitude.'/?token=',$this->getQueryParams());
        $body = $response->getBody();
        $objResponse = json_decode($body, true);
        return $objResponse;
    }

    
    public function getQueryParams() {

        $params = [
            'query' => [
                'token' => env('AIR_QUALITY'),
            ]
        ];
        return $params;
    }





    public function generateToken() {}
}
