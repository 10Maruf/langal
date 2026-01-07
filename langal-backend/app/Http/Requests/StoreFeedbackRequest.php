<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreFeedbackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->user_type === 'farmer';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'overall_rating' => 'required|integer|min:1|max:5',
            'communication_rating' => 'nullable|integer|min:1|max:5',
            'knowledge_rating' => 'nullable|integer|min:1|max:5',
            'helpfulness_rating' => 'nullable|integer|min:1|max:5',
            'review_text' => 'nullable|string|max:1000',
            'review_text_bn' => 'nullable|string|max:1000',
            'is_anonymous' => 'nullable|boolean',
            'would_recommend' => 'nullable|boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'overall_rating' => 'সামগ্রিক রেটিং',
            'communication_rating' => 'যোগাযোগ রেটিং',
            'knowledge_rating' => 'জ্ঞান রেটিং',
            'helpfulness_rating' => 'সহায়কতা রেটিং',
            'review_text' => 'রিভিউ',
        ];
    }

    /**
     * Get the validation error messages.
     */
    public function messages(): array
    {
        return [
            'overall_rating.required' => 'রেটিং দিন',
            'overall_rating.min' => 'রেটিং ১ থেকে ৫ এর মধ্যে হতে হবে',
            'overall_rating.max' => 'রেটিং ১ থেকে ৫ এর মধ্যে হতে হবে',
            'review_text.max' => 'রিভিউ সর্বোচ্চ ১০০০ অক্ষর হতে পারে',
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
