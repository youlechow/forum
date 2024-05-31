<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class user_follow extends Model
{
    use HasFactory;
    protected $table = "User_follow";
    protected $fillable = [
        'follow_userID'
    ];

    public function follow_by(){
        return $this->belongsTo(User::class,'user_id');
    }

    public function follow_user(){
        return $this->hasMany(User::class,'follow_userID');
    }
}
