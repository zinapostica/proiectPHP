<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment_like extends Model
{
  use HasFactory;
  protected $table = 'comment_likes';
  protected $fillable = array('userID', 'commentID');
  public $timestamps = false;
  function init($userID, $commentID)
  {
    $this->userID = $userID;
    $this->commentID = $commentID;
  }
}
