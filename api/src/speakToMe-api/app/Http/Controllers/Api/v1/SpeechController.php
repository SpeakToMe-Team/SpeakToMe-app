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

    public function index(Request $request)
    {
        $this->request = $request;
        $query = $request->query('query');

        if (empty($query)) {
            return "Query is empty.";
        }

        $this->targetApi = $this->getTargetApi();

        return $this->targetApi->run();
    }

    public function getTargetApi ()
    {
        $sentence = $this->request->query('query');

        foreach (config('external_api.keywords') as $api_slug => $keywords) {
            foreach ($keywords as $keyword) {
                if (strpos($sentence, $keyword) !== false) {
                    $className = 'App\Http\Controllers\Api\v1\\' . ucfirst($api_slug) . 'Controller';
                    return new $className;
                }
            }
        }

        return null;
    }
}