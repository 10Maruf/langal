<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class SendMessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'message_type' => 'required|in:text,image,audio,file,system',
            'content' => 'required_if:message_type,text|nullable|string|max:2000',
            'content_bn' => 'nullable|string|max:2000',
            'media' => 'required_if:message_type,image,audio,file|nullable|file|max:10240',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'message_type' => 'বার্তার ধরন',
            'content' => 'বার্তা',
            'media' => 'মিডিয়া ফাইল',
        ];
    }

    /**
     * Get the validation error messages.
     */
    public function messages(): array
    {
        return [
            'message_type.required' => 'বার্তার ধরন নির্বাচন করুন',
            'message_type.in' => 'সঠিক বার্তার ধরন নির্বাচন করুন',
            'content.required_if' => 'বার্তা লিখুন',
            'content.max' => 'বার্তা সর্বোচ্চ ২০০০ অক্ষর হতে পারে',
            'media.required_if' => 'মিডিয়া ফাইল দিন',
            'media.max' => 'ফাইল সর্বোচ্চ ১০ MB হতে পারে',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'message_bn' => 'তথ্য যাচাই ব্যর্থ',
            'errors' => $validator->errors(),
        ], 422));
    }
}
