<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        $rules = [
            'title' => ['required', 'string', 'max:50'],
            'description' => ['required', 'string'],
            'deadline' => ['required', 'date', 'after_or_equal:today'],
            'priority' => ['required', 'string', 'in:high,normal,low'],
        ];

        // conditionally add new rule
        if ($this->method() === 'PUT') {
            $rules['status'] = ['required', 'string', 'in:pending,completed'];

        }

        return $rules;
    }
}
