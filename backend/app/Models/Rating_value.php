<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating_value extends Model
{
    use HasFactory;
    protected $table ='rating_values';
    protected $fillable = array('value', "id");
    public $timestamps = false;

}
