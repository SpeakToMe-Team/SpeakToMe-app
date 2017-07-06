<?php
namespace App\Http\Controllers\Api\v1;

interface ApiInterface
{
    public function getToken();
    public function saveToken($token);
    public function generateToken();
    public function run();
}