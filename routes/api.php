<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Question;
use App\Models\Answer;
use App\Http\Controllers\Auth\LoginController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('Latest',[App\Http\Controllers\PageController::class,'latest']);

Route::get('Follow',[App\Http\Controllers\PageController::class,'follow']);

Route::get('Hot',[App\Http\Controllers\PageController::class,'hottest']);

Route::get('Answer',[App\Http\Controllers\PageController::class,'answer']);

Route::get('/question/{id}',[App\Http\Controllers\QuestionController::class,'questionContent'] );

Route::post('submitQuestions',[App\Http\Controllers\QuestionController::class, 'submitQuestions']);

Route::post('submitAnswer',[App\Http\Controllers\AnswerController::class, 'submitAnswer']);

Route::post('submitComment',[App\Http\Controllers\CommentController::class, 'submitComment']);

Route::post('like/{id}', [App\Http\Controllers\QuestionController::class, 'updateLike']);

Route::post('dislike/{id}', [App\Http\Controllers\QuestionController::class, 'updateDislike']);

Route::post('answerlike/{id}', [App\Http\Controllers\AnswerController::class, 'answerupdateLike']);

Route::post('commentlike/{id}', [App\Http\Controllers\CommentController::class, 'commentupdateLike']);

Route::get('topic', [App\Http\Controllers\RankingController::class, 'calculateScores']);

Route::post('view/{id}', [App\Http\Controllers\PageController::class, 'view']);

Route::get('title/{id}', [App\Http\Controllers\RankingController::class, 'title']);