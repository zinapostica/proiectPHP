<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;

class ForgotPasswordController extends Controller
{
    use SendsPasswordResetEmails;


    protected function sendResetLinkResponse(Request $request, $response)
    {
        return response(['message'=> $response]);

    }


    protected function sendResetLinkFailedResponse(Request $request, $response)
    {
        return response(['error'=> $response], 422);

    }
}
