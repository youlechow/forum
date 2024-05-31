<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;
use App\Models\User;
use Faker\Factory as Faker;

class QuestionSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Assuming you have users in your users table
        $userIds = User::all()->pluck('id')->toArray();

        foreach (range(1, 1000) as $index) {  // Adjust the range for the amount of data you need
            Question::create([
                'user_id' => $faker->randomElement($userIds),
                'title' => $faker->sentence,
                'likes' => $faker->numberBetween(0, 1000),
                'dislikes' => $faker->numberBetween(0, 1000),
                'shares' => $faker->numberBetween(0, 1000),
                'contents' => $faker->paragraph,
            ]);
        }
    }
}
