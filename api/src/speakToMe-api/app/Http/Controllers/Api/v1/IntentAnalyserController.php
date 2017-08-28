<?php
namespace App\Http\Controllers\Api\v1;

use GuzzleHttp\Client;

class IntentAnalyserController extends ApiController
{
    protected $name = 'intent_analyse';
    private $baseUri = 'https://api.wit.ai/';
    private $message;

    public function __construct($message) {
        $this->message = $message;
    }

    public function run() {

        $client = new Client(['base_uri' => $this->baseUri]);
        $response = $client->request('GET', 'message', $this->getQueryParams());
        $body = $response->getBody();
        $objResponse = json_decode($body, true);
        
        return $objResponse;
    }
    
    public function getQueryParams() {

        $params = [
            'query' => [
                'q' => $this->message,
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . env('WIT_SERVER_TOKEN'),
            ],
            'http_errors' => false
        ];
        return $params;
    }

    public function generateToken() {}
}