<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorePrescriptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->user_type === 'expert';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'diagnosis' => 'required|string|max:1000',
            'diagnosis_bn' => 'nullable|string|max:1000',
            'prescription_details' => 'required|string|max:2000',
            'prescription_details_bn' => 'nullable|string|max:2000',
            'medications' => 'nullable|array',
            'medications.*.name' => 'required|string|max:200',
            'medications.*.name_bn' => 'nullable|string|max:200',
            'medications.*.dosage' => 'nullable|string|max:200',
            'medications.*.frequency' => 'nullable|string|max:200',
            'medications.*.duration' => 'nullable|string|max:200',
            'medications.*.instructions' => 'nullable|string|max:500',
            'preventive_measures' => 'nullable|string|max:1000',
            'preventive_measures_bn' => 'nullable|string|max:1000',
            'follow_up_required' => 'nullable|boolean',
            'follow_up_date' => 'nullable|date|after:today',
            'follow_up_notes' => 'nullable|string|max:500',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:5120',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'diagnosis' => 'রোগ নির্ণয়',
            'prescription_details' => 'চিকিৎসা বিবরণ',
            'medications' => 'ওষুধ',
            'medications.*.name' => 'ওষুধের নাম',
            'preventive_measures' => 'প্রতিরোধমূলক ব্যবস্থা',
            'follow_up_date' => 'ফলোআপ তারিখ',
        ];
    }

    /**
     * Get the validation error messages.
     */
    public function messages(): array
    {
        return [
            'diagnosis.required' => 'রোগ নির্ণয় লিখুন',
            'prescription_details.required' => 'চিকিৎসা বিবরণ লিখুন',
            'medications.*.name.required' => 'ওষুধের নাম দিন',
            'follow_up_date.after' => 'ফলোআপ তারিখ আজকের পরে হতে হবে',
            'attachments.*.max' => 'ফাইল সর্বোচ্চ ৫ MB হতে পারে',
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
