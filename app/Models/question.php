<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Question extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'parent_id');
    }

    public function views(){
        return $this->hasMany(View::class,'question_id');
    }
    protected $table = "question";  // Ensure this matches your database table name
    protected $fillable = [
        'user_id',
        'title',
        'likes',
        'shares',
        'content',
        'photo'
    ];
}
