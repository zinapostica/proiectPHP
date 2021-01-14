<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\ResetsPasswords;

class ResetPasswordController extends Controller
{
    use ResetsPasswords;

    protected function sendResetResponse(Request $request, $response)
    {
        return response(['message'=> trans($response)]);

    }

    protected function sendResetFailedResponse(Request $request, $response)
    {
        return response(['error'=> trans($response)], 422);
    }
}