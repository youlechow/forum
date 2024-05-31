<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    public function submitComment(Request $request)
    {
        $validatedData = $request->validate([
            'parent_id' => 'required|integer',
            'content' => 'required|string',
        ]);

        try {
            $addAnswer = Comment::create([
                'user_id' => random_int(1, 2), // Replace with actual user ID logic
                'parent_id' => $validatedData['parent_id'], // Changed to question_id
                'likes' => 0,
                'content' => $validatedData['content'],
            ]);

            \Log::info('Comment created with ID: ' . $addAnswer->id);

            return response()->json(['message' => 'Comment submitted successfully!'], 201);
        } catch (\Exception $e) {
            \Log::error('Failed to submit answer: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to submit comment', 'error' => $e->getMessage()], 500);
        }
    }

    public function commentUpdateLike(Request $request, $id)
    {
        $item = Comment::find($id);

        if ($request->like) {
            $item->likes += 1;
        } else {
            $item->likes -= 1;
        }

        $item->save();

        return response()->json(['message' => 'Like updated successfully']);
    }
}
