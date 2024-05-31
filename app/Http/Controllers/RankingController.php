<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;
use App\Models\Answer;
use App\Models\Comment;
use App\Models\View;

class RankingController extends Controller
{
    public function calculateScores() {
        $questions = Question::with('answers.comments', 'views')->get();

        $scores = [];
        foreach ($questions as $question) {
            $score = 0;
            $answeredUsers = [];
            $userCommentCounts = [];

            $score += $question->views->count();
            
            foreach ($question->answers as $answer) {
                if (!in_array($answer->user_id, $answeredUsers)) {
                    $score += 1; // Each unique user's answer gives 1 point per question
                    $answeredUsers[] = $answer->user_id;
                }

                foreach ($answer->comments as $comment) {
                    if (!isset($userCommentCounts[$comment->user_id])) {
                        $userCommentCounts[$comment->user_id] = 0;
                    }
                    if ($userCommentCounts[$comment->user_id] < 5) {
                        $score += 1; // Each comment scores 1 point, up to 5 per user per question
                        $userCommentCounts[$comment->user_id]++;
                    }
                }
            }

            $scores[$question->id] = $score;
        }

        arsort($scores); // Sort scores in descending order
        $topQuestionIds = array_slice(array_keys($scores), 0, 10); // Get top 10 question IDs
        
        // Fetch the top questions without sorting by their IDs
        $topQuestions = Question::whereIn('id', $topQuestionIds)->get()->keyBy('id');

        // Sort the questions by scores in descending order
        $sortedTopQuestions = collect($topQuestionIds)->map(function($id) use ($topQuestions) {
            return $topQuestions[$id];
        });

        // Get the titles of the sorted top questions
        $titles = $sortedTopQuestions->pluck('title');

        \Log::info($titles);    
        return response()->json($titles);
    }
}
