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
use Illuminate\Http\Request;
use Exception;

class QuestionController extends Controller
{
    public function addQuestion(Request $request)
    {
        try {
            $question = new Question;
            $question->init($request->user()->id, $request->body);
            $question->save();
            foreach ($request->categoryIDs as $categoryID) {
                $questionCategory = new Question_category;
                $questionCategory->init($categoryID, $question->id);
                $questionCategory->save();
            }
            return response(['status' => "success", "message" => "question successfully saved", "question" => $question]);
        } catch (Exception $error) {
            return (['status' => "fail", "message" => "Error at saving question", $error]);
        }
    }
    public function answerQuestion(Request $request)
    {
        try {
            $comment = new Comment;
            $comment->init($request->user()->id, $request->questionID, $request->body);
            $comment->save();
            $comment->name = $request->user()->name;
            $comment->isliked = false;
            $comment->likes = 0;
            return response(['status' => "success", "message" => "comment successfully saved", "comment" => $comment]);
        } catch (Exception $error) {
            return (['status' => "fail", "message" => "Error at saving comment", $error]);
        }
    }
    public function voteAnswer(Request $request)
    {
        try {
            $votes = Comment_like::where('commentID', $request->commentID)->get();
            foreach ($votes as $vote) {
                if ($request->user()->id == $vote->userID) {
                    return (['status' => "fail", "message" => "User already voted"]);
                }
            }
            $comment = new Comment_like;
            $comment->init($request->user()->id, $request->commentID);
            $comment->save();
            return response(['status' => "success", "message" => "Vote successfully saved", "like" => $comment]);
        } catch (Exception $error) {
            return (['status' => "fail", "message" => "Error at saving the vote", $error]);
        }
    }
    public function deleteQuestion(Request $request)
    {
        $question = Question::where("id", $request->questionID)->first();
        if ($question->userID == $request->user()->id || $request->user()->isAdmin) {
            $comments = Comment::where("questionID", $request->questionID)->get();
            foreach ($comments as $comment) {
                Comment_like::where("commentID", $comment->id)->delete();
                $comment->delete();
            }
            Question_Category::where("questionID", $request->questionID)->delete();
            $question->delete();
            return ['status' => "success", "message" => "Question successfully deleted"];
        } else {
            return ['status' => "fail", "message" => "Not authorized"];
        }
    }

    public function deleteComment(Request $request)
    {
        $comment = Comment::where("id", $request->commentID)->first();
        $post = Post::where("id", $comment->postID)->first();
        if ($comment->userID == $request->user()->id || $request->user()->isAdmin || $request->user()->id == $post->userID) {
            Comment_like::where("commentID", $comment->id)->delete();
            $comment->delete();
            return ['status' => "success", "message" => "comment successfully deleted"];
        } else {
            return ['status' => "fail", "message" => "Not authorized"];
        }
    }

    public function deleteCommentLike(Request $request)
    {

        try {
            Comment_like::where("commentID", $request->commentID)->where("userID", $request->user()->id)->delete();
            return response(['status' => "success", "message" => "Like successfully deleted"]);
        } catch (Exception $error) {
            return (['status' => "fail", "message" => "Error at deleting the like", $error]);
        }
    }


    public function userQuestions(Request $request)
    {
        $questions = Question::where('userID', $request->userID)->orderBy("created_at", "desc")->get();
        $this->getOtherQuestionDetails($questions, $request->user()->id);
        return response(['questions' => $questions]);
    }
    public function getOtherQuestionDetails($questions, $userID)
    {
        foreach ($questions as $question) {
            $categories = Question_Category::where("questionID", $question->id)->get();
            foreach ($categories as $category) {
                $category->name = Category::where("id", $category->categoryID)->first()->categoryName;
            }
            $question->categories = $categories;
            $question->name = $this->getQuestionOwner($question->userID);
            $question->comments = Comment::where("questionID", $question->id)->orderBy("created_at", "desc")->get();
            
            foreach ($question->comments as $comment) {
                $isLiked = false;
                $likes = Comment_like::where("commentID", $comment->id)->get();
                foreach ($likes as $like) {
                    if ($like->userID == $userID) {
                        $isLiked = true;
                    }
                }
                $comment->isLiked = $isLiked;
                $comment->likes = count($likes);
                $comment->name = User::where("id", $comment->userID)->first()->name;
            }
            

        }
    }
    public function getQuestionOwner($userID)
    {
        $user = User::where('id', $userID)->first();
        return $user->name;
    }
    public function getQuestionCountByCategory()
    {
        try {
            $categories = DB::table("question_categories")
                ->select("question_categories.categoryID", "categories.categoryName", DB::raw('COUNT(question_categories.categoryID) as count'))
                ->join("categories", "question_categories.categoryID", "=", "categories.id")
                ->groupBy("categoryID")->get();
            return ['status' => "success", "message" => "Caterory question count successfully fetched", "categories" => $categories];
        } catch (Exception $error) {
            return (['status' => "fail", "message" => "Error at fetching category count", 'error' => $error]);
        }
    }
}
