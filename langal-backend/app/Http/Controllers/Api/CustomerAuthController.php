<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\CustomerBusinessDetail;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CustomerAuthController extends Controller
{
    protected $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * Get available business types for dropdown
     */
    public function getBusinessTypes(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => CustomerBusinessDetail::getBusinessTypesForDropdown(),
        ]);
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
        $user = User::where('phone', $phone)->where('user_type', 'customer')->first();

        if ($purpose === 'login' && !$user) {
            return response()->json([
                'success' => false,
                'message' => 'এই ফোন নম্বর দিয়ে কোনো ব্যবসায়ী অ্যাকাউন্ট পাওয়া যায়নি। প্রথমে নিবন্ধন করুন।',
            ], 404);
        }

        if ($purpose === 'register' && $user) {
            return response()->json([
                'success' => false,
                'message' => 'এই ফোন নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে। অনুগ্রহ করে লগইন করুন।',
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
                'otp_code' => $result['otp_code'] ?? null, // For dev mode
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
        $result = $this->otpService->verifyOtp($phone, $otpCode, 'login');

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        $user = User::where('phone', $phone)->where('user_type', 'customer')->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'ব্যবহারকারী পাওয়া যায়নি',
            ], 404);
        }

        // Generate token
        $token = $user->createToken('customer-app', ['customer'])->plainTextToken;
        $user->update(['updated_at' => now()]);

        $userData = $user->load(['profile', 'customerBusiness'])->toArray();

        // Add full location info from location table based on postal_code
        if ($user->profile && $user->profile->postal_code) {
            $location = DB::table('location')
                ->where('postal_code', $user->profile->postal_code)
                ->first();

            if ($location) {
                $userData['location_info'] = [
                    'village' => $user->profile->village ?? null,
                    'postal_code' => $user->profile->postal_code,
                    'post_office_bn' => $location->post_office_bn ?? null,
                    'upazila_bn' => $location->upazila_bn ?? null,
                    'district_bn' => $location->district_bn ?? null,
                    'division_bn' => $location->division_bn ?? null,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'লগইন সফল হয়েছে',
            'data' => [
                'user' => $userData,
                'token' => $token,
            ],
        ]);
    }

    /**
     * Login with password (alternative to OTP)
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|min:11|max:15',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('phone', $request->phone)
            ->where('user_type', 'customer')
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'এই ফোন নম্বর দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি',
            ], 404);
        }

        if (!Hash::check($request->password, $user->password_hash)) {
            return response()->json([
                'success' => false,
                'message' => 'পাসওয়ার্ড ভুল হয়েছে',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে',
            ], 403);
        }

        // Generate token
        $token = $user->createToken('customer-app', ['customer'])->plainTextToken;
        $user->update(['updated_at' => now()]);

        $userData = $user->load(['profile', 'customerBusiness'])->toArray();

        // Add full location info
        if ($user->profile && $user->profile->postal_code) {
            $location = DB::table('location')
                ->where('postal_code', $user->profile->postal_code)
                ->first();

            if ($location) {
                $userData['location_info'] = [
                    'village' => $user->profile->village ?? null,
                    'postal_code' => $user->profile->postal_code,
                    'post_office_bn' => $location->post_office_bn ?? null,
                    'upazila_bn' => $location->upazila_bn ?? null,
                    'district_bn' => $location->district_bn ?? null,
                    'division_bn' => $location->division_bn ?? null,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'লগইন সফল হয়েছে',
            'data' => [
                'user' => $userData,
                'token' => $token,
            ],
        ]);
    }

    /**
     * Register Customer
     */
    public function register(Request $request): JsonResponse
    {
        Log::info('Customer registration request received', [
            'phone' => $request->phone,
            'hasFiles' => array_keys($request->allFiles()),
        ]);

        $validator = Validator::make($request->all(), [
            // User fields
            'phone' => 'required|string|min:11|max:15|unique:users,phone',
            'password' => 'required|string|min:6',

            // Profile fields
            'fullName' => 'required|string|max:100',
            'fatherName' => 'required|string|max:100',
            'motherName' => 'required|string|max:100',
            'dateOfBirth' => 'required|date|before:today',
            'nidNumber' => 'required|string|max:17|unique:user_profiles,nid_number',

            // Location fields
            'postal_code' => 'nullable|integer',
            'village' => 'nullable|string|max:100',

            // Business fields
            'businessName' => 'required|string|max:100',
            'businessType' => 'required|string',
            'customBusinessType' => 'nullable|string|max:100',
            'tradeLicenseNumber' => 'nullable|string|max:30',
            'establishedYear' => 'nullable|integer|min:1900|max:' . date('Y'),

            // Files
            'profilePhoto' => 'nullable|image|max:5120', // 5MB max
            'nidPhoto' => 'nullable|image|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Validate business type
        $businessType = $request->businessType;
        if ($businessType !== 'other' && !CustomerBusinessDetail::isValidBusinessType($businessType)) {
            return response()->json([
                'success' => false,
                'message' => 'অবৈধ ব্যবসার ধরণ',
                'errors' => ['businessType' => ['সঠিক ব্যবসার ধরণ নির্বাচন করুন']],
            ], 422);
        }

        // If business type is 'other', custom type is required
        if ($businessType === 'other' && empty($request->customBusinessType)) {
            return response()->json([
                'success' => false,
                'message' => 'অন্যান্য নির্বাচন করলে ব্যবসার ধরণ লিখতে হবে',
                'errors' => ['customBusinessType' => ['ব্যবসার ধরণ লিখুন']],
            ], 422);
        }

        // Verify OTP if provided
        if ($request->has('otp_code') && $request->otp_code) {
            $otpResult = $this->otpService->verifyOtp($request->phone, $request->otp_code, 'register');
            if (!$otpResult['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'OTP যাচাইকরণ ব্যর্থ হয়েছে',
                ], 400);
            }
        }

        DB::beginTransaction();
        try {
            // Create User
            $user = User::create([
                'phone' => $request->phone,
                'user_type' => 'customer',
                'password_hash' => Hash::make($request->password),
                'is_verified' => true,
                'is_active' => true,
            ]);

            // Handle Profile Photo Upload
            $profilePhotoPath = null;
            if ($request->hasFile('profilePhoto')) {
                $profilePhotoPath = $request->file('profilePhoto')->store('profile_photos/customers', 'public');
                Log::info('Customer profile photo uploaded', ['path' => $profilePhotoPath]);
            }

            // Handle NID Photo Upload
            $nidPhotoPath = null;
            if ($request->hasFile('nidPhoto')) {
                $nidPhotoPath = $request->file('nidPhoto')->store('nid_photos/customers', 'public');
                Log::info('Customer NID photo uploaded', ['path' => $nidPhotoPath]);
            }

            // Get location details and format address
            $village = $request->village ?? null;
            $postalCode = $request->postal_code ?? null;
            $address = $request->address ?? null;

            // If postal_code provided, fetch location data and format address
            if ($postalCode && empty($address)) {
                $locationData = DB::table('location')->where('postal_code', $postalCode)->first();
                if ($locationData) {
                    $addressParts = [];
                    if ($village) $addressParts[] = "গ্রাম: " . $village;
                    if ($locationData->post_office_bn) $addressParts[] = "ডাকঘর: " . $locationData->post_office_bn;
                    if ($locationData->upazila_bn) $addressParts[] = "উপজেলা: " . $locationData->upazila_bn;
                    if ($locationData->district_bn) $addressParts[] = "জেলা: " . $locationData->district_bn;
                    if ($locationData->division_bn) $addressParts[] = "বিভাগ: " . $locationData->division_bn;
                    $address = implode(', ', $addressParts);
                }
            }

            // Create UserProfile
            UserProfile::create([
                'user_id' => $user->user_id,
                'full_name' => $request->fullName,
                'father_name' => $request->fatherName,
                'mother_name' => $request->motherName,
                'date_of_birth' => $request->dateOfBirth,
                'nid_number' => $request->nidNumber,
                'address' => $address,
                'village' => $village,
                'postal_code' => $postalCode,
                'profile_photo_url' => $profilePhotoPath,
                'nid_photo_url' => $nidPhotoPath,
                'verification_status' => 'pending', // Customer needs verification
            ]);

            // Format business address from location
            $businessAddress = $address;
            if (empty($businessAddress) && $postalCode) {
                $locationData = DB::table('location')->where('postal_code', $postalCode)->first();
                if ($locationData) {
                    $businessAddress = implode(', ', array_filter([
                        $locationData->upazila_bn ?? null,
                        $locationData->district_bn ?? null,
                        $locationData->division_bn ?? null,
                    ]));
                }
            }

            // Create CustomerBusinessDetail
            CustomerBusinessDetail::create([
                'user_id' => $user->user_id,
                'business_name' => $request->businessName,
                'business_type' => $businessType,
                'custom_business_type' => $businessType === 'other' ? $request->customBusinessType : null,
                'trade_license_number' => $request->tradeLicenseNumber,
                'business_address' => $businessAddress,
                'established_year' => $request->establishedYear,
            ]);

            DB::commit();

            // Generate token
            $token = $user->createToken('customer-app', ['customer'])->plainTextToken;

            $userData = $user->load(['profile', 'customerBusiness'])->toArray();

            // Add full location info
            if ($postalCode) {
                $locationInfo = DB::table('location')
                    ->where('postal_code', $postalCode)
                    ->first();

                if ($locationInfo) {
                    $userData['location_info'] = [
                        'village' => $village ?? null,
                        'postal_code' => $postalCode,
                        'post_office_bn' => $locationInfo->post_office_bn ?? null,
                        'upazila_bn' => $locationInfo->upazila_bn ?? null,
                        'district_bn' => $locationInfo->district_bn ?? null,
                        'division_bn' => $locationInfo->division_bn ?? null,
                    ];
                }
            }

            Log::info('Customer registration successful', ['user_id' => $user->user_id]);

            return response()->json([
                'success' => true,
                'message' => 'নিবন্ধন সফল হয়েছে',
                'data' => [
                    'token' => $token,
                    'user' => $userData,
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Customer registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'নিবন্ধন ব্যর্থ হয়েছে: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get Profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'অননুমোদিত অ্যাক্সেস',
            ], 401);
        }

        $userData = $user->load(['profile', 'customerBusiness'])->toArray();

        // Add full location info
        if ($user->profile && $user->profile->postal_code) {
            $location = DB::table('location')
                ->where('postal_code', $user->profile->postal_code)
                ->first();

            if ($location) {
                $userData['location_info'] = [
                    'village' => $user->profile->village ?? null,
                    'postal_code' => $user->profile->postal_code,
                    'post_office_bn' => $location->post_office_bn ?? null,
                    'upazila_bn' => $location->upazila_bn ?? null,
                    'district_bn' => $location->district_bn ?? null,
                    'division_bn' => $location->division_bn ?? null,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'data' => $userData,
        ]);
    }

    /**
     * Update Profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'অননুমোদিত অ্যাক্সেস',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'fullName' => 'nullable|string|max:100',
            'fatherName' => 'nullable|string|max:100',
            'motherName' => 'nullable|string|max:100',
            'dateOfBirth' => 'nullable|date|before:today',
            'postal_code' => 'nullable|integer',
            'village' => 'nullable|string|max:100',
            'businessName' => 'nullable|string|max:100',
            'businessType' => 'nullable|string',
            'customBusinessType' => 'nullable|string|max:100',
            'tradeLicenseNumber' => 'nullable|string|max:30',
            'establishedYear' => 'nullable|integer|min:1900|max:' . date('Y'),
            'profilePhoto' => 'nullable|image|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $profile = $user->profile;
            $business = $user->customerBusiness;

            // Update profile photo if provided
            if ($request->hasFile('profilePhoto')) {
                // Delete old photo
                if ($profile && $profile->profile_photo_url) {
                    Storage::disk('public')->delete($profile->profile_photo_url);
                }
                $profilePhotoPath = $request->file('profilePhoto')->store('profile_photos/customers', 'public');
                $profile->profile_photo_url = $profilePhotoPath;
            }

            // Update profile fields
            if ($profile) {
                if ($request->has('fullName')) {
                    $profile->full_name = $request->fullName;
                }
                if ($request->has('fatherName')) {
                    $profile->father_name = $request->fatherName;
                }
                if ($request->has('motherName')) {
                    $profile->mother_name = $request->motherName;
                }
                if ($request->has('dateOfBirth')) {
                    $profile->date_of_birth = $request->dateOfBirth;
                }
                if ($request->has('postal_code')) {
                    $profile->postal_code = $request->postal_code;
                }
                if ($request->has('village')) {
                    $profile->village = $request->village;
                }

                // Update address if location changed
                if ($request->has('postal_code') || $request->has('village')) {
                    $postalCode = $request->postal_code ?? $profile->postal_code;
                    $village = $request->village ?? $profile->village;

                    if ($postalCode) {
                        $locationData = DB::table('location')->where('postal_code', $postalCode)->first();
                        if ($locationData) {
                            $addressParts = [];
                            if ($village) $addressParts[] = "গ্রাম: " . $village;
                            if ($locationData->post_office_bn) $addressParts[] = "ডাকঘর: " . $locationData->post_office_bn;
                            if ($locationData->upazila_bn) $addressParts[] = "উপজেলা: " . $locationData->upazila_bn;
                            if ($locationData->district_bn) $addressParts[] = "জেলা: " . $locationData->district_bn;
                            $profile->address = implode(', ', $addressParts);
                        }
                    }
                }

                $profile->save();
            }

            // Update business details
            if ($business) {
                if ($request->has('businessName')) {
                    $business->business_name = $request->businessName;
                }
                if ($request->has('businessType')) {
                    $business->business_type = $request->businessType;
                    if ($request->businessType === 'other') {
                        $business->custom_business_type = $request->customBusinessType;
                    } else {
                        $business->custom_business_type = null;
                    }
                }
                if ($request->has('tradeLicenseNumber')) {
                    $business->trade_license_number = $request->tradeLicenseNumber;
                }
                if ($request->has('establishedYear')) {
                    $business->established_year = $request->establishedYear;
                }
                $business->save();
            }

            DB::commit();

            $userData = $user->load(['profile', 'customerBusiness'])->toArray();

            // Add location info
            if ($user->profile && $user->profile->postal_code) {
                $location = DB::table('location')
                    ->where('postal_code', $user->profile->postal_code)
                    ->first();

                if ($location) {
                    $userData['location_info'] = [
                        'village' => $user->profile->village ?? null,
                        'postal_code' => $user->profile->postal_code,
                        'post_office_bn' => $location->post_office_bn ?? null,
                        'upazila_bn' => $location->upazila_bn ?? null,
                        'district_bn' => $location->district_bn ?? null,
                        'division_bn' => $location->division_bn ?? null,
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'প্রোফাইল আপডেট সফল হয়েছে',
                'data' => $userData,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Customer profile update failed', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'প্রোফাইল আপডেট ব্যর্থ হয়েছে',
            ], 500);
        }
    }

    /**
     * Logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'লগআউট সফল হয়েছে',
        ]);
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

        $phone = $request->phone;
        $purpose = $request->purpose ?? 'login';

        $result = $this->otpService->sendOtp($phone, $purpose);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP পুনরায় পাঠানো হয়েছে',
            'data' => [
                'otp_id' => $result['otp_id'],
                'expires_in' => $result['expires_in'],
                'otp_code' => $result['otp_code'] ?? null, // For dev mode
            ],
        ]);
    }

    /**
     * Send OTP for Password Reset
     * POST /api/customer/forgot-password/send-otp
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

        // Check if user exists
        $user = User::where('phone', $phone)->where('user_type', 'customer')->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'এই ফোন নম্বর দিয়ে কোনো ক্রেতা/ব্যবসায়ী অ্যাকাউন্ট পাওয়া যায়নি।',
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
     * POST /api/customer/forgot-password/reset
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
        $user = User::where('phone', $phone)->where('user_type', 'customer')->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'ব্যবহারকারী পাওয়া যায়নি',
            ], 404);
        }

        // Update password
        $user->password_hash = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে। এখন লগইন করুন।',
        ]);
    }
}
