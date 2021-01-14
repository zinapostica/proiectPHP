<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;
    protected $table ='ratings';
    protected $fillable = array('userID', 'postID','valueID');
    public $timestamps = false;

  public function init($userID, $postID, $valueID){
    $this->userID = $userID;
    $this->postID = $postID;
    $this->valueID = $valueID;
  }
}
