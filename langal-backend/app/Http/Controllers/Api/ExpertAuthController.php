<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Expert;
use App\Models\UserProfile;
use App\Models\ConsultationFeedback;
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
            $user->update(['updated_at' => now(), 'last_active_at' => now()]);

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
        try {
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
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Expert Verify OTP Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server Error: ' . $e->getMessage(),
            ], 500);
        }
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

            // Handle file uploads (Azure storage)
            $profilePhotoPath = null;
            $certificationPhotoPath = null;

            if ($request->hasFile('profilePhoto')) {
                $profilePhotoPath = $request->file('profilePhoto')->store('expert/profiles', 'azure');
            }

            if ($request->hasFile('certificationPhoto')) {
                $certificationPhotoPath = $request->file('certificationPhoto')->store('expert/certifications', 'azure');
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
            // Clear last_active_at when logging out
            $request->user()->update(['last_active_at' => null]);
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
     * Heartbeat - Update last active timestamp
     * POST /api/expert/heartbeat
     */
    public function heartbeat(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->update(['last_active_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'Heartbeat received',
                'data' => [
                    'last_active_at' => $user->last_active_at,
                    'is_online' => true,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Heartbeat failed',
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
                    // Delete old photo if exists (try Azure first, then local)
                    if ($userProfile->profile_photo_url) {
                        try {
                            \Illuminate\Support\Facades\Storage::disk('azure')->delete($userProfile->profile_photo_url);
                        } catch (\Exception $e) {
                            \Illuminate\Support\Facades\Storage::disk('public')->delete($userProfile->profile_photo_url);
                        }
                    }
                    $path = $request->file('profilePhoto')->store('expert/profiles', 'azure');
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
            $query = Expert::with('user.profile')
                ->whereHas('user', function ($q) {
                    $q->where('is_active', true);
                });

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

            // Filter by online status (active within last 5 minutes)
            if ($request->has('online_only') && $request->online_only) {
                $query->whereHas('user', function ($q) {
                    $q->where('last_active_at', '>=', now()->subMinutes(5));
                });
            }

            // Pagination
            $perPage = $request->input('per_page', 15);
            $experts = $query->paginate($perPage);

            // Transform data to include online status
            $transformedExperts = collect($experts->items())->map(function ($expert) {
                $isOnline = $expert->user->last_active_at && 
                           $expert->user->last_active_at->diffInMinutes(now()) < 5;
                
                // Get specialization in Bangla
                $specializationTranslations = [
                    'crop_disease' => 'ফসলের রোগ',
                    'pest_control' => 'কীটপতঙ্গ নিয়ন্ত্রণ',
                    'soil_science' => 'মাটি বিজ্ঞান',
                    'irrigation' => 'সেচ ব্যবস্থা',
                    'horticulture' => 'উদ্যানতত্ত্ব',
                    'livestock' => 'পশুপালন',
                    'fisheries' => 'মৎস্য চাষ',
                    'organic_farming' => 'জৈব চাষ',
                    'seed_production' => 'বীজ উৎপাদন',
                    'agricultural_economics' => 'কৃষি অর্থনীতি',
                ];
                
                return [
                    'expert_id' => $expert->expert_id,
                    'id' => $expert->expert_id,
                    'user_id' => $expert->user_id,
                    'specialization' => $expert->specialization,
                    'specialization_bn' => $specializationTranslations[$expert->specialization] ?? $expert->specialization,
                    'qualification' => $expert->qualification,
                    'institution' => $expert->institution,
                    'experience_years' => $expert->experience_years,
                    'consultation_fee' => $expert->consultation_fee,
                    'rating' => $expert->rating ?? 0,
                    'total_consultations' => $expert->total_consultations ?? 0,
                    'is_government_approved' => $expert->is_government_approved ?? false,
                    'is_online' => $isOnline,
                    'last_active_at' => $expert->user->last_active_at,
                    'user' => [
                        'id' => $expert->user->user_id,
                        'phone' => $expert->user->phone,
                        'profile' => $expert->user->profile ? [
                            'full_name' => $expert->user->profile->full_name,
                            'full_name_bn' => $expert->user->profile->full_name_bn ?? $expert->user->profile->full_name,
                            'profile_photo_url' => $expert->user->profile->profile_photo_url,
                            'avatar_url' => $expert->user->profile->profile_photo_url,
                        ] : null,
                    ],
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $transformedExperts,
                'pagination' => [
                    'current_page' => $experts->currentPage(),
                    'last_page' => $experts->lastPage(),
                    'per_page' => $experts->perPage(),
                    'total' => $experts->total(),
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
                ->with('user.profile')
                ->whereHas('user', function ($q) {
                    $q->where('is_active', true);
                })
                ->first();

            if (!$expert) {
                return response()->json([
                    'success' => false,
                    'message' => 'Expert not found',
                ], 404);
            }

            // Get feedback stats
            $feedbackStats = ConsultationFeedback::where('expert_id', $expert->user_id)
                ->selectRaw('AVG(overall_rating) as avg_rating, COUNT(*) as total_reviews')
                ->first();

            // Get recent reviews
            $recentReviews = ConsultationFeedback::with(['farmer.profile'])
                ->where('expert_id', $expert->user_id)
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($feedback) {
                    return [
                        'id' => $feedback->feedback_id,
                        'rating' => $feedback->overall_rating,
                        'comment' => $feedback->review_text ?? $feedback->review_text_bn,
                        'tags' => $feedback->tags,
                        'created_at' => $feedback->created_at,
                        'farmer' => $feedback->farmer?->profile ? [
                            'name' => $feedback->farmer->profile->full_name_bn ?? 
                                     $feedback->farmer->profile->full_name,
                            'avatar' => $feedback->farmer->profile->profile_photo_url,
                        ] : null,
                    ];
                });

            // Get specialization in Bangla
            $specializationTranslations = [
                'crop_disease' => 'ফসলের রোগ',
                'pest_control' => 'কীটপতঙ্গ নিয়ন্ত্রণ',
                'soil_science' => 'মাটি বিজ্ঞান',
                'irrigation' => 'সেচ ব্যবস্থা',
                'horticulture' => 'উদ্যানতত্ত্ব',
                'livestock' => 'পশুপালন',
                'fisheries' => 'মৎস্য চাষ',
                'organic_farming' => 'জৈব চাষ',
                'seed_production' => 'বীজ উৎপাদন',
                'agricultural_economics' => 'কৃষি অর্থনীতি',
            ];

            // Build qualifications array from qualification field
            $qualificationsArray = [];
            if ($expert->qualification) {
                $qualificationsArray[] = $expert->qualification;
            }
            if ($expert->institution) {
                $qualificationsArray[] = $expert->institution;
            }

            // Build expertise areas array
            $expertiseAreas = [];
            if ($expert->specialization) {
                $expertiseAreas[] = $specializationTranslations[$expert->specialization] ?? $expert->specialization;
            }

            // Generate bio from available data
            $bio = '';
            if ($expert->qualification && $expert->institution) {
                $bio = $expert->institution . ' থেকে ' . $expert->qualification . ' ডিগ্রি অর্জন করেছেন।';
            }
            if ($expert->experience_years) {
                $bio .= ' ' . $expert->experience_years . ' বছরের অভিজ্ঞতা আছে কৃষি ক্ষেত্রে।';
            }

            $data = [
                'id' => $expert->expert_id,
                'expert_id' => $expert->expert_id,
                'user_id' => $expert->user_id,
                'specialization' => $expert->specialization,
                'specialization_bn' => $specializationTranslations[$expert->specialization] ?? $expert->specialization,
                'bio' => $bio,
                'bio_bn' => $bio,
                'experience_years' => $expert->experience_years ?? 0,
                'consultation_fee' => $expert->consultation_fee ?? 0,
                'rating' => round($feedbackStats->avg_rating ?? 0, 1),
                'total_reviews' => $feedbackStats->total_reviews ?? 0,
                'is_available' => $expert->is_available ?? true,
                'is_government_approved' => $expert->is_government_approved ?? false,
                'response_time' => $expert->response_time ?? 'সাধারণত ১ ঘন্টার মধ্যে',
                'languages' => ['বাংলা'],
                'qualifications' => $qualificationsArray,
                'expertise_areas' => $expertiseAreas,
                'total_consultations' => $expert->total_consultations ?? 0,
                'recent_feedbacks' => $recentReviews,
                'user' => [
                    'id' => $expert->user->user_id,
                    'phone' => $expert->user->phone,
                    'profile' => $expert->user->profile ? [
                        'full_name' => $expert->user->profile->full_name,
                        'full_name_bn' => $expert->user->profile->full_name_bn ?? $expert->user->profile->full_name,
                        'profile_photo_url' => $expert->user->profile->profile_photo_url,
                        'avatar_url' => $expert->user->profile->profile_photo_url,
                    ] : null,
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve expert',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send OTP for Password Reset
     * POST /api/expert/forgot-password/send-otp
     */
    public function forgotPasswordSendOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|min:11|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $phone = $request->phone;

        // Check if expert exists
        $user = User::where('phone', $phone)->where('user_type', 'expert')->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'এই ফোন নম্বর দিয়ে কোনো বিশেষজ্ঞ অ্যাকাউন্ট পাওয়া যায়নি।',
            ], 404);
        }

        // Send OTP for password reset
        $result = $this->otpService->sendOtp($phone, 'password_reset');

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'পাসওয়ার্ড রিসেট করতে OTP পাঠানো হয়েছে',
            'data' => [
                'otp_id' => $result['otp_id'],
                'expires_in' => $result['expires_in'],
                'phone' => $phone,
                'otp_code' => $result['otp_code'] ?? null, // For dev mode
            ],
        ]);
    }

    /**
     * Verify OTP and Reset Password
     * POST /api/expert/forgot-password/reset
     */
    public function forgotPasswordReset(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|min:11|max:15',
            'otp_code' => 'required|string|size:6',
            'new_password' => 'required|string|min:6',
            'confirm_password' => 'required|string|same:new_password',
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
        $result = $this->otpService->verifyOtp($phone, $otpCode, 'password_reset');

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'] ?? 'OTP যাচাইকরণ ব্যর্থ হয়েছে',
            ], 400);
        }

        // Find user and update password
        $user = User::where('phone', $phone)->where('user_type', 'expert')->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'বিশেষজ্ঞ পাওয়া যায়নি',
            ], 404);
        }

        // Update password
        $user->password_hash = bcrypt($request->new_password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে। এখন লগইন করুন।',
        ]);
    }
}
