<?php

namespace App\Http\Controllers\Api\v1;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Promise as GuzzlePromise;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Exception\RequestException;
use Dingo\Api\Routing\Router;

class MusicController extends ApiController
{
    protected $name = 'music';
    public function run()
    {
        $spotify_token = 'BQAfCaNQqHEFKE4lGfI70CNel3HrDVSsIeQGmHkRJv1lxU-73pivksiE7sGxIuH7_kZR88nzf3ZnRmrBhAd0lom6MWIvaGLORIHODmWmvCB39f3zfk8eBK25jiNyUicyWADj';
        $search='kidA';
        $client = new Client([
            'base_uri' => 'https://api.spotify.com/v1/',
                'headers'=>[
                    'Authorization'=>'Bearer '.$spotify_token,
                ]
            ]);
        $response = $client->request('GET','search?query='.$search.'&type=track&limit=1&offset=1');
        $body = $response->getBody();

        $objResponse = json_decode($body->getContents());
        dd($objResponse);
        /*exemple de traiement nom d'artiste*/
//        dd($objResponse->tracks->items[0]->artists[0]->name);
        return $objResponse;


    }
    public function generateToken() {


    }


}
