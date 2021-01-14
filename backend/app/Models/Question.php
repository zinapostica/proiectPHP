<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
  use HasFactory;
  protected $table = 'questions';
  protected $fillable = array('body', 'userID');
  function init($userID, $body)
  {
    $this->userID = $userID;
    $this->body = $body;
  }
  protected $casts = [
    'created_at' => 'datetime',
  ];
}
