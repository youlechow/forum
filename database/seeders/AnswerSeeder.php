<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Answer;
use App\Models\Question;
use App\Models\User;
use Faker\Factory as Faker;

class AnswerSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Assuming you have users in your users table
        $userIds = User::all()->pluck('id')->toArray();
        $parentIds = Question::all()->pluck('id')->toArray();

        foreach (range(1, 1000) as $index) {  // Adjust the range for the amount of data you need
            Answer::create([
                'user_id' => $faker->randomElement($userIds),
                'parent_id' => $faker->randomElement($parentIds),
                'likes' => $faker->numberBetween(0, 1000),
                'content' => $faker->paragraph,
            ]);
        }
    }
}
