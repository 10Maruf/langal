<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConsultationAppointment;
use App\Models\ConsultationPrescription;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PrescriptionController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Create prescription for an appointment
     * POST /api/appointments/{id}/prescription
     */
    public function store(Request $request, int $appointmentId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = Auth::user();

            $appointment = ConsultationAppointment::findOrFail($appointmentId);

            // Only expert can create prescription
            if ($user->user_id !== $appointment->expert_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only the expert can create prescription',
                ], 403);
            }

            // Check if prescription already exists
            $existingPrescription = ConsultationPrescription::where('appointment_id', $appointmentId)->first();
            if ($existingPrescription) {
                return response()->json([
                    'success' => false,
                    'message' => 'Prescription already exists for this appointment',
                    'message_bn' => 'এই পরামর্শের জন্য ইতিমধ্যে প্রেসক্রিপশন আছে',
                ], 400);
            }

            // Handle file attachments
            $attachmentUrls = [];
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $extension = $file->getClientOriginalExtension();
                    $filename = 'prescriptions/' . Str::uuid() . '.' . $extension;

                    try {
                        Storage::disk('azure')->put($filename, file_get_contents($file));
                        $attachmentUrls[] = $filename;
                    } catch (\Exception $e) {
                        Storage::disk('public')->put($filename, file_get_contents($file));
                        $attachmentUrls[] = $filename;
                    }
                }
            }

            $prescription = ConsultationPrescription::create([
                'appointment_id' => $appointmentId,
                'expert_id' => $user->user_id,
                'farmer_id' => $appointment->farmer_id,
                'diagnosis' => $request->diagnosis,
                'diagnosis_bn' => $request->diagnosis_bn,
                'prescription_details' => $request->prescription_details,
                'prescription_details_bn' => $request->prescription_details_bn,
                'medications' => $request->medications ? json_encode($request->medications) : null,
                'preventive_measures' => $request->preventive_measures,
                'preventive_measures_bn' => $request->preventive_measures_bn,
                'follow_up_required' => $request->follow_up_required ?? false,
                'follow_up_date' => $request->follow_up_date,
                'follow_up_notes' => $request->follow_up_notes,
                'attachments' => !empty($attachmentUrls) ? json_encode($attachmentUrls) : null,
            ]);

            // Send notification to farmer
            $this->notificationService->sendToUser(
                $appointment->farmer_id,
                'নতুন প্রেসক্রিপশন',
                'বিশেষজ্ঞ আপনার জন্য প্রেসক্রিপশন লিখেছেন',
                [
                    'type' => 'new_prescription',
                    'prescription_id' => $prescription->prescription_id,
                    'appointment_id' => $appointmentId,
                ]
            );

            $prescription->load(['expert.profile', 'farmer.profile']);

            return response()->json([
                'success' => true,
                'message' => 'Prescription created successfully',
                'message_bn' => 'প্রেসক্রিপশন সফলভাবে তৈরি হয়েছে',
                'data' => $prescription,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create prescription',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get prescription details
     * GET /api/prescriptions/{id}
     */
    public function show(int $id): JsonResponse
    {
        try {
            $user = Auth::user();

            $prescription = ConsultationPrescription::with([
                'expert.profile',
                'farmer.profile',
                'appointment',
            ])->findOrFail($id);

            // Check access
            if ($user->user_id !== $prescription->farmer_id && $user->user_id !== $prescription->expert_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $prescription,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Prescription not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Update prescription
     * PUT /api/prescriptions/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'diagnosis' => 'nullable|string|max:1000',
            'diagnosis_bn' => 'nullable|string|max:1000',
            'prescription_details' => 'nullable|string|max:2000',
            'prescription_details_bn' => 'nullable|string|max:2000',
            'medications' => 'nullable|array',
            'preventive_measures' => 'nullable|string|max:1000',
            'preventive_measures_bn' => 'nullable|string|max:1000',
            'follow_up_required' => 'nullable|boolean',
            'follow_up_date' => 'nullable|date|after:today',
            'follow_up_notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = Auth::user();

            $prescription = ConsultationPrescription::findOrFail($id);

            // Only expert can update
            if ($user->user_id !== $prescription->expert_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only the expert can update prescription',
                ], 403);
            }

            $updateData = $request->only([
                'diagnosis', 'diagnosis_bn',
                'prescription_details', 'prescription_details_bn',
                'preventive_measures', 'preventive_measures_bn',
                'follow_up_required', 'follow_up_date', 'follow_up_notes',
            ]);

            if ($request->has('medications')) {
                $updateData['medications'] = json_encode($request->medications);
            }

            $prescription->update($updateData);

            // Notify farmer about update
            $this->notificationService->sendToUser(
                $prescription->farmer_id,
                'প্রেসক্রিপশন আপডেট',
                'আপনার প্রেসক্রিপশন আপডেট করা হয়েছে',
                [
                    'type' => 'prescription_updated',
                    'prescription_id' => $prescription->prescription_id,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Prescription updated successfully',
                'message_bn' => 'প্রেসক্রিপশন আপডেট হয়েছে',
                'data' => $prescription->fresh()->load(['expert.profile', 'farmer.profile']),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update prescription',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all prescriptions for a user
     * GET /api/prescriptions
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $perPage = $request->query('per_page', 10);

            $query = ConsultationPrescription::with(['expert.profile', 'farmer.profile', 'appointment'])
                ->orderBy('created_at', 'desc');

            if ($user->user_type === 'farmer') {
                $query->where('farmer_id', $user->user_id);
            } else {
                $query->where('expert_id', $user->user_id);
            }

            $prescriptions = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $prescriptions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch prescriptions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Download prescription as PDF (placeholder)
     * GET /api/prescriptions/{id}/download
     */
    public function download(int $id): JsonResponse
    {
        try {
            $user = Auth::user();

            $prescription = ConsultationPrescription::with([
                'expert.profile',
                'farmer.profile',
                'appointment',
            ])->findOrFail($id);

            // Check access
            if ($user->user_id !== $prescription->farmer_id && $user->user_id !== $prescription->expert_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access',
                ], 403);
            }

            // TODO: Generate PDF and return download URL
            // For now, return the prescription data

            return response()->json([
                'success' => true,
                'message' => 'PDF generation not implemented yet',
                'data' => $prescription,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to download prescription',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
