<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Predefined tasks
        $tasks = [
            [
                'title' => 'Prepare Breakfast',
                'description' => 'Plan and cook a nutritious breakfast for the family or yourself.',
            ],
            [
                'title' => 'Do Laundry',
                'description' => 'Sort, wash, dry, and fold a load of clothes.',
            ],
            [
                'title' => 'Grocery Shopping',
                'description' => 'Make a list and purchase necessary food items and household essentials.',
            ],
            [
                'title' => 'Tidy Up Living Area',
                'description' => 'Straighten up the common living spaces, put away items, and wipe surfaces.',
            ],
            [
                'title' => 'Plan Dinner',
                'description' => 'Decide on the evening meal and ensure all ingredients are available or prepared.',
            ],
        ];

        // Latest user
        $user = User::latest()->first();

        if (empty($user)) {
            $this->command->info('Cannot create tasks without any user');
            return;
        }

        // Task Creation
        foreach ($tasks as $task) {
            Task::create([
                'title' => $task['title'],
                'description' => $task['description'],
                'user_id' => $user->id
            ]);
        }
    }
}
