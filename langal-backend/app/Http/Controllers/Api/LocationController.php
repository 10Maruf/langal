<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    /**
     * Get location details by postal code
     */
    public function getByPostalCode(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'postal_code' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $location = DB::table('location')
            ->where('postal_code', $request->postal_code)
            ->first();

        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'পোস্টাল কোড পাওয়া যায়নি',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'postal_code' => $location->postal_code,
                'post_office' => $location->post_office ?? null,
                'post_office_bn' => $location->post_office_bn ?? null,
                'upazila' => $location->upazila,
                'upazila_bn' => $location->upazila_bn ?? null,
                'district' => $location->district,
                'district_bn' => $location->district_bn ?? null,
                'division' => $location->division,
                'division_bn' => $location->division_bn ?? null,
            ],
        ]);
    }

    /**
     * Get all divisions (Bangla)
     */
    public function getDivisions(): JsonResponse
    {
        $divisions = DB::table('location')
            ->select('division', 'division_bn')
            ->distinct()
            ->orderBy('division_bn')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $divisions,
        ]);
    }

    /**
     * Get districts by division (Bangla)
     */
    public function getDistricts(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'division' => 'nullable|string',
            'division_bn' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $query = DB::table('location')
            ->select('district', 'district_bn')
            ->distinct();

        if ($request->division) {
            $query->where('division', $request->division);
        } elseif ($request->division_bn) {
            $query->where('division_bn', $request->division_bn);
        }

        $districts = $query->orderBy('district_bn')->get();

        return response()->json([
            'success' => true,
            'data' => $districts,
        ]);
    }

    /**
     * Get upazilas by district (Bangla)
     */
    public function getUpazilas(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'district' => 'nullable|string',
            'district_bn' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $query = DB::table('location')
            ->select('upazila', 'upazila_bn')
            ->distinct();

        if ($request->district) {
            $query->where('district', $request->district);
        } elseif ($request->district_bn) {
            $query->where('district_bn', $request->district_bn);
        }

        $upazilas = $query->orderBy('upazila_bn')->get();

        return response()->json([
            'success' => true,
            'data' => $upazilas,
        ]);
    }

    /**
     * Get post offices by upazila (Bangla)
     */
    public function getPostOffices(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'upazila' => 'nullable|string',
            'upazila_bn' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $query = DB::table('location')
            ->select('postal_code', 'post_office', 'post_office_bn')
            ->distinct();

        if ($request->upazila) {
            $query->where('upazila', $request->upazila);
        } elseif ($request->upazila_bn) {
            $query->where('upazila_bn', $request->upazila_bn);
        }

        $postOffices = $query->orderBy('post_office_bn')->get();

        return response()->json([
            'success' => true,
            'data' => $postOffices,
        ]);
    }

    /**
     * Search locations
     */
    public function search(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:2',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $searchTerm = '%' . $request->query . '%';

        $locations = DB::table('location')
            ->where('post_office_bn', 'LIKE', $searchTerm)
            ->orWhere('upazila_bn', 'LIKE', $searchTerm)
            ->orWhere('district_bn', 'LIKE', $searchTerm)
            ->orWhere('division_bn', 'LIKE', $searchTerm)
            ->orWhere('postal_code', 'LIKE', $searchTerm)
            ->select('postal_code', 'post_office_bn', 'upazila_bn', 'district_bn', 'division_bn')
            ->limit(20)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $locations,
        ]);
    }
}
