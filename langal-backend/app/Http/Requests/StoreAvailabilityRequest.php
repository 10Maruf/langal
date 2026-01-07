<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreAvailabilityRequest extends FormRequest
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
            'schedules' => 'required|array|min:1',
            'schedules.*.day_of_week' => 'required|integer|min:0|max:6',
            'schedules.*.start_time' => 'required|date_format:H:i',
            'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
            'schedules.*.slot_duration_minutes' => 'nullable|integer|min:15|max:120',
            'schedules.*.max_appointments_per_slot' => 'nullable|integer|min:1|max:5',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'schedules' => 'সময়সূচী',
            'schedules.*.day_of_week' => 'সপ্তাহের দিন',
            'schedules.*.start_time' => 'শুরুর সময়',
            'schedules.*.end_time' => 'শেষের সময়',
            'schedules.*.slot_duration_minutes' => 'স্লটের সময়কাল',
            'schedules.*.max_appointments_per_slot' => 'প্রতি স্লটে সর্বোচ্চ অ্যাপয়েন্টমেন্ট',
        ];
    }

    /**
     * Get the validation error messages.
     */
    public function messages(): array
    {
        return [
            'schedules.required' => 'অন্তত একটি সময়সূচী যোগ করুন',
            'schedules.*.day_of_week.required' => 'সপ্তাহের দিন নির্বাচন করুন',
            'schedules.*.day_of_week.min' => 'সঠিক দিন নির্বাচন করুন',
            'schedules.*.day_of_week.max' => 'সঠিক দিন নির্বাচন করুন',
            'schedules.*.start_time.required' => 'শুরুর সময় দিন',
            'schedules.*.end_time.required' => 'শেষের সময় দিন',
            'schedules.*.end_time.after' => 'শেষের সময় শুরুর সময়ের পরে হতে হবে',
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
