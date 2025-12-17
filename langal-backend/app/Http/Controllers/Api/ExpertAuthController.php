<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Expert;
use App\Models\UserProfile;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ExpertAuthController extends Controller
{
    protected $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * Login with Phone and Password
     * POST /api/expert/login
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|min:11|max:15',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Find user by phone and user_type
            $user = User::where('phone', $request->phone)
                ->where('user_type', 'expert')
                ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'No expert account found with this phone number.',
                ], 404);
            }

            // Check if user is active
            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account is inactive. Please contact support.',
                ], 403);
            }

            // Verify password
            if (!password_verify($request->password, $user->password_hash)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Incorrect password.',
                ], 401);
            }

            // Generate token
            $token = $user->createToken('expert-app', ['expert'])->plainTextToken;
            $user->update(['updated_at' => now()]);

            // Load relationships
            $userData = $user->load(['profile', 'expert'])->toArray();

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => $userData,
                    'token' => $token,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send OTP for Login/Registration
     */
    public function sendOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|min:11|max:15',
            'purpose' => 'nullable|in:login,register',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $phone = $request->phone;
        $purpose = $request->purpose ?? 'login';

        // Check if user exists
        $user = User::where('phone', $phone)->where('user_type', 'expert')->first();

        if ($purpose === 'login' && !$user) {
            return response()->json([
                'success' => false,
                'message' => 'No expert account found with this phone number. Please register first.',
            ], 404);
        }

        if ($purpose === 'register' && $user) {
            return response()->json([
                'success' => false,
                'message' => 'Account already exists with this phone number. Please login.',
            ], 409);
        }

        // Send OTP
        $result = $this->otpService->sendOtp($phone, $purpose);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
            'data' => [
                'otp_id' => $result['otp_id'],
                'expires_in' => $result['expires_in'],
                'phone' => $phone,
                'otp_code' => $result['otp_code'] ?? null, // For dev
            ],
        ]);
    }

    /**
     * Verify OTP and Login
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|min:11|max:15',
            'otp_code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $phone = $request->phone;
        $otpCode = $request->otp_code;

        // Verify OTP
        $result = $this->otpService->verifyOtp($phone, $otpCode, 'register');

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP verified successfully',
        ], 200);
    }

    /**
     * Register Expert
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|unique:users,phone',
            'password' => 'required|string|min:6',
            'fullName' => 'required|string|max:100',
            'nidNumber' => 'required|string|unique:user_profiles,nid_number|max:20',
            'dateOfBirth' => 'required|date',
            'fatherName' => 'required|string|max:100',
            'motherName' => 'required|string|max:100',
            'address' => 'required|string',
            'postalCode' => 'required|integer',
            'otp_code' => 'required|string|size:6',
            // Expert specific fields
            'qualification' => 'required|string|max:255',
            'specialization' => 'required|string|max:255',
            'experienceYears' => 'required|integer|min:0',
            'institution' => 'required|string|max:255',
            'consultationFee' => 'nullable|numeric|min:0',
            'licenseNumber' => 'nullable|string|max:100',
            'availability' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            // File uploads
            'profilePhoto' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'certificationPhoto' => 'required|mimes:jpeg,png,jpg,pdf|max:5120',
        ]);

        if ($validator->fails()) {
            \Log::error('Expert registration validation failed', [
                'errors' => $validator->errors(),
                'input' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Verify OTP
        $otpResult = $this->otpService->verifyOtp($request->phone, $request->otp_code, 'register');
        if (!$otpResult['success']) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP',
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Handle file uploads
            $profilePhotoPath = null;
            $certificationPhotoPath = null;

            if ($request->hasFile('profilePhoto')) {
                $profilePhotoPath = $request->file('profilePhoto')->store('expert/profiles', 'public');
            }

            if ($request->hasFile('certificationPhoto')) {
                $certificationPhotoPath = $request->file('certificationPhoto')->store('expert/certifications', 'public');
            }

            // Create user account
            $user = User::create([
                'phone' => $request->phone,
                'password_hash' => bcrypt($request->password),
                'user_type' => 'expert',
                'is_verified' => true,
                'is_active' => true,
            ]);

            // Create user profile
            UserProfile::create([
                'user_id' => $user->user_id,
                'full_name' => $request->fullName,
                'nid_number' => $request->nidNumber,
                'date_of_birth' => $request->dateOfBirth,
                'father_name' => $request->fatherName,
                'mother_name' => $request->motherName,
                'address' => $request->address ?? null,
                'village' => $request->village ?? null,
                'postal_code' => $request->postalCode ?? null,
                'verification_status' => 'pending',
                'profile_photo_url' => $profilePhotoPath,
            ]);

            // Create expert qualification profile
            Expert::create([
                'user_id' => $user->user_id,
                'qualification' => $request->qualification,
                'specialization' => $request->specialization,
                'experience_years' => $request->experienceYears,
                'institution' => $request->institution,
                'consultation_fee' => $request->consultationFee ?? 0,
                'license_number' => $request->licenseNumber ?? null,
                'availability' => $request->availability ?? null,
                'bio' => $request->bio ?? null,
                'certification_document' => $certificationPhotoPath,
                'rating' => 0.0,
                'total_consultations' => 0,
                'is_government_approved' => false,
            ]);

            DB::commit();

            // Generate token
            $token = $user->createToken('expert-app', ['expert'])->plainTextToken;

            $userData = $user->load(['profile', 'expert'])->toArray();

            return response()->json([
                'success' => true,
                'message' => 'Expert registration successful',
                'data' => [
                    'user' => $userData,
                    'token' => $token,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Resend OTP
     */
    public function resendOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|min:11|max:15',
            'purpose' => 'nullable|in:login,register',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $result = $this->otpService->sendOtp($request->phone, $request->purpose ?? 'login');

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP resent successfully',
            'data' => [
                'otp_id' => $result['otp_id'],
                'expires_in' => $result['expires_in'],
                'otp_code' => $result['otp_code'] ?? null,
            ],
        ]);
    }

    /**
     * Logout
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout successful',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Create Expert Profile
     * POST /api/expert/profile
     */
    public function createProfile(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'qualification' => 'required|string|max:100',
            'specialization' => 'required|string|max:100',
            'experience_years' => 'required|integer|min:0|max:255',
            'institution' => 'required|string|max:100',
            'consultation_fee' => 'nullable|numeric|min:0|max:9999.99',
            'is_government_approved' => 'nullable|boolean',
            'license_number' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Get authenticated user
            $user = Auth::user();

            // Check if user type is expert
            if ($user->user_type !== 'expert') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only expert users can create expert profile',
                ], 403);
            }

            // Check if expert profile already exists
            $existingExpert = Expert::where('user_id', $user->user_id)->first();
            if ($existingExpert) {
                return response()->json([
                    'success' => false,
                    'message' => 'Expert profile already exists. Use update endpoint to modify.',
                ], 409);
            }

            // Create expert profile
            $expertData = [
                'user_id' => $user->user_id,
                'qualification' => $request->qualification,
                'specialization' => $request->specialization,
                'experience_years' => $request->experience_years,
                'institution' => $request->institution,
                'consultation_fee' => $request->consultation_fee ?? null,
                'is_government_approved' => $request->is_government_approved ?? false,
                'license_number' => $request->license_number ?? null,
            ];

            $expert = Expert::create($expertData);

            DB::commit();

            // Load user profile for complete response
            $expert->load('user.userProfile');

            return response()->json([
                'success' => true,
                'message' => 'Expert profile created successfully',
                'data' => [
                    'expert' => $expert,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create expert profile',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update Expert Profile
     * PUT /api/expert/profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'qualification' => 'nullable|string|max:100',
            'specialization' => 'nullable|string|max:100',
            'experience_years' => 'nullable|integer|min:0|max:255',
            'institution' => 'nullable|string|max:100',
            'consultation_fee' => 'nullable|numeric|min:0|max:9999.99',
            'is_government_approved' => 'nullable|boolean',
            'license_number' => 'nullable|string|max:50',
            'name' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:100',
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
            'profilePhoto' => 'nullable|image|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Get authenticated user
            $user = Auth::user();

            // Check if user type is expert
            if ($user->user_type !== 'expert') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only expert users can update expert profile',
                ], 403);
            }

            // Update User Profile (Photo, Name, Address)
            $userProfile = $user->profile;
            if ($userProfile) {
                if ($request->hasFile('profilePhoto')) {
                    // Delete old photo if exists
                    if ($userProfile->profile_photo_url) {
                        \Illuminate\Support\Facades\Storage::disk('public')->delete($userProfile->profile_photo_url);
                    }
                    $path = $request->file('profilePhoto')->store('expert/profiles', 'public');
                    $userProfile->profile_photo_url = $path;
                }

                if ($request->has('name')) $userProfile->full_name = $request->name;
                if ($request->has('address')) $userProfile->address = $request->address;

                $userProfile->save();
            }

            // Update User table (Email, Phone)
            if ($request->has('email')) $user->email = $request->email;
            if ($request->has('phone')) $user->phone = $request->phone;
            $user->save();

            // Find expert profile
            $expert = Expert::where('user_id', $user->user_id)->first();
            if (!$expert) {
                return response()->json([
                    'success' => false,
                    'message' => 'Expert profile not found. Create profile first.',
                ], 404);
            }

            // Update only provided fields
            $updateData = array_filter([
                'qualification' => $request->qualification,
                'specialization' => $request->specialization,
                'experience_years' => $request->experience_years,
                'institution' => $request->institution,
                'consultation_fee' => $request->consultation_fee,
                'is_government_approved' => $request->is_government_approved,
                'license_number' => $request->license_number,
            ], function($value) {
                return $value !== null;
            });

            $expert->update($updateData);

            DB::commit();

            // Reload expert with relationships
            $expert->load('user.userProfile');

            return response()->json([
                'success' => true,
                'message' => 'Expert profile updated successfully',
                'data' => [
                    'expert' => $expert,
                    'user' => $expert->user, // Include user data with updated profile photo
                ],
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update expert profile',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get Expert Profile (Authenticated User)
     * GET /api/expert/profile
     */
    public function getProfile(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            if ($user->user_type !== 'expert') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only expert users can access expert profile',
                ], 403);
            }

            // Load expert with user and profile relationships
            $user->load(['profile', 'expert']);

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve expert profile',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get All Experts (Public)
     * GET /api/experts
     */
    public function getAllExperts(Request $request): JsonResponse
    {
        try {
            $query = Expert::with('user.userProfile');

            // Filter by specialization
            if ($request->has('specialization')) {
                $query->where('specialization', 'like', '%' . $request->specialization . '%');
            }

            // Filter by government approved
            if ($request->has('is_government_approved')) {
                $query->where('is_government_approved', $request->is_government_approved);
            }

            // Filter by minimum experience
            if ($request->has('min_experience')) {
                $query->where('experience_years', '>=', $request->min_experience);
            }

            // Filter by max consultation fee
            if ($request->has('max_fee')) {
                $query->where('consultation_fee', '<=', $request->max_fee);
            }

            // Pagination
            $perPage = $request->input('per_page', 15);
            $experts = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => [
                    'experts' => $experts->items(),
                    'pagination' => [
                        'current_page' => $experts->currentPage(),
                        'last_page' => $experts->lastPage(),
                        'per_page' => $experts->perPage(),
                        'total' => $experts->total(),
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve experts',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get Single Expert by ID (Public)
     * GET /api/experts/{expert_id}
     */
    public function getExpertById(Request $request, $expert_id): JsonResponse
    {
        try {
            $expert = Expert::where('expert_id', $expert_id)
                ->with('user.userProfile')
                ->first();

            if (!$expert) {
                return response()->json([
                    'success' => false,
                    'message' => 'Expert not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'expert' => $expert,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve expert',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
