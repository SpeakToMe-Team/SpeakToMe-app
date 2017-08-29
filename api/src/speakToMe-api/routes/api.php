<?php

//use Illuminate\Http\Request;
use Dingo\Api\Routing\Router;

$api = app(Router::class);

/*ROUTE AVEC MOT DE PASSE PROD*/
$api->version('v1', [], function (Router $api) {

    $api->get('speech', 'App\Http\Controllers\Api\v1\SpeechController@index')->middleware('CheckRequest')->name('speech');

});

/*DEBUG SANS MOT DE PASSE */
/*$api->version('v1', [], function (Router $api) {

    $api->get('speech', 'App\Http\Controllers\Api\v1\SpeechController@index')->name('speech');

});*/