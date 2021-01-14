<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
  use HasFactory;
  protected $table = 'posts';
  protected $fillable = array('body', 'title', "userID");
  // public $timestamps = false;
  // protected $guarded = array('userID', 'id');
  function init($userID, $title, $body)
  {
    $this->userID = $userID;
    $this->title = $title;
    $this->body = $body;
  }
  protected $casts = [
    'created_at' => 'datetime',
  ];
}
