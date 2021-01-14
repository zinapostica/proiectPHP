<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\User_category;
use Exception;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $user = null;
        try {
            $registerData = $request->validate([
                'name' => 'required|max:55',
                'email' => 'email|required|unique:users',
                'password' => 'required'
            ]);
            $registerData['password'] = bcrypt($request->password);
            $user = User::create($registerData);
            $accessToken = $user->createToken('authToken')->accessToken;
            $user->sendEmailVerificationNotification();
            foreach ($request->categoryIDs as $categoryID) {
                $user_category = new User_category();
                $user_category->userID = $user->id;
                $user_category->categoryID = $categoryID;
                $user_category->save();
            }
            return response([
                'status' => "success",
                'user' => $user,
                'access_token' => $accessToken,
                'message' => 'success'
            ]);
        } catch (Exception $e) {
            return response(["error" => $e, "status" => "fail"]);
        }
    }
    public function login(Request $request)
    {
        $loginData = $request->validate([
            'email' => 'email|required',
            'password' => 'required'
        ]);
        if (!Auth::attempt($loginData)) {
            return response(['message' => 'Invalid credentials', 'status' => 'failure']);
        }
        $accessToken = Auth::user()->createToken('authToken')->accessToken;
        return response(['user' => Auth::user(), 'access_token' => $accessToken, 'status' => 'success']);
    }
}
