<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Answer;

class AnswerController extends Controller
{
    public function submitAnswer(Request $request)
    {
        $validatedData = $request->validate([
            'parent_id' => 'required|integer',
            'content' => 'required|string',
        ]);

        try {
            $addAnswer = Answer::create([
                'user_id' => random_int(1, 2), // Replace with actual user ID logic
                'parent_id' => $validatedData['parent_id'], // Changed to question_id
                'likes' => 0,
                'content' => $validatedData['content'],
            ]);

            \Log::info('Answer created with ID: ' . $addAnswer->id);

            return response()->json(['message' => 'Answer submitted successfully!'], 201);
        } catch (\Exception $e) {
            \Log::error('Failed to submit answer: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to submit answer', 'error' => $e->getMessage()], 500);
        }
    }

    public function answerUpdateLike(Request $request, $id)
    {
        $item = Answer::find($id);

        if ($request->like) {
            $item->likes += 1;
        } else {
            $item->likes -= 1;
        }

        $item->save();

        return response()->json(['message' => 'Like updated successfully']);
    }
}
