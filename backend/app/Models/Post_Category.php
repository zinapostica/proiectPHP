<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post_Category extends Model
{
  use HasFactory;
  protected $table = 'post_categories';
  protected $fillable = array('categoryID', 'postID');
  public $timestamps = false;
  public function init($categoryID, $postID)
  {
    $this->categoryID = $categoryID;
    $this->postID = $postID;
  }
}
