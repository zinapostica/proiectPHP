<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $table = 'categories';
    protected $fillable = array('categoryName');
    public $timestamps = false;
    function init($categoryName)
    {
        $this->categoryName = $categoryName;
    }
}
