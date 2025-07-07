<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    //
    use SoftDeletes, HasFactory;

    protected $fillable  = [
        'title',
        'description',
        'status',
        'user_id',
        'priority',
        'deadline'
    ];

    protected function casts(): array

    {
        return [

            'deadline' => 'date',

        ];
    }


    /**
     * Scope a query to only select the task belong to user if no user provided selects all tasks
     */

    #[Scope]
    protected function byUser(Builder $query, ?User $user): void
    {
        if ($user) {
            $query->where('user_id', $user->id);
        }
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
