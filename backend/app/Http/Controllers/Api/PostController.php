<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Models\Post;
use App\Models\User;
use App\Models\Post_Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\Rating_value;
use App\Models\Category;
use Exception;

class PostController extends Controller
{
    public function getOtherPostDetails($posts, $userID)
    {
        foreach ($posts as $post) {
            $categories = Post_Category::where("postID", $post->id)->get();
            foreach ($categories as $category) {
                $category->name = Category::where("id", $category->categoryID)->first()->categoryName;
            }
            $post->categories = $categories;
            $rating = $this->getPostRating($post->id, $userID);
            $post->name = $this->getPostOwner($post->userID);
            $post->ratingValue = $rating['ratingValue'];
            $post->isRated = $rating['isRated'];
        }
    }
    public function posts(Request $request)
    {
        $posts = Post::orderBy("created_at", "desc")->get();
        $this->getOtherPostDetails($posts, $request->user()->id);
        return response(['posts' => $posts]);
    }



    public function userPosts(Request $request)
    {
        $posts = Post::where('userID', $request->userID)->orderBy("created_at", "desc")->get();
        $this->getOtherPostDetails($posts, $request->user()->id);
        return response(['posts' => $posts]);
    }

    public function addPost(Request $request)
    {
        try {
            $post = new Post();
            $post->init($request->user()->id, $request->title,  $request->body);
            $post->save();
            foreach ($request->categoryIDs as $categoryID) {
                $postCategory = new Post_Category;
                $postCategory->init($categoryID, $post->id);
                $postCategory->save();
            }
            return response(['status' => "success", "message" => "Post successfully saved", "post" => $post]);
        } catch (Exception $error) {
            return (['status' => "fail", "message" => "Error at saving post +.$error."]);
        }
    }
    public function ratePost(Request $request)
    {
        try {
            $success = ['status' => "success", "message" => "Rating successfully saved"];
            $ratings = Rating::where('postID', $request->postID)->get();
            foreach ($ratings as $rating) {
                if ($rating->userID == $request->user()->id) {
                    if ($request->valueID != $rating->valueID) {
                        $rating->valueID = $request->valueID;
                        $rating->save();
                    }
                    return response($success);
                }
            }
            $rating = new Rating;
            $rating->init($request->user()->id, $request->postID, $request->valueID);
            $rating->save();
            return response($success);
        } catch (Exception $error) {
            return (['status' => "fail", "message" => "Error at saving rating", 'error' => $error]);
        }
    }

    public function getPostRating($postID, $userID)
    {
        $ratings = Rating::where('postID', $postID)->get();
        // var_dump($ratings);
        $result = 0;
        $isRated = false;
        settype($result, "double");
        if (count($ratings) > 0) {
            foreach ($ratings as $rating) {
                $ratingValue = Rating_value::where("id", $rating->valueID)->first();
                if ($rating->userID == $userID) {
                    $isRated = true;
                }
                $result += $ratingValue->value;
            }
            $result = $result / count($ratings);
        }
        return ["ratingValue" => number_format((float)$result, 1, '.', ''), "isRated" => $isRated];
    }
    public function getRating(Request $request)
    {
        return $this->getPostRating($request->postID, $request->user()->id);
    }

    public function getPostOwner($userID)
    {
        $user = User::where('id', $userID)->first();
        return $user->name;
    }
    public function getRatingValues()
    {
        $ratingValues = Rating_value::all();
        return $ratingValues;
    }
    public function deletePost(Request $request)
    {
        $post = Post::where("id", $request->postID)->first();
        if ($post->userID == $request->user()->id || $request->user()->isAdmin) {
            Rating::where("postID", $request->postID)->delete();
            Post_Category::where("postID", $request->postID)->delete();
            $post->delete();
            return ['status' => "success", "message" => "Post successfully deleted"];
        } else {
            return ['status' => "fail", "message" => "Not authorized"];
        }
    }
    public function editPost(Request $request)
    {
        try {
            $post = Post::where("id", $request->post['id'])->first();
            $post->title = $request->post['title'];
            $post->body = $request->post['body'];
            $post->save();
            return ['status' => "success", "message" => "Post successfully edited", "post" => $post];
        } catch (Exception $error) {
            return (['status' => "fail", "message" => "Error at editing the post", 'error' => $error]);
        }
    }


    public function getPostCountByCategory()
    {
        try {
            $categories = DB::table("post_categories")
                ->select("post_categories.categoryID", "categories.categoryName", DB::raw('COUNT(post_categories.categoryID) as count'))
                ->join("categories", "post_categories.categoryID", "=", "categories.id")
                ->groupBy("categoryID")->get();
            return ['status' => "success", "message" => "Caterory post count successfully fetched", "categories" => $categories];
        } catch (Exception $error) {
            return (['status' => "fail", "message" => "Error at fetching category count", 'error' => $error]);
        }
    }
}
