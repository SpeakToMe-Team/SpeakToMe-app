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
    private $geolocation = [];

    public function index(Request $request)
    {

        $this->request = $request;
        $query = $request->query('query');
        if (!empty($request->header('latitude')) && !empty($request->header('longitude'))) {
            $this->geolocation['latitude'] = $request->header('latitude');
            $this->geolocation['longitude'] = $request->header('longitude');
        }
        if (empty($query)) {

            return ['error' => true, 'message' => "Query is empty."];
        }

        $intentAnalyser = new IntentAnalyserController($query);
        $this->intent = $intentAnalyser->run();
        $this->targetApi = $this->getTargetApi();

        if (is_array($this->targetApi) && isset($this->targetApi) && $this->targetApi == true) {
            return json_encode($this->targetApi);
        }
        return $this->targetApi->run();
    }

    public function getTargetApi() {
        if (isset($this->intent['entities']['intent'][0])) {
            $intent = $this->intent['entities']['intent'][0]['value'];
            if (in_array($intent, config('external_api.keywords'))) {
                $className = 'App\Http\Controllers\Api\v1\\' . ucfirst($intent) . 'Controller';
                return new $className($this->intent, $this->geolocation);
            }
            return ['error' => true, 'message' => "La requete n'a pu aboutir."];
        }
        return ['error' => true, 'message' => "La requete n'a pas été comprise."];
    }
}