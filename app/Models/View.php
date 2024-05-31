<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class View extends Model
{
    use HasFactory;
    protected $table = 'View';
    protected $fillable = [
        'user_id',
        'question_id'
    ];

    public function user()
    {
        return $this->belongTo(User::class);
    }

    public function questions()
    {
        return $this->belongTo(Question::class,'question_id');
    }
}
