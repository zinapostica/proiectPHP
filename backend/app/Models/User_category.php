<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User_category extends Model
{
    use HasFactory;
    protected $table ='user_categories';
    protected $fillable = array('userID', 'categoryID');
    public $timestamps = false;
   // protected $guarded = array('userID', 'id');

}
