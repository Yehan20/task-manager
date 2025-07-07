<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'priority' => $this->priority,
            'user' => $this->whenLoaded('user'),
            'deadline' => Carbon::parse($this->deadline)->toDateString(),
            'completed_at'=> $this->completed_at ? $this->completed_at: null,
            'created_at' => Carbon::parse($this->created_at)->toDateString(),
            'updated_at' => Carbon::parse($this->updated_at)->toDateString()
        ];
    }
}
