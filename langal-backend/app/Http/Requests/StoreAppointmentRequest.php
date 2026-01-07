<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreAppointmentRequest extends FormRequest
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
            'expert_id' => 'required|integer|exists:users,user_id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'consultation_type' => 'required|in:audio_call,video_call,chat',
            'problem_description' => 'nullable|string|max:1000',
            'problem_description_bn' => 'nullable|string|max:1000',
            'crop_type' => 'nullable|string|max:100',
            'urgency_level' => 'nullable|integer|min:1|max:3',
            'farmer_notes' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'expert_id' => 'বিশেষজ্ঞ',
            'appointment_date' => 'তারিখ',
            'start_time' => 'সময়',
            'consultation_type' => 'পরামর্শের ধরন',
            'problem_description' => 'সমস্যার বিবরণ',
            'crop_type' => 'ফসলের ধরন',
            'urgency_level' => 'জরুরিতার মাত্রা',
        ];
    }

    /**
     * Get the validation error messages.
     */
    public function messages(): array
    {
        return [
            'expert_id.required' => 'বিশেষজ্ঞ নির্বাচন করুন',
            'expert_id.exists' => 'বৈধ বিশেষজ্ঞ নির্বাচন করুন',
            'appointment_date.required' => 'তারিখ নির্বাচন করুন',
            'appointment_date.after_or_equal' => 'তারিখ আজ বা ভবিষ্যতে হতে হবে',
            'start_time.required' => 'সময় নির্বাচন করুন',
            'consultation_type.required' => 'পরামর্শের ধরন নির্বাচন করুন',
            'consultation_type.in' => 'সঠিক পরামর্শের ধরন নির্বাচন করুন',
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
