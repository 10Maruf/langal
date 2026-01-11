import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, User, CheckCircle } from "lucide-react";
import LocationSelector, { LocationData } from '@/components/farmer/LocationSelector';
import type { FieldDataFormData } from '@/pages/DataOperatorFieldDataCollection';

interface Step1Props {
  formData: FieldDataFormData;
  updateFormData: (updates: Partial<FieldDataFormData>) => void;
}

const Step1BasicInfo: React.FC<Step1Props> = ({ formData, updateFormData }) => {
  // Handle location change from LocationSelector
  const handleLocationChange = useCallback((location: LocationData) => {
    updateFormData({
      // Location fields
      division: location.division,
      division_bn: location.division_bn,
      district: location.district,
      district_bn: location.district_bn,
      upazila: location.upazila,
      upazila_bn: location.upazila_bn,
      post_office: location.post_office,
      post_office_bn: location.post_office_bn,
      postal_code: location.postal_code?.toString() || '',
      village: location.village || '',
      // Also update farmer address fields
      manual_farmer_district: location.district_bn,
      manual_farmer_upazila: location.upazila_bn,
    });
  }, [updateFormData]);

  // Handle address change (full address string)
  const handleAddressChange = useCallback((fullAddress: string) => {
    updateFormData({
      manual_farmer_address: fullAddress,
      farmer_address: fullAddress,
    });
  }, [updateFormData]);

  // Create LocationData from formData for the selector
  const currentLocation: LocationData | null = formData.postal_code ? {
    division: formData.division || '',
    division_bn: formData.division_bn || '',
    district: formData.district || '',
    district_bn: formData.district_bn || '',
    upazila: formData.upazila || '',
    upazila_bn: formData.upazila_bn || '',
    post_office: formData.post_office || '',
    post_office_bn: formData.post_office_bn || '',
    postal_code: parseInt(formData.postal_code) || 0,
    village: formData.village || '',
  } : null;

  return (
    <div className="space-y-6">
      {/* কৃষক তথ্য */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            কৃষকের তথ্য
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-md font-medium border-b pb-2">ব্যক্তিগত তথ্য</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manual_farmer_name">
                  পূর্ণ নাম <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="manual_farmer_name"
                  value={formData.manual_farmer_name || ''}
                  onChange={(e) => updateFormData({ manual_farmer_name: e.target.value })}
                  placeholder="কৃষকের পূর্ণ নাম"
                />
              </div>

              <div>
                <Label htmlFor="manual_farmer_nid">এনআইডি নম্বর</Label>
                <Input
                  id="manual_farmer_nid"
                  value={formData.manual_farmer_nid || ''}
                  onChange={(e) => updateFormData({ manual_farmer_nid: e.target.value })}
                  placeholder="১৩ অথবা ১০ সংখ্যার এনআইডি"
                />
              </div>

              <div>
                <Label htmlFor="manual_farmer_phone">
                  ফোন নম্বর <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="manual_farmer_phone"
                  value={formData.manual_farmer_phone || ''}
                  onChange={(e) => updateFormData({ manual_farmer_phone: e.target.value })}
                  placeholder="০১XXXXXXXXX"
                />
              </div>



              <div>
                <Label htmlFor="manual_farmer_dob">জন্ম তারিখ</Label>
                <Input
                  id="manual_farmer_dob"
                  type="date"
                  value={formData.manual_farmer_dob || ''}
                  onChange={(e) => updateFormData({ manual_farmer_dob: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="manual_farmer_father">পিতার নাম</Label>
                <Input
                  id="manual_farmer_father"
                  value={formData.manual_farmer_father || ''}
                  onChange={(e) => updateFormData({ manual_farmer_father: e.target.value })}
                  placeholder="পিতার পূর্ণ নাম"
                />
              </div>

              <div>
                <Label htmlFor="manual_farmer_mother">মাতার নাম</Label>
                <Input
                  id="manual_farmer_mother"
                  value={formData.manual_farmer_mother || ''}
                  onChange={(e) => updateFormData({ manual_farmer_mother: e.target.value })}
                  placeholder="মাতার পূর্ণ নাম"
                />
              </div>

              <div>
                <Label htmlFor="manual_farmer_land">জমির পরিমাণ</Label>
                <Input
                  id="manual_farmer_land"
                  value={formData.manual_farmer_land || ''}
                  onChange={(e) => updateFormData({ manual_farmer_land: e.target.value })}
                  placeholder="যেমন: ৫ বিঘা"
                />
              </div>
            </div>

            {formData.manual_farmer_name && formData.manual_farmer_phone && (
              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div className="flex-1">
                    <div className="font-semibold text-green-900">কৃষক তথ্য প্রস্তুত:</div>
                    <div className="text-sm mt-1">{formData.manual_farmer_name}</div>
                    <div className="text-sm text-gray-600">{formData.manual_farmer_phone}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* অবস্থান তথ্য - LocationSelector ব্যবহার */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            অবস্থান তথ্য
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LocationSelector
            value={currentLocation}
            onChange={handleLocationChange}
            onAddressChange={handleAddressChange}
          />


          {/* Selected location display */}
          {formData.postal_code && formData.division_bn && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">নির্বাচিত ঠিকানা:</span>
              </div>
              <div className="text-sm text-green-700">
                {formData.village && <span>{formData.village}, </span>}
                {formData.post_office_bn && <span>{formData.post_office_bn}, </span>}
                {formData.upazila_bn && <span>{formData.upazila_bn}, </span>}
                {formData.district_bn && <span>{formData.district_bn}, </span>}
                {formData.division_bn && <span>{formData.division_bn}</span>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">নির্দেশনা:</h4>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>কৃষকের নাম এবং ফোন নম্বর অবশ্যই দিতে হবে</li>
          <li>পোস্টাল কোড দিয়ে বা ম্যানুয়াল নির্বাচন করে ঠিকানা সম্পূর্ণ করুন</li>
          <li>সব তথ্য সঠিকভাবে যাচাই করুন</li>
          <li>পরবর্তী ধাপে যেতে "পরবর্তী" বাটনে ক্লিক করুন</li>
        </ul>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
