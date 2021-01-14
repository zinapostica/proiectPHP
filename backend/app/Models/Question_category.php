<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question_category extends Model
{
    use HasFactory;
    protected $table ='question_categories';
    protected $fillable = array('categoryID', 'questionID');
    public $timestamps = false;
    function init($categoryID, $questionID) {
        $this->categoryID = $categoryID;
        $this->questionID = $questionID;
      }
}
