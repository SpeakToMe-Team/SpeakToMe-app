<?php
namespace App\Http\Controllers\Api\v1;

use App\Api;
abstract class ApiController implements ApiInterface
{
    protected $name;

    public function getToken()
    {
        $model = Api::where('name', $this->name)->first();

        if (!is_null($model)) {
            return $model->token;
        }

        return $this->generateToken();
    }

    public function saveToken($token)
    {
        $model = Api::where('name', $this->name)->first();

        if (!is_null($model)) {
            // UPDATE API
            $model->token = $token;
            $model->save();
        } else {
            // CREATE API
            $model = new Api();
            $model->name = $this->name;
            $model->token = $token;
            $model->save();
        }
    }

    public function addIntent($response) {

        return [
            'intent' => $this->name,
            'response' => $response
        ];
    }
}