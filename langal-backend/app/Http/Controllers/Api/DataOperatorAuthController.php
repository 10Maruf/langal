<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DataOperator;
use App\Models\UserProfile;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DataOperatorAuthController extends Controller
{
    protected $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * Send OTP for Registration
     */
    public function sendOtp(Request $request): JsonResponse
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

        // Check if phone already registered
        $user = User::where('phone', $phone)->where('user_type', 'data_operator')->first();

        if ($user) {
            return response()->json([
                'success' => false,
                'message' => 'This mobile number is already registered as Data Operator. Please login.',
            ], 409);
        }

        // Send OTP
        $result = $this->otpService->sendOtp($phone, 'register');

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
     * Register Data Operator
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|unique:users,phone',
            'password' => 'required|string|min:6',
            'otp_code' => 'required|string|size:6',
            'fullName' => 'required|string',
            'nidNumber' => 'required|string|unique:user_profiles,nid_number',
            'dateOfBirth' => 'required|date',
            'fatherName' => 'nullable|string',
            'motherName' => 'nullable|string',
            'postal_code' => 'nullable|integer',
            'village' => 'nullable|string',
            'profilePhoto' => 'nullable|image|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
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
                'message' => 'Invalid or expired OTP'
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Create User
            $user = User::create([
                'phone' => $request->phone,
                'email' => $request->email,
                'user_type' => 'data_operator',
                'password_hash' => Hash::make($request->password),
                'is_verified' => true,
                'is_active' => true,
            ]);

            // Handle Profile Photo Upload
            $profilePhotoPath = null;
            if ($request->hasFile('profilePhoto')) {
                $profilePhotoPath = $request->file('profilePhoto')->store('profile_photos', 'public');
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
                'nid_number' => $request->nidNumber,
                'profile_photo_url' => $profilePhotoPath,
                'verification_status' => 'pending',
            ]);

            // Create Data Operator entry
            DataOperator::create([
                'user_id' => $user->user_id,
            ]);

            DB::commit();

            $token = $user->createToken('data-operator-app', ['data_operator'])->plainTextToken;

            $userData = $user->load(['profile', 'dataOperator'])->toArray();

            // Add full location info from location table based on postal_code
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

            return response()->json([
                'success' => true,
                'message' => 'Data Operator registration successful',
                'data' => [
                    'user' => $userData,
                    'token' => $token,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Data Operator Registration Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Login Data Operator
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $phone = $request->phone;
        $password = $request->password;

        // Find user by phone and user_type
        $user = User::where('phone', $phone)
            ->where('user_type', 'data_operator')
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No Data Operator account found with this mobile number.',
            ], 404);
        }

        // Check if account is active
        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive. Please contact support.',
            ], 403);
        }

        // Verify password
        if (!Hash::check($password, $user->password_hash)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password.',
            ], 401);
        }

        // Generate token
        $token = $user->createToken('data-operator-app', ['data_operator'])->plainTextToken;
        $user->update(['updated_at' => now()]);

        $userData = $user->load(['profile', 'dataOperator'])->toArray();

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
            'message' => 'Login successful',
            'data' => [
                'user' => $userData,
                'token' => $token,
            ],
        ]);
    }

    /**
     * Get Data Operator Profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        // Verify user is actually a data operator
        if ($user->user_type !== 'data_operator') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only data operators can access this profile.',
            ], 403);
        }

        $user = $user->load(['profile', 'dataOperator']);

        // Add full location info
        if ($user->profile && $user->profile->postal_code) {
            $location = DB::table('location')
                ->where('postal_code', $user->profile->postal_code)
                ->first();

            if ($location) {
                $user->location_info = [
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
            'data' => $user,
        ]);
    }

    /**
     * Update Data Operator Profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        // Verify user is actually a data operator
        if ($request->user()->user_type !== 'data_operator') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only data operators can update this profile.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'nullable|string',
            'email' => 'nullable|email',
            'father_name' => 'nullable|string',
            'mother_name' => 'nullable|string',
            'address' => 'nullable|string',
            'village' => 'nullable|string',
            'profile_photo' => 'nullable|image|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = $request->user();

            // Update email if provided
            if ($request->has('email')) {
                $user->email = $request->email;
                $user->save();
            }

            // Update profile
            $profile = $user->profile;
            if ($profile) {
                if ($request->has('full_name')) {
                    $profile->full_name = $request->full_name;
                }
                if ($request->has('father_name')) {
                    $profile->father_name = $request->father_name;
                }
                if ($request->has('mother_name')) {
                    $profile->mother_name = $request->mother_name;
                }
                if ($request->has('address')) {
                    $profile->address = $request->address;
                }
                if ($request->has('village')) {
                    $profile->village = $request->village;
                }

                // Handle profile photo upload
                if ($request->hasFile('profile_photo')) {
                    // Delete old photo if exists
                    if ($profile->profile_photo_url) {
                        Storage::disk('public')->delete($profile->profile_photo_url);
                    }

                    $profilePhotoPath = $request->file('profile_photo')->store('profile_photos', 'public');
                    $profile->profile_photo_url = $profilePhotoPath;
                }

                $profile->save();
            }

            // Reload user with relationships
            $user->load(['profile', 'dataOperator']);

            // Add location info
            if ($user->profile && $user->profile->postal_code) {
                $location = DB::table('location')
                    ->where('postal_code', $user->profile->postal_code)
                    ->first();

                if ($location) {
                    $user->location_info = [
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
                'message' => 'Profile updated successfully',
                'data' => $user,
            ]);

        } catch (\Exception $e) {
            \Log::error('Data Operator Profile Update Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Profile update failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Logout Data Operator
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get all farmers for verification
     */
    public function getFarmers(Request $request): JsonResponse
    {
        // Verify user is actually a data operator
        if ($request->user()->user_type !== 'data_operator') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only data operators can access farmer list.',
            ], 403);
        }

        try {
            $farmers = User::where('user_type', 'farmer')
                ->with(['profile' => function ($query) {
                    $query->select(
                        'user_id',
                        'full_name',
                        'profile_photo_url',
                        'date_of_birth',
                        'nid_number',
                        'postal_code',
                        'village',
                        'verification_status',
                        'verified_at',
                        'verified_by'
                    );
                }])
                ->get()
                ->map(function ($user) {
                    $profile = $user->profile;
                    if (!$profile) {
                        return null;
                    }

                    // Get location info
                    $locationInfo = null;
                    if ($profile->postal_code) {
                        $location = DB::table('location')
                            ->where('postal_code', $profile->postal_code)
                            ->first();

                        if ($location) {
                            $locationInfo = [
                                'division' => $location->division_bn,
                                'district' => $location->district_bn,
                                'upazila' => $location->upazila_bn,
                                'union' => $location->union_bn ?? null,
                                'post_office' => $location->post_office_bn,
                            ];
                        }
                    }

                    return [
                        'user_id' => $user->user_id,
                        'full_name' => $profile->full_name,
                        'phone_number' => $user->phone,
                        'profile_photo_url_full' => $profile->profile_photo_url
                            ? url('storage/' . $profile->profile_photo_url)
                            : null,
                        'date_of_birth' => $profile->date_of_birth,
                        'nid_number' => $profile->nid_number,
                        'father_name' => $profile->father_name ?? null,
                        'mother_name' => $profile->mother_name ?? null,
                        'village' => $profile->village,
                        'division' => $locationInfo['division'] ?? null,
                        'district' => $locationInfo['district'] ?? null,
                        'upazila' => $locationInfo['upazila'] ?? null,
                        'union' => $locationInfo['union'] ?? null,
                        'post_office' => $locationInfo['post_office'] ?? null,
                        'verification_status' => $profile->verification_status ?? 'pending',
                        'verified_at' => $profile->verified_at,
                        'verified_by' => $profile->verified_by,
                    ];
                })
                ->filter() // Remove null values
                ->values(); // Re-index array

            return response()->json([
                'success' => true,
                'message' => 'Farmers fetched successfully',
                'data' => $farmers,
            ]);

        } catch (\Exception $e) {
            \Log::error('Get Farmers Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch farmers: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all customers for verification
     */
    public function getCustomers(Request $request): JsonResponse
    {
        // Verify user is actually a data operator
        if ($request->user()->user_type !== 'data_operator') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only data operators can access customer list.',
            ], 403);
        }

        try {
            $customers = User::where('user_type', 'customer')
                ->with(['profile' => function ($query) {
                    $query->select(
                        'user_id',
                        'full_name',
                        'profile_photo_url',
                        'date_of_birth',
                        'nid_number',
                        'postal_code',
                        'verification_status',
                        'verified_at',
                        'verified_by'
                    );
                }])
                ->get()
                ->map(function ($user) {
                    $profile = $user->profile;
                    if (!$profile) {
                        return null;
                    }

                    // Get location info
                    $locationInfo = null;
                    if ($profile->postal_code) {
                        $location = DB::table('location')
                            ->where('postal_code', $profile->postal_code)
                            ->first();

                        if ($location) {
                            $locationInfo = [
                                'division' => $location->division_bn,
                                'district' => $location->district_bn,
                                'upazila' => $location->upazila_bn,
                            ];
                        }
                    }

                    return [
                        'user_id' => $user->user_id,
                        'full_name' => $profile->full_name,
                        'phone_number' => $user->phone,
                        'profile_photo_url_full' => $profile->profile_photo_url
                            ? url('storage/' . $profile->profile_photo_url)
                            : null,
                        'date_of_birth' => $profile->date_of_birth,
                        'nid_number' => $profile->nid_number,
                        'division' => $locationInfo['division'] ?? null,
                        'district' => $locationInfo['district'] ?? null,
                        'upazila' => $locationInfo['upazila'] ?? null,
                        'address' => $profile->village ?? null, // Using village field as address
                        'verification_status' => $profile->verification_status ?? 'pending',
                        'verified_at' => $profile->verified_at,
                        'verified_by' => $profile->verified_by,
                    ];
                })
                ->filter() // Remove null values
                ->values(); // Re-index array

            return response()->json([
                'success' => true,
                'message' => 'Customers fetched successfully',
                'data' => $customers,
            ]);

        } catch (\Exception $e) {
            \Log::error('Get Customers Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch customers: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify farmer/customer profile (Approve/Reject)
     */
    public function verifyProfile(Request $request): JsonResponse
    {
        // Verify user is actually a data operator
        if ($request->user()->user_type !== 'data_operator') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only data operators can verify profiles.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,user_id',
            'verification_status' => 'required|in:approved,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::where('user_id', $request->user_id)
                ->whereIn('user_type', ['farmer', 'customer'])
                ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ], 404);
            }

            $profile = UserProfile::where('user_id', $request->user_id)->first();

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'User profile not found',
                ], 404);
            }

            // Update verification status
            $profile->update([
                'verification_status' => $request->verification_status,
                'verified_by' => $request->user()->user_id,
                'verified_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => $request->verification_status === 'approved'
                    ? 'Profile approved successfully'
                    : 'Profile rejected successfully',
                'data' => [
                    'user_id' => $user->user_id,
                    'verification_status' => $profile->verification_status,
                    'verified_at' => $profile->verified_at,
                    'verified_by' => $profile->verified_by,
                ],
            ]);

        } catch (\Exception $e) {
            \Log::error('Profile Verification Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Verification failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all field reports for the data operator
     */
    public function getFieldReports(Request $request): JsonResponse
    {
        try {
            // Check user type
            if ($request->user()->user_type !== 'data_operator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Only data operators can access field reports.',
                ], 403);
            }

            $dataOperatorId = $request->user()->user_id;

            $reports = DB::table('field_data_reports as fdr')
                ->leftJoin('location as l', 'fdr.postal_code', '=', 'l.postal_code')
                ->where('fdr.data_operator_id', $dataOperatorId)
                ->select([
                    'fdr.report_id',
                    'fdr.postal_code',
                    'fdr.village',
                    'fdr.weather_condition',
                    'fdr.temperature',
                    'fdr.rainfall',
                    'fdr.crop_condition',
                    'fdr.pest_disease',
                    'fdr.soil_moisture',
                    'fdr.irrigation_status',
                    'fdr.notes',
                    'fdr.report_date',
                    'fdr.created_at',
                    DB::raw('JSON_OBJECT(
                        "division_bn", l.division_bn,
                        "district_bn", l.district_bn,
                        "upazila_bn", l.upazila_bn,
                        "post_office_bn", l.post_office_bn
                    ) as location_info')
                ])
                ->orderBy('fdr.report_date', 'desc')
                ->orderBy('fdr.created_at', 'desc')
                ->get();

            // Parse JSON for each report
            $reports = $reports->map(function ($report) {
                $report->location_info = json_decode($report->location_info);
                return $report;
            });

            return response()->json([
                'success' => true,
                'data' => $reports,
            ]);

        } catch (\Exception $e) {
            \Log::error('Get Field Reports Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reports: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new field report
     */
    public function createFieldReport(Request $request): JsonResponse
    {
        try {
            // Check user type
            if ($request->user()->user_type !== 'data_operator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Only data operators can create field reports.',
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'village' => 'required|string|max:100',
                'postal_code' => 'nullable|integer|exists:location,postal_code',
                'weather_condition' => 'required|string|max:50',
                'temperature' => 'nullable|numeric',
                'rainfall' => 'nullable|numeric',
                'crop_condition' => 'nullable|string',
                'pest_disease' => 'nullable|string',
                'soil_moisture' => 'nullable|string|max:50',
                'irrigation_status' => 'nullable|string|max:50',
                'notes' => 'nullable|string',
                'report_date' => 'required|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $dataOperatorId = $request->user()->user_id;

            $reportId = DB::table('field_data_reports')->insertGetId([
                'data_operator_id' => $dataOperatorId,
                'village' => $request->village,
                'postal_code' => $request->postal_code,
                'weather_condition' => $request->weather_condition,
                'temperature' => $request->temperature,
                'rainfall' => $request->rainfall,
                'crop_condition' => $request->crop_condition,
                'pest_disease' => $request->pest_disease,
                'soil_moisture' => $request->soil_moisture,
                'irrigation_status' => $request->irrigation_status,
                'notes' => $request->notes,
                'report_date' => $request->report_date,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Field report created successfully',
                'data' => [
                    'report_id' => $reportId,
                ],
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Create Field Report Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create report: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a field report
     */
    public function deleteFieldReport(Request $request, $reportId): JsonResponse
    {
        try {
            // Check user type
            if ($request->user()->user_type !== 'data_operator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Only data operators can delete field reports.',
                ], 403);
            }

            $dataOperatorId = $request->user()->user_id;

            // Check if report exists and belongs to this data operator
            $report = DB::table('field_data_reports')
                ->where('report_id', $reportId)
                ->where('data_operator_id', $dataOperatorId)
                ->first();

            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'Report not found or unauthorized',
                ], 404);
            }

            DB::table('field_data_reports')
                ->where('report_id', $reportId)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Field report deleted successfully',
            ]);

        } catch (\Exception $e) {
            \Log::error('Delete Field Report Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete report: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all soil test reports for the data operator
     */
    public function getSoilTestReports(Request $request): JsonResponse
    {
        try {
            // Check user type
            if ($request->user()->user_type !== 'data_operator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Only data operators can access soil test reports.',
                ], 403);
            }

            $dataOperatorId = $request->user()->user_id;

            $reports = DB::table('soil_test_reports as str')
                ->leftJoin('location as l', 'str.postal_code', '=', 'l.postal_code')
                ->where('str.data_operator_id', $dataOperatorId)
                ->select([
                    'str.report_id',
                    'str.farmer_name',
                    'str.farmer_phone',
                    'str.postal_code',
                    'str.village',
                    'str.field_size',
                    'str.current_crop',
                    'str.test_date',
                    'str.nitrogen',
                    'str.phosphorus',
                    'str.potassium',
                    'str.ph_level',
                    'str.ec_value',
                    'str.soil_moisture',
                    'str.soil_temperature',
                    'str.organic_matter',
                    'str.soil_type',
                    'str.calcium',
                    'str.magnesium',
                    'str.sulfur',
                    'str.zinc',
                    'str.iron',
                    'str.health_rating',
                    'str.notes',
                    'str.created_at',
                    DB::raw('JSON_OBJECT(
                        "division_bn", l.division_bn,
                        "district_bn", l.district_bn,
                        "upazila_bn", l.upazila_bn,
                        "post_office_bn", l.post_office_bn
                    ) as location_info')
                ])
                ->orderBy('str.test_date', 'desc')
                ->orderBy('str.created_at', 'desc')
                ->get();

            // Parse JSON for each report
            $reports = $reports->map(function ($report) {
                $report->location_info = json_decode($report->location_info);
                return $report;
            });

            return response()->json([
                'success' => true,
                'data' => $reports,
            ]);

        } catch (\Exception $e) {
            \Log::error('Get Soil Test Reports Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reports: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new soil test report
     */
    public function createSoilTestReport(Request $request): JsonResponse
    {
        try {
            // Check user type
            if ($request->user()->user_type !== 'data_operator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Only data operators can create soil test reports.',
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'village' => 'required|string|max:100',
                'postal_code' => 'nullable|integer|exists:location,postal_code',
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'field_size' => 'nullable|numeric',
                'current_crop' => 'nullable|string|max:100',
                'test_date' => 'required|date',
                'nitrogen' => 'nullable|numeric',
                'phosphorus' => 'nullable|numeric',
                'potassium' => 'nullable|numeric',
                'ph_level' => 'nullable|numeric|min:0|max:14',
                'ec_value' => 'nullable|numeric',
                'soil_moisture' => 'nullable|numeric|min:0|max:100',
                'soil_temperature' => 'nullable|numeric',
                'organic_matter' => 'nullable|numeric|min:0|max:100',
                'soil_type' => 'nullable|in:loamy,sandy,clay,silty',
                'calcium' => 'nullable|numeric',
                'magnesium' => 'nullable|numeric',
                'sulfur' => 'nullable|numeric',
                'zinc' => 'nullable|numeric',
                'iron' => 'nullable|numeric',
                'health_rating' => 'nullable|in:poor,fair,good,excellent',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $dataOperatorId = $request->user()->user_id;

            $reportId = DB::table('soil_test_reports')->insertGetId([
                'data_operator_id' => $dataOperatorId,
                'farmer_name' => $request->farmer_name,
                'farmer_phone' => $request->farmer_phone,
                'village' => $request->village,
                'postal_code' => $request->postal_code,
                'field_size' => $request->field_size,
                'current_crop' => $request->current_crop,
                'test_date' => $request->test_date,
                'nitrogen' => $request->nitrogen,
                'phosphorus' => $request->phosphorus,
                'potassium' => $request->potassium,
                'ph_level' => $request->ph_level,
                'ec_value' => $request->ec_value,
                'soil_moisture' => $request->soil_moisture,
                'soil_temperature' => $request->soil_temperature,
                'organic_matter' => $request->organic_matter,
                'soil_type' => $request->soil_type,
                'calcium' => $request->calcium,
                'magnesium' => $request->magnesium,
                'sulfur' => $request->sulfur,
                'zinc' => $request->zinc,
                'iron' => $request->iron,
                'health_rating' => $request->health_rating,
                'notes' => $request->notes,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Soil test report created successfully',
                'data' => [
                    'report_id' => $reportId,
                ],
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Create Soil Test Report Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create report: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a soil test report
     */
    public function deleteSoilTestReport(Request $request, $reportId): JsonResponse
    {
        try {
            // Check user type
            if ($request->user()->user_type !== 'data_operator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Only data operators can delete soil test reports.',
                ], 403);
            }

            $dataOperatorId = $request->user()->user_id;

            // Check if report exists and belongs to this data operator
            $report = DB::table('soil_test_reports')
                ->where('report_id', $reportId)
                ->where('data_operator_id', $dataOperatorId)
                ->first();

            if (!$report) {
                return response()->json([
                    'success' => false,
                    'message' => 'Report not found or unauthorized',
                ], 404);
            }

            DB::table('soil_test_reports')
                ->where('report_id', $reportId)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Soil test report deleted successfully',
            ]);

        } catch (\Exception $e) {
            \Log::error('Delete Soil Test Report Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete report: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send OTP for Password Reset
     * POST /api/data-operator/forgot-password/send-otp
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

        // Check if data operator exists
        $user = User::where('phone', $phone)->where('user_type', 'data_operator')->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'এই ফোন নম্বর দিয়ে কোনো ডাটা অপারেটর অ্যাকাউন্ট পাওয়া যায়নি।',
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
     * POST /api/data-operator/forgot-password/reset
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
        $user = User::where('phone', $phone)->where('user_type', 'data_operator')->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'ডাটা অপারেটর পাওয়া যায়নি',
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
