<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;
use App\Models\Answer;
use App\Models\User_Follow; // Assuming this is the correct model name
use App\Models\View;

class PageController extends Controller
{
    public function latest(Request $request)
    {
        $perPage = 5;
        $page = $request->query('page', 1);
        $page = (int) $page;
        
        $questions = Question::with('user')->latest()->paginate($perPage, ['*'], 'page', $page);
        $questions->getCollection()->transform(function ($question) {
            $mediaItems = $question->getMedia('photo');
            $photoUrls = $mediaItems->map(function ($media) {
                return $media->getUrl();
            });

            $question->photo_urls = $photoUrls; // Add photo URLs to the question
            return $question;
        });

        return response()->json($questions);
    }

    public function hottest(Request $request)
    {
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
        $topQuestionIds = array_keys($scores); // Get top 10 question IDs
        
        // Fetch the top questions without sorting by their IDs
        $topQuestions = Question::with('user')->whereIn('id', $topQuestionIds)->get()->keyBy('id');

        // Sort the questions by scores in descending order
        $sortedTopQuestions = collect($topQuestionIds)->map(function($id) use ($topQuestions) {
            return $topQuestions[$id];
        });

        $perPage = 5;
        $page = $request->query('page', 1);
        $page = (int) $page;

        $paginatedQuestions = $sortedTopQuestions->forPage($page, $perPage)->values();

    // Add photo URLs to the questions
    $paginatedQuestions->transform(function ($question) {
        $mediaItems = $question->getMedia('photo');
        $photoUrls = $mediaItems->map(function ($media) {
            return $media->getUrl();
        });

        $question->photo_urls = $photoUrls; // Add photo URLs to the question
        return $question;
    });

    // Create a length-aware paginator
    $paginatedResponse = new \Illuminate\Pagination\LengthAwarePaginator(
        $paginatedQuestions,
        count($topQuestionIds),
        $perPage,
        $page,
        ['path' => $request->url(), 'query' => $request->query()]
    );

    return response()->json($paginatedResponse);
    }

    public function follow(Request $request)
    {
        $userId = 2; // The ID of the user you want to check for followed users
        $perPage = 5;
        $page = $request->query('page', 1);
        $page = (int) $page;
        
        // Get the IDs of users followed by the specified user
        $followedUserIds = User_Follow::where('user_id', $userId)->pluck('follow_userID');

        // Get the questions posted by the followed users
        $questions = Question::with('user')
            ->whereIn('user_id', $followedUserIds)
            ->paginate($perPage, ['*'], 'page', $page);

        // Map the questions to include photo URLs
        $questions->getCollection()->transform(function ($question) {
            $mediaItems = $question->getMedia('photo');
            $photoUrls = $mediaItems->map(function ($media) {
                return $media->getUrl();
            });

            $question->photo_urls = $photoUrls; // Add photo URLs to the question
            return $question;
        });

        return response()->json($questions);
    }

    public function answer(Request $request)
    {
        $userId = 2; // The ID of the user you want to check for answered questions
        $perPage = 5;
        $page = $request->query('page', 1);
        $page = (int) $page;

        // Get the answers made by the specified user
        $userAnswers = Answer::where('user_id', $userId)->pluck('parent_id');

        // Fetch the questions using the unique question IDs
        $questions = Question::with('user')
            ->whereIn('id', $userAnswers)
            ->paginate($perPage, ['*'], 'page', $page);

        // Map the questions to include photo URLs
        $questions->getCollection()->transform(function ($question) {
            $mediaItems = $question->getMedia('photo');
            $photoUrls = $mediaItems->map(function ($media) {
                return $media->getUrl();
            });

            $question->photo_urls = $photoUrls; // Add photo URLs to the question
            return $question;
        });

        return response()->json($questions);
    }

    public function view(Request $request, $id) {
        $userId = 2;
        $questionId = $id;
    
        if (View::where('user_id',$userId)->where('question_id',$questionId)->exists()) {
            return response()->json(['message' => 'User already viewed'], 200);
        } else {
            View::create([
                'user_id' => $userId,
                'question_id' => $questionId
            ]);
            return response()->json(['message' => 'View recorded successfully'], 201);
        }
    }
    
    
}
