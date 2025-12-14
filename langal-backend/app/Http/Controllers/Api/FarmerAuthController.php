<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Farmer;
use App\Models\UserProfile;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class FarmerAuthController extends Controller
{
    protected $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
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
        $user = User::where('phone', $phone)->where('user_type', 'farmer')->first();

        if ($purpose === 'login' && !$user) {
            return response()->json([
                'success' => false,
                'message' => 'No farmer account found with this phone number. Please register first.',
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
        $result = $this->otpService->verifyOtp($phone, $otpCode, 'login');

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        $user = User::where('phone', $phone)->where('user_type', 'farmer')->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        // Generate token
        $token = $user->createToken('farmer-app', ['farmer'])->plainTextToken;
        $user->update(['updated_at' => now()]);

        $userData = $user->load(['profile', 'farmer'])->toArray();
        
        // Add full location info from location table based on postal_code
        if ($user->profile && $user->profile->postal_code) {
            $location = \DB::table('location')
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
            'message' => 'Login successful',
            'data' => [
                'user' => $userData,
                'token' => $token,
            ],
        ]);
    }

    /**
     * Register Farmer
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|unique:users,phone',
            'fullName' => 'required|string',
            'farmSize' => 'required|numeric',
            'farmSizeUnit' => 'nullable|in:bigha,katha,acre',
            'farmType' => 'required|string',
            'experience' => 'required|numeric',
            'nidNumber' => 'nullable|string|unique:user_profiles,nid_number',
            'krishiCardNumber' => 'nullable|string|unique:farmer_details,krishi_card_number',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // At least one of NID or Krishi Card must be provided
        if (empty($request->nidNumber) && empty($request->krishiCardNumber)) {
            return response()->json([
                'success' => false,
                'message' => 'Either NID number or Krishi Card number must be provided',
                'errors' => [
                    'nidNumber' => ['Either NID or Krishi Card is required'],
                    'krishiCardNumber' => ['Either NID or Krishi Card is required']
                ]
            ], 422);
        }

        // Verify OTP if provided
        if ($request->has('otp_code')) {
             $otpResult = $this->otpService->verifyOtp($request->phone, $request->otp_code, 'register');
             if (!$otpResult['success']) {
                 return response()->json(['success' => false, 'message' => 'Invalid OTP'], 400);
             }
        }

        DB::beginTransaction();
        try {
            // Create User
            $user = User::create([
                'phone' => $request->phone,
                'email' => $request->email,
                'user_type' => 'farmer',
                'password_hash' => Hash::make($request->phone),
                'is_verified' => true,
                'is_active' => true,
            ]);

            // Handle File Uploads - Debug logging
            $profilePhotoPath = null;
            \Log::info('Registration file check', [
                'hasFile' => $request->hasFile('profilePhoto'),
                'allFiles' => array_keys($request->allFiles()),
            ]);
            
            if ($request->hasFile('profilePhoto')) {
                $profilePhotoPath = $request->file('profilePhoto')->store('profile_photos', 'public');
                \Log::info('Profile photo uploaded', ['path' => $profilePhotoPath]);
            } else {
                \Log::warning('No profile photo in request');
            }

            // Get location details from postal_code
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
                'date_of_birth' => $request->dateOfBirth,
                'father_name' => $request->fatherName ?? null,
                'mother_name' => $request->motherName ?? null,
                'address' => $address,
                'village' => $village,
                'postal_code' => $postalCode,
                'nid_number' => $request->nidNumber ?? null,
                'profile_photo_url' => $profilePhotoPath,
                'verification_status' => 'verified',
            ]);

            // Create Farmer Details
            Farmer::create([
                'user_id' => $user->user_id,
                'farm_size' => (float)$request->farmSize,
                'farm_size_unit' => $request->farmSizeUnit ?? 'bigha',
                'farm_type' => $request->farmType,
                'experience_years' => (int)$request->experience,
                'krishi_card_number' => $request->krishiCardNumber ?? null,
                'registration_date' => now(),
                'additional_info' => [
                    'machinery' => [],
                    'crops' => [],
                    'financial_summary' => []
                ]
            ]);

            DB::commit();

            $token = $user->createToken('farmer-app', ['farmer'])->plainTextToken;

            $userData = $user->load(['profile', 'farmer'])->toArray();
            
            // Add full location info from location table based on postal_code
            if ($postalCode) {
                $locationInfo = \DB::table('location')
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

            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'data' => [
                    'token' => $token,
                    'user' => $userData
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get Profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
             return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $userData = $user->load(['profile', 'farmer'])->toArray();
        
        // Add full location info from location table based on postal_code
        if ($user->profile && $user->profile->postal_code) {
            $location = \DB::table('location')
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
            'data' => [
                'user' => $userData
            ]
        ]);
    }

    /**
     * Update Profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        
        DB::beginTransaction();
        try {
            // Update User table (email, phone)
            if ($request->has('email')) {
                $user->email = $request->email;
            }
            if ($request->has('phone')) {
                $user->phone = $request->phone;
            }
            $user->save();

            // Update User Profile table
            if ($user->profile) {
                $profileData = [];
                
                if ($request->has('full_name')) {
                    $profileData['full_name'] = $request->full_name;
                }
                if ($request->has('address')) {
                    $profileData['address'] = $request->address;
                }
                
                // Handle profile photo upload
                if ($request->hasFile('profile_photo')) {
                    $file = $request->file('profile_photo');
                    
                    // Delete old photo if exists
                    if ($user->profile->profile_photo_url) {
                        $oldPhotoPath = storage_path('app/public/' . $user->profile->profile_photo_url);
                        if (file_exists($oldPhotoPath)) {
                            unlink($oldPhotoPath);
                        }
                    }
                    
                    // Store new photo
                    $path = $file->store('profile_photos', 'public');
                    $profileData['profile_photo_url'] = $path;
                }
                
                if (!empty($profileData)) {
                    $user->profile->update($profileData);
                }
            }

            // Update Farmer Details
            if ($user->farmer) {
                $farmerData = [];
                
                if ($request->has('farm_size')) {
                    $farmerData['farm_size'] = (float)$request->farm_size;
                }
                if ($request->has('farm_type')) {
                    $farmerData['farm_type'] = $request->farm_type;
                }
                if ($request->has('experience_years')) {
                    $farmerData['experience_years'] = (int)$request->experience_years;
                }
                
                // Update additional info (JSON)
                if ($request->has('additional_info')) {
                    $currentInfo = $user->farmer->additional_info ?? [];
                    
                    // Parse JSON string if it comes as string (from FormData)
                    $additionalInfo = $request->additional_info;
                    if (is_string($additionalInfo)) {
                        $additionalInfo = json_decode($additionalInfo, true);
                    }
                    
                    $farmerData['additional_info'] = array_merge($currentInfo, $additionalInfo ?? []);
                }
                
                if (!empty($farmerData)) {
                    $user->farmer->update($farmerData);
                }
            }

            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'user' => $user->fresh()->load(['profile', 'farmer'])
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false, 
                'message' => 'Update failed: ' . $e->getMessage()
            ], 500);
        }
    }
    
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Logged out']);
    }
}