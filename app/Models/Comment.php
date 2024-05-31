<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;
    protected $table = "Comment";
    protected $fillable = [
        'user_id',
        'parent_id',
        'title',
        'likes',
        'content'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function answers(){
        return $this->belongsTo(Answer::class,'parent_id');
    }
   
}
