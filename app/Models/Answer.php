<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;
    protected $table = "Answer";    
    protected $fillable = [
        'user_id',
        'parent_id',
        'likes',
        'content'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function question()
    {
        return $this->belongsTo(Question::class,'parent_id');
    }
    public function comments(){
        return $this->hasMany(Comment::class,'parent_id');
    }
    
    
}
