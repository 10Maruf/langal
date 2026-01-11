import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sprout } from "lucide-react";
import type { FieldDataFormData } from '@/pages/DataOperatorFieldDataCollection';

interface Step3Props {
  formData: FieldDataFormData;
  updateFormData: (updates: Partial<FieldDataFormData>) => void;
}

const CROP_OPTIONS = [
  'ধান', 'গম', 'ভুট্টা', 'আলু', 'পেঁয়াজ', 'রসুন', 'মরিচ',
  'টমেটো', 'বেগুন', 'শিম', 'লাউ', 'মিষ্টি কুমড়া', 'পাট', 'আখ'
];

const Step3CropInfo: React.FC<Step3Props> = ({ formData, updateFormData }) => {
  const toggleCrop = (crop: string) => {
    const current = formData.primary_crops || [];
    const updated = current.includes(crop)
      ? current.filter(c => c !== crop)
      : [...current, crop];
    updateFormData({ primary_crops: updated });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sprout className="h-5 w-5" />
            ফসলের ধরন
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>প্রধান ফসল (একাধিক নির্বাচন করুন)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {CROP_OPTIONS.map((crop) => (
                  <div key={crop} className="flex items-center space-x-2">
                    <Checkbox
                      id={crop}
                      checked={formData.primary_crops?.includes(crop)}
                      onCheckedChange={() => toggleCrop(crop)}
                    />
                    <label
                      htmlFor={crop}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {crop}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="crop_type">অন্যান্য ফসল</Label>
              <Input
                id="crop_type"
                value={formData.crop_type}
                onChange={(e) => updateFormData({ crop_type: e.target.value })}
                placeholder="অন্যান্য ফসলের নাম লিখুন"
              />
            </div>

            <div>
              <Label htmlFor="secondary_crops">সহযোগী ফসল</Label>
              <Input
                id="secondary_crops"
                value={formData.secondary_crops}
                onChange={(e) => updateFormData({ secondary_crops: e.target.value })}
                placeholder="সাথী ফসল বা মিশ্র চাষ"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">মৌসুম ও উৎপাদন</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="season">মৌসুম</Label>
              <Select
                value={formData.season}
                onValueChange={(value) => updateFormData({ season: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="রবি">রবি (শীতকাল)</SelectItem>
                  <SelectItem value="খরিফ-১">খরিফ-১ (প্রাক-বর্ষা)</SelectItem>
                  <SelectItem value="খরিফ-২">খরিফ-২ (বর্ষাকাল)</SelectItem>
                  <SelectItem value="জায়েদ">জায়েদ (গ্রীষ্মকাল)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="crop_frequency">বছরে কতবার ফসল</Label>
              <Select
                value={formData.crop_frequency}
                onValueChange={(value) => updateFormData({ crop_frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="১">১ বার</SelectItem>
                  <SelectItem value="২">২ বার</SelectItem>
                  <SelectItem value="৩">৩ বার</SelectItem>
                  <SelectItem value="৩+">৩ বারের বেশি</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="production_amount">উৎপাদিত পরিমাণ</Label>
              <div className="flex gap-2">
                <Input
                  id="production_amount"
                  type="number"
                  step="0.01"
                  value={formData.production_amount}
                  onChange={(e) => updateFormData({ production_amount: e.target.value })}
                  placeholder="পরিমাণ"
                  className="flex-1"
                />
                <Select
                  value={formData.production_unit}
                  onValueChange={(value) => updateFormData({ production_unit: value })}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">কেজি</SelectItem>
                    <SelectItem value="maund">মণ</SelectItem>
                    <SelectItem value="ton">টন</SelectItem>
                    <SelectItem value="quintal">কুইন্টাল</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="crop_rotation">ফসল পর্যায়ক্রম</Label>
              <Input
                id="crop_rotation"
                value={formData.crop_rotation}
                onChange={(e) => updateFormData({ crop_rotation: e.target.value })}
                placeholder="যেমন: ধান-গম-ভুট্টা"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">বীজ সংক্রান্ত</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seeds_source">বীজের উৎস</Label>
              <Select
                value={formData.seeds_source}
                onValueChange={(value) => updateFormData({ seeds_source: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="সরকারি">সরকারি</SelectItem>
                  <SelectItem value="বেসরকারি">বেসরকারি কোম্পানি</SelectItem>
                  <SelectItem value="নিজস্ব">নিজস্ব বীজ</SelectItem>
                  <SelectItem value="স্থানীয়">স্থানীয় বাজার</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="seed_dealers">বীজ ডিলারের নাম ও যোগাযোগ</Label>
              <Input
                id="seed_dealers"
                value={formData.seed_dealers}
                onChange={(e) => updateFormData({ seed_dealers: e.target.value })}
                placeholder="ডিলারের নাম ও ফোন"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">গুরুত্বপূর্ণ:</h4>
        <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
          <li>প্রধান ফসলগুলো টিক চিহ্ন দিয়ে নির্বাচন করুন</li>
          <li>মৌসুম অনুযায়ী ফসলের তথ্য দিন</li>
          <li>উৎপাদন পরিমাণ সঠিকভাবে উল্লেখ করুন</li>
        </ul>
      </div>
    </div>
  );
};

export default Step3CropInfo;
