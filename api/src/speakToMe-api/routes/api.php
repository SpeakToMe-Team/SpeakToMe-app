<?php

//use Illuminate\Http\Request;
use Dingo\Api\Routing\Router;

$api = app(Router::class);

$api->version('v1', [], function (Router $api) {

    $api->get('speech', 'App\Http\Controllers\Api\v1\SpeechController@index')->name('speech');
    $api->get('music-callback','App\Http\Controllers\Api\v1\MusicCallbackController@index')->name('music-callback');

});