<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
  use HasFactory;
  protected $table = 'comments';
  protected $fillable = array('userID', 'questionID', 'body');
  function init($userID, $questionID, $body)
  {
    $this->userID = $userID;
    $this->questionID = $questionID;
    $this->body = $body;
  }
  protected $casts = [
    'created_at' => 'datetime',
  ];
}
