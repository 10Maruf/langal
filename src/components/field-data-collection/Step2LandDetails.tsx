import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mountain } from "lucide-react";
import type { FieldDataFormData } from '@/pages/DataOperatorFieldDataCollection';

interface Step2Props {
  formData: FieldDataFormData;
  updateFormData: (updates: Partial<FieldDataFormData>) => void;
}

const Step2LandDetails: React.FC<Step2Props> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mountain className="h-5 w-5" />
            জমির পরিমাপ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total_land">মোট জমির পরিমাণ</Label>
              <div className="flex gap-2">
                <Input
                  id="total_land"
                  type="number"
                  step="0.01"
                  value={formData.total_land}
                  onChange={(e) => updateFormData({ total_land: e.target.value })}
                  placeholder="পরিমাণ"
                  className="flex-1"
                />
                <Select
                  value={formData.land_size_unit}
                  onValueChange={(value) => updateFormData({ land_size_unit: value })}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="decimal">শতাংশ</SelectItem>
                    <SelectItem value="bigha">বিঘা</SelectItem>
                    <SelectItem value="katha">কাঠা</SelectItem>
                    <SelectItem value="acre">একর</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="cultivable_land">আবাদি জমির পরিমাণ</Label>
              <Input
                id="cultivable_land"
                type="number"
                step="0.01"
                value={formData.cultivable_land}
                onChange={(e) => updateFormData({ cultivable_land: e.target.value })}
                placeholder="চাষযোগ্য জমি"
              />
            </div>

            <div>
              <Label htmlFor="land_ownership_type">জমির মালিকানা</Label>
              <Select
                value={formData.land_ownership_type}
                onValueChange={(value) => updateFormData({ land_ownership_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="নিজস্ব">নিজস্ব</SelectItem>
                  <SelectItem value="লিজ">লিজ</SelectItem>
                  <SelectItem value="বর্গা">বর্গা</SelectItem>
                  <SelectItem value="অন্যান্য">অন্যান্য</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="number_of_plots">প্লটের সংখ্যা</Label>
              <Input
                id="number_of_plots"
                type="number"
                value={formData.number_of_plots}
                onChange={(e) => updateFormData({ number_of_plots: e.target.value })}
                placeholder="কয়টি প্লট"
              />
            </div>

            <div>
              <Label htmlFor="is_cultivable">চাষযোগ্য কিনা?</Label>
              <Select
                value={formData.is_cultivable}
                onValueChange={(value) => updateFormData({ is_cultivable: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">হ্যাঁ</SelectItem>
                  <SelectItem value="no">না</SelectItem>
                  <SelectItem value="partial">আংশিক</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">সেচ সুবিধা</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="irrigation_facility">সেচ সুবিধা আছে?</Label>
              <Select
                value={formData.irrigation_facility}
                onValueChange={(value) => updateFormData({ irrigation_facility: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">হ্যাঁ</SelectItem>
                  <SelectItem value="no">না</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="irrigation_status">সেচের ধরন</Label>
              <Select
                value={formData.irrigation_status}
                onValueChange={(value) => updateFormData({ irrigation_status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="নলকূপ">নলকূপ</SelectItem>
                  <SelectItem value="খাল">খাল</SelectItem>
                  <SelectItem value="পুকুর">পুকুর</SelectItem>
                  <SelectItem value="বৃষ্টি">বৃষ্টি নির্ভর</SelectItem>
                  <SelectItem value="মিশ্র">মিশ্র</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="livestock_info">পশুপালন তথ্য</Label>
              <Input
                id="livestock_info"
                value={formData.livestock_info}
                onChange={(e) => updateFormData({ livestock_info: e.target.value })}
                placeholder="গরু, ছাগল, হাঁস-মুরগি ইত্যাদি"
              />
            </div>

            <div>
              <Label htmlFor="land_service_date">শেষ জমি চাষের তারিখ</Label>
              <Input
                id="land_service_date"
                type="date"
                value={formData.land_service_date}
                onChange={(e) => updateFormData({ land_service_date: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-900 mb-2">টিপস:</h4>
        <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
          <li>জমির সঠিক পরিমাপ দিন (শতাংশ/বিঘা/কাঠা)</li>
          <li>মালিকানার ধরন নির্ধারণ করুন</li>
          <li>সেচ সুবিধার তথ্য গুরুত্বপূর্ণ</li>
        </ul>
      </div>
    </div>
  );
};

export default Step2LandDetails;
