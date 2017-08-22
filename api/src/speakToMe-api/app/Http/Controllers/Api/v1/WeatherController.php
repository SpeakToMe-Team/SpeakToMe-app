<?php
namespace App\Http\Controllers\Api\v1;

use GuzzleHttp\Client;
use App\Http\Controllers\Api\v1\AirqualityController;

class WeatherController extends ApiController
{
    protected $name = 'weather';
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
        /*DEBUG, a enlever si appel des infos complémentaires côté front*/
        $objResponse['aqi']=$this->getAQI($objResponse['city']['coord']['lat'],$objResponse['city']['coord']['lon']);


        return $this->addIntent($objResponse);
    }


    /*CASCADE: Renvoie la qualité de l'air en fonction du jeu de resultat de la requete meteo
    @param $lat latitude string
    @param $lon longitude string
    @return
    */

    public function getAQI($lat,$lon){

      $params = array();
      $params['lon']=$lon;
      $params['lat']=$lat;
      $aqi=new AirqualityController($params);
      $aqi=$aqi->run();
        $result['station']=$aqi['data']['city']['name'];
        $result['index']=$aqi['data']['aqi'];
        $result['msg']=htmlentities($this->getAQImsg($aqi));
        $result['rawdata']=$aqi;
        return $result;
    }

    /*Enrichie le contenu de aqi par un message en fonction de l'indice aqi*/

    public function getAQImsg($aqi)
    {
        $value=$aqi['data']['aqi']['index'];
        // AQI Level: Good
        if ($value >= 0 && $value <= 50) {
            $msg = 'c\'est comme si Scarlett Johansson été assise sur ton visage';
        }
        // AQI Level: Moderate
        if ($value >= 51 && $value <= 100) {
            $msg = 'modéré';
           
        }
        // AQI Level: Unhealthy for sensitive groups
        if ($value >= 101 && $value <= 150) {
            $msg = 'mauvais pour les groupes sensibles';
           
        }
        // AQI Level: Unhealthy
        if ($value >= 151 && $value <= 200) {
            $msg = 'mauvais';
            
        }
        // AQI Level: Very unhealthy
        if ($value >= 201 && $value <= 300) {
            $msg = 'très mauvais';
            
        }
        // AQI Level: Hazardous
        if ($value >= 300) {
            $msg = 'dangereux';
            
        }
        return $msg;

    }


    public function getQueryParams() {

        $params = [
            'query' => [
                'cnt' => config('external_api.params.weather.day_count'),
                'units' => config('external_api.params.weather.units'),
                'APPID' => env('OPENWEATHERMAP_APPID'),
                'lang' => 'fr'
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