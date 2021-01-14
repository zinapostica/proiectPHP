<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Comment_like;
use App\Models\Question;
use App\Models\User;
use App\Models\Question_category;
use App\Models\Category;
use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\QuestionController;

class CategoryController extends Controller
{
    public function getCategoryData(Request $request)
    {
        try {
            //select posts.* from posts join post_categories on post_categories.postID = posts.id where post_categories.categoryID=1;
            $posts = DB::table('posts')
                ->select("posts.*")
                ->join("post_categories", 'posts.id', '=', 'post_categories.postID')
                ->where("post_categories.categoryID", $request->categoryID)->get();
            $postController = new PostController;
            $postController->getOtherPostDetails($posts, $request->user()->id);

            $questions = DB::table('questions')
                ->select("questions.*")
                ->join("question_categories", 'questions.id', '=', 'question_categories.questionID')
                ->where("question_categories.categoryID", $request->categoryID)->get();

            $questionController = new QuestionController;
            $questionController->getOtherQuestionDetails($questions, $request->user()->id);
            return response(["status" => "success", "message" => "Data successfully fetched", "posts" => $posts, "questions" => $questions]);
        } catch (Exception $error) {
            return response(["status" => "fail", "message" => "Could not fetch data", "error" => $error]);
        }
    }
}
