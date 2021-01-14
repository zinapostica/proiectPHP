<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\QuestionController;
use App\Models\Category;
use App\Models\Post;
use App\Models\Question;
use App\Models\Rating_value;
use App\Models\User_category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class UserController extends Controller
{
    public function getCategories()
    {
        try {
            $categories = Category::all();
            return response(['status' => "success", "message" => "Categories successfully fetched", "categories" => $categories]);
        } catch (Exception $error) {
            return response(['status' => "fail", "message" => "Could not fetch categories", "error" => $error, "categories" => []]);
        }
    }

    public function getUserCategories(Request $request)
    {
        try {
            //select categories.* from categories join user_categories on user_categories.categoryID = categories.id where user_categories.userID=22;
            $categories = DB::table("categories")
                ->select("categories.*")
                ->join("user_categories", "user_categories.categoryID", "=", "categories.id")
                ->where("user_categories.userID", $request->user()->id)->get();
            return response(['status' => "success", "message" => "User categories successfully fetched", "categories" => $categories]);
        } catch (Exception $error) {
            return response(['status' => "fail", "message" => "Could not fetch user categories", "error" => $error, "categories" => []]);
        }
    }

    public function addCategory(Request $request)
    {
        try {
            if ($request->user()->isAdmin) {
                $category = new Category;
                $category->init($request->categoryName);
                $category->save();
                return response(['status' => "success", "message" => "User categories successfully saved"]);
            } else {
                return response(['status' => "fail", "message" => "Not Authorized"]);
            }
        } catch (Exception $error) {
            return (['status' => "fail", "message" => "Error at updating Fcategories", "error" => $error]);
        }
    }
    public function addRatingValue(Request $request)
    {
        try {
            if ($request->user()->isAdmin) {
                $rating = new Rating_value($request->value);
                $rating->save();
                return response(['status' => "success", "message" => "User categories successfully saved"]);
            } else {
                return response(['status' => "fail", "message" => "Not Authorized"]);
            }
        } catch (Exception $error) {
            return (['status' => "fail", "message" => "Error at updating Fcategories", "error" => $error]);
        }
    }
    public function checkToken(Request $request)
    {
        try {
            return response(["status" => "success", 'user' => $request->user()]);
        } catch (Exception $e) {
            return response(["status" => "fail", "error" => $e]);
        }
    }
    public function updateUserCategories(Request $request)
    {
        try {
            $categories = User_category::where('userID', $request->user()->id)->get();
            foreach ($request->categoryIDs as $categoryID) {
                $isSaved = false;
                foreach ($categories as $category) {
                    if ($categoryID === $category->categoryID) {
                        $isSaved = true;
                        break;
                    }
                }
                if (!$isSaved) {
                    $user_category = new User_category();
                    $user_category->userID = $request->user()->id;
                    $user_category->categoryID = $categoryID;
                    $user_category->save();
                }
            }
            return response(['status' => "success", "message" => "User categories successfully saved"]);
        } catch (Exception $error) {
            return (['status' => "fail", "message" => "Error at updating Fcategories", "error" => $error]);
        }

        // $results = DB::insert('insert into user_categories (categoryID, userID) values (?, ?)', [$request->categoryID, $request->user()->id]);
        // return $results;
    }

    public function search(Request $request)
    {
        try {
            if ($request->key) {
                $posts = Post::where('title', 'LIKE', '%' . $request->key . '%', "or", 'body', 'LIKE', '%' . $request->key . '%')->get();
                $postController = new PostController;
                $postController->getOtherPostDetails($posts, $request->user()->id);
                $questions = Question::where('body', 'LIKE', '%' . $request->key . '%')->get();
                $questionController = new QuestionController();
                $questionController->getOtherQuestionDetails($questions, $request->user()->id);
                return response(['status' => "success", "message" => "Search was successful", 'posts' => $posts, 'questions' => $questions]);
            }
            return response(["status" => "fail", "message" => "Search key is null"]);
        } catch (Exception $e) {
            return response(["status" => "fail", "error" => $e]);
        }
    }

    public function changeUserName(Request $request)
    {
        try {
            if ($request->userID == $request->user()->id) {
                $user = User::where("id", $request->userID)->first();
                $user->name = $request->name;
                $user->save();
                return response(['status' => "success", "message" => "User name has been changed", 'user' => $user]);
            }
            return response(["status" => "fail", "message" => "Not authorized"]);
        } catch (Exception $e) {
            return response(["status" => "fail", "error" => $e]);
        }
    }
    public function changeEmail(Request $request)
    {
        try {
            if ($request->userID == $request->user()->id) {
                $user = User::where("id", $request->userID)->first();
                $user->email = $request->email;
                $user->email_verified_at = null;
                $user->save();
                $request->user()->sendEmailVerificationNotification();
                return response(['status' => "success", "message" => "User email has been changed", 'user' => $user]);
            }
            return response(["status" => "fail", "message" => "Not authorized"]);
        } catch (Exception $e) {
            return response(["status" => "fail", "error" => $e]);
        }
    }
}
