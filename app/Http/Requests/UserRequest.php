<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
    $userParam = $this->route('user');
    $userId = is_object($userParam) ? $userParam->id : $userParam;
    Log::info('UserRequest $userId for email unique rule: ' . var_export($userId, true));

    return [
        'name'          => ['required', 'string', 'max:255'],
        'email'         => [
            'required',
            'email',
            Rule::unique('users', 'email')->ignore($userId),
        ],
        'password'      => [
            $this->isMethod('post') ? 'required' : 'nullable',
            'string',
            'min:8',
             'confirmed',               // if using password + password_confirmation
        ],
        'confirm_password' => [
            $this->isMethod('post') ? 'required' : 'nullable',
            'string',
            'min:8',
            'same:password',
        ],
        'roles'         => 'required',
    ];
}
}
