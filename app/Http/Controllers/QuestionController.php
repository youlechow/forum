<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;

class QuestionController extends Controller
{
    public function submitQuestions(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'photo' => 'nullable|file|mimes:jpg,jpeg,png'
        ]);

        try {
            $addQuestion = Question::create([
                'user_id' => 1,  // Make sure user_id 1 exists in your users table
                'title' => $validatedData['title'],
                'content' => $validatedData['content']
            ]);


            if ($request->hasFile('photo')) {
                $addQuestion->addMediaFromRequest('photo')->toMediaCollection('photo');
            }

            return response()->json(['message' => 'Question submitted successfully!'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to submit question', 'error' => $e->getMessage()], 500);
        }
    }

    public function questionContent($id)
    {
        $question = Question::with('user', 'answers.user', 'answers.comments.user')->find($id);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $mediaItems = $question->getMedia('photo');
        $photoUrls = $mediaItems->map(function ($media) {
            return $media->getUrl();  // Ensure this generates the correct URL
        });

        $question->photo_urls = $photoUrls; // Add photo URLs to the question
        
        return response()->json($question);
    }


    public function updateLike(Request $request, $id)
    {
        $item = Question::find($id);

        if ($request->like) {
            $item->likes += 1;
        } else {
            $item->likes -= 1;
        }

        $item->save();

        return response()->json(['message' => 'Like updated successfully']);
    }

    public function updateDislike(Request $request, $id)
    {
        $item = Question::find($id);

        if ($request->dislike) {
            $item->dislikes += 1;
        } else {
            $item->dislikes -= 1;
        }

        $item->save();

        return response()->json(['message' => 'Dislike updated successfully']);
    }
}
