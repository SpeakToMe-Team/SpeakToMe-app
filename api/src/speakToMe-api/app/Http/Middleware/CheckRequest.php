<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Encryption\DecryptException;

class CheckRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        $secret = $request->header('secret');

        try {
            decrypt($secret);
        } catch (DecryptException $e) {
            return ['error' => true, 'message' => "token secret incorrect"];
        }

        if (decrypt($secret) != env('API_PASSWORD')) {
            return ['error' => true, 'message' => "token secret incorrect"];
        }

        return $next($request);
    }
}
