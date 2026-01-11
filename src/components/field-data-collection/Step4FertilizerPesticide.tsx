import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Beaker, Leaf, Bug } from "lucide-react";
import type { FieldDataFormData } from '@/pages/DataOperatorFieldDataCollection';

interface Step4Props {
  formData: FieldDataFormData;
  updateFormData: (updates: Partial<FieldDataFormData>) => void;
}

const Step4FertilizerPesticide: React.FC<Step4Props> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Beaker className="h-5 w-5" />
            রাসায়নিক সার (কেজি/বিঘা)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="urea_amount">ইউরিয়া</Label>
              <Input
                id="urea_amount"
                type="number"
                step="0.1"
                value={formData.urea_amount}
                onChange={(e) => updateFormData({ urea_amount: e.target.value })}
                placeholder="কেজি"
              />
            </div>

            <div>
              <Label htmlFor="tsp_amount">টিএসপি</Label>
              <Input
                id="tsp_amount"
                type="number"
                step="0.1"
                value={formData.tsp_amount}
                onChange={(e) => updateFormData({ tsp_amount: e.target.value })}
                placeholder="কেজি"
              />
            </div>

            <div>
              <Label htmlFor="mp_amount">এমপি</Label>
              <Input
                id="mp_amount"
                type="number"
                step="0.1"
                value={formData.mp_amount}
                onChange={(e) => updateFormData({ mp_amount: e.target.value })}
                placeholder="কেজি"
              />
            </div>

            <div>
              <Label htmlFor="dap_amount">ডিএপি</Label>
              <Input
                id="dap_amount"
                type="number"
                step="0.1"
                value={formData.dap_amount}
                onChange={(e) => updateFormData({ dap_amount: e.target.value })}
                placeholder="কেজি"
              />
            </div>

            <div>
              <Label htmlFor="gypsum_amount">জিপসাম</Label>
              <Input
                id="gypsum_amount"
                type="number"
                step="0.1"
                value={formData.gypsum_amount}
                onChange={(e) => updateFormData({ gypsum_amount: e.target.value })}
                placeholder="কেজি"
              />
            </div>

            <div>
              <Label htmlFor="zinc_amount">জিঙ্ক</Label>
              <Input
                id="zinc_amount"
                type="number"
                step="0.1"
                value={formData.zinc_amount}
                onChange={(e) => updateFormData({ zinc_amount: e.target.value })}
                placeholder="কেজি"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Leaf className="h-5 w-5" />
            জৈব সার (কেজি)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cow_dung">গোবর সার</Label>
              <Input
                id="cow_dung"
                type="number"
                step="0.1"
                value={formData.cow_dung}
                onChange={(e) => updateFormData({ cow_dung: e.target.value })}
                placeholder="কেজি"
              />
            </div>

            <div>
              <Label htmlFor="compost">কম্পোস্ট</Label>
              <Input
                id="compost"
                type="number"
                step="0.1"
                value={formData.compost}
                onChange={(e) => updateFormData({ compost: e.target.value })}
                placeholder="কেজি"
              />
            </div>

            <div>
              <Label htmlFor="vermicompost">ভার্মিকম্পোস্ট</Label>
              <Input
                id="vermicompost"
                type="number"
                step="0.1"
                value={formData.vermicompost}
                onChange={(e) => updateFormData({ vermicompost: e.target.value })}
                placeholder="কেজি"
              />
            </div>

            <div className="md:col-span-3">
              <Label htmlFor="organic_fertilizer_application">অন্যান্য জৈব সার বিবরণ</Label>
              <Textarea
                id="organic_fertilizer_application"
                value={formData.organic_fertilizer_application}
                onChange={(e) => updateFormData({ organic_fertilizer_application: e.target.value })}
                placeholder="সবুজ সার, খৈল ইত্যাদি"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bug className="h-5 w-5" />
            কীটনাশক ব্যবহার
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="insecticide_names">কীটনাশকের নাম</Label>
              <Input
                id="insecticide_names"
                value={formData.insecticide_names}
                onChange={(e) => updateFormData({ insecticide_names: e.target.value })}
                placeholder="যেমন: ম্যালাথিয়ন, ডায়াজিনন"
              />
            </div>

            <div>
              <Label htmlFor="fungicide_names">ছত্রাকনাশকের নাম</Label>
              <Input
                id="fungicide_names"
                value={formData.fungicide_names}
                onChange={(e) => updateFormData({ fungicide_names: e.target.value })}
                placeholder="যেমন: টিল্ট, ব্যাভিস্টিন"
              />
            </div>

            <div>
              <Label htmlFor="herbicide_names">আগাছানাশকের নাম</Label>
              <Input
                id="herbicide_names"
                value={formData.herbicide_names}
                onChange={(e) => updateFormData({ herbicide_names: e.target.value })}
                placeholder="যেমন: রাউন্ডআপ, প্রিটিলাক্লোর"
              />
            </div>

            <div>
              <Label htmlFor="pesticide_usage_amount">ব্যবহারের পরিমাণ</Label>
              <Input
                id="pesticide_usage_amount"
                value={formData.pesticide_usage_amount}
                onChange={(e) => updateFormData({ pesticide_usage_amount: e.target.value })}
                placeholder="লিটার/মিলি/গ্রাম"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ডিলার তথ্য</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fertilizer_dealers">সার ডিলারের নাম ও ঠিকানা</Label>
              <Textarea
                id="fertilizer_dealers"
                value={formData.fertilizer_dealers}
                onChange={(e) => updateFormData({ fertilizer_dealers: e.target.value })}
                placeholder="ডিলারের নাম, দোকানের নাম, যোগাযোগ"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="pesticide_dealers">কীটনাশক ডিলারের নাম ও ঠিকানা</Label>
              <Textarea
                id="pesticide_dealers"
                value={formData.pesticide_dealers}
                onChange={(e) => updateFormData({ pesticide_dealers: e.target.value })}
                placeholder="ডিলারের নাম, দোকানের নাম, যোগাযোগ"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-2">সতর্কতা:</h4>
        <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
          <li>সঠিক পরিমাণ সার ও কীটনাশক ব্যবহার করুন</li>
          <li>ডিলারের সম্পূর্ণ তথ্য সংগ্রহ করুন</li>
          <li>কীটনাশকের নাম ও মাত্রা সঠিকভাবে লিখুন</li>
        </ul>
      </div>
    </div>
  );
};

export default Step4FertilizerPesticide;
