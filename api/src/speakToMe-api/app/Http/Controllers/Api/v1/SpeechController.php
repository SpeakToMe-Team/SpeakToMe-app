<?php
namespace App\Http\Controllers\Api\v1;

use App\Api;
use Dingo\Api\Contract\Http\Request;
use Dingo\Api\Http\Response;
use Dingo\Api\Routing\Helpers;
use Illuminate\Routing\Controller;
use GuzzleHttp\Client;

class SpeechController extends Controller
{
    use Helpers;

    private $intent;
    private $targetApi;
    private $geo;

    public function index(Request $request)
    {

        $this->request = $request;
        $query = $request->query('query');

        //$this->geo=$request->headers('geo');

        if (empty($query)) {

            return "Query is empty.";
        }

        $intentAnalyser = new IntentAnalyserController($query);
        $this->intent = $intentAnalyser->run();
        $this->targetApi = $this->getTargetApi();

        return $this->targetApi->run();
    }

    public function getTargetApi() {

        if (isset($this->intent['entities']['intent'][0])) {
            $intent = $this->intent['entities']['intent'][0]['value'];
            if (array_key_exists($intent, config('external_api.keywords'))) {
                $className = 'App\Http\Controllers\Api\v1\\' . ucfirst($intent) . 'Controller';
                return new $className($this->intent,$this->geo=null);
            }
        }
    }
}