<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', 'App\Http\Controllers\Api\AuthController@register');
Route::post('/login', 'App\Http\Controllers\Api\AuthController@login');
Route::post('/password/email', 'App\Http\Controllers\Api\ForgotPasswordController@sendResetLinkEmail');
Route::post('/password/reset', 'App\Http\Controllers\Api\ResetPasswordController@reset');
Route::get('/email/verify/{id}/{hash}', 'App\Http\Controllers\Api\ConfirmEmailController@verify')->name('verification.verify');
Route::get('/email/resend', 'App\Http\Controllers\Api\ConfirmEmailController@resend')->name('verification.resend');
Route::post('/updateUserCategories', 'App\Http\Controllers\Api\UserController@updateUserCategories')->middleware('auth:api');
Route::post('/addCategory', 'App\Http\Controllers\Api\UserController@addCategory')->middleware('auth:api');
Route::post('/addRatingValue', 'App\Http\Controllers\Api\UserController@addRatingValue')->middleware('auth:api');
Route::post('/addPost', 'App\Http\Controllers\Api\PostController@addPost')->middleware('auth:api');
Route::get('/allPosts', 'App\Http\Controllers\Api\PostController@posts')->middleware('auth:api');
Route::get('/userPosts', 'App\Http\Controllers\Api\PostController@userPosts')->middleware('auth:api');
Route::post('/ratePost', 'App\Http\Controllers\Api\PostController@ratePost')->middleware('auth:api');
Route::post('/addQuestion', 'App\Http\Controllers\Api\QuestionController@addQuestion')->middleware('auth:api');
Route::post('/answerQuestion', 'App\Http\Controllers\Api\QuestionController@answerQuestion')->middleware('auth:api');
Route::post('/voteAnswer', 'App\Http\Controllers\Api\QuestionController@voteAnswer')->middleware('auth:api');
Route::post('/checkToken', 'App\Http\Controllers\Api\UserController@checkToken')->middleware('auth:api');
Route::get('/ratingValues', 'App\Http\Controllers\Api\PostController@getRatingValues')->middleware('auth:api');
Route::get('/postRating', 'App\Http\Controllers\Api\PostController@getRating')->middleware('auth:api');
Route::delete('/deletePost', 'App\Http\Controllers\Api\PostController@deletePost')->middleware('auth:api');

Route::delete('/deleteQuestion', 'App\Http\Controllers\Api\QuestionController@deleteQuestion')->middleware('auth:api');
Route::get('/userQuestions', 'App\Http\Controllers\Api\QuestionController@userQuestions')->middleware('auth:api');
Route::post('/editPost', 'App\Http\Controllers\Api\PostController@editPost')->middleware('auth:api');
Route::delete('/deleteComment', 'App\Http\Controllers\Api\QuestionController@deleteComment')->middleware('auth:api');
Route::delete('/deleteCommentLike', 'App\Http\Controllers\Api\QuestionController@deleteCommentLike')->middleware('auth:api');
Route::get('/getCategories', 'App\Http\Controllers\Api\UserController@getCategories');
Route::get('/getCategoryData', 'App\Http\Controllers\Api\CategoryController@getCategoryData')->middleware('auth:api');
Route::get('/getUserCategories', 'App\Http\Controllers\Api\UserController@getUserCategories')->middleware('auth:api');

Route::post('/changeUserName', 'App\Http\Controllers\Api\UserController@changeUserName')->middleware('auth:api');
Route::get('/search', 'App\Http\Controllers\Api\UserController@search')->middleware('auth:api');

Route::post('/changeUserEmail', 'App\Http\Controllers\Api\UserController@changeEmail')->middleware('auth:api');

Route::get('/getPostCountByCategory', 'App\Http\Controllers\Api\PostController@getPostCountByCategory')->middleware('auth:api');
Route::get('/getQuestionCountByCategory', 'App\Http\Controllers\Api\QuestionController@getQuestionCountByCategory')->middleware('auth:api');




