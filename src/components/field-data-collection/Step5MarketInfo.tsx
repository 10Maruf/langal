import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, TrendingUp } from "lucide-react";
import type { FieldDataFormData } from '@/pages/DataOperatorFieldDataCollection';

interface Step5Props {
  formData: FieldDataFormData;
  updateFormData: (updates: Partial<FieldDataFormData>) => void;
}

const Step5MarketInfo: React.FC<Step5Props> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            বাজার মূল্য (টাকা/মণ বা কেজি)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="market_price">ফসল হওয়ার পর বাজারদর</Label>
              <Input
                id="market_price"
                type="number"
                step="0.01"
                value={formData.market_price}
                onChange={(e) => updateFormData({ market_price: e.target.value })}
                placeholder="টাকা"
              />
            </div>

            <div>
              <Label htmlFor="current_market_price">বর্তমান বাজারদর</Label>
              <Input
                id="current_market_price"
                type="number"
                step="0.01"
                value={formData.current_market_price}
                onChange={(e) => updateFormData({ current_market_price: e.target.value })}
                placeholder="টাকা"
              />
            </div>

            <div>
              <Label htmlFor="expected_price">প্রত্যাশিত দাম</Label>
              <Input
                id="expected_price"
                type="number"
                step="0.01"
                value={formData.expected_price}
                onChange={(e) => updateFormData({ expected_price: e.target.value })}
                placeholder="টাকা"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5" />
            স্থানীয় বাজার
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="local_market_name">স্থানীয় বাজারের নাম</Label>
              <Input
                id="local_market_name"
                value={formData.local_market_name}
                onChange={(e) => updateFormData({ local_market_name: e.target.value })}
                placeholder="বাজারের নাম"
              />
            </div>

            <div>
              <Label htmlFor="local_market_distance">দূরত্ব (কিলোমিটার)</Label>
              <Input
                id="local_market_distance"
                type="number"
                step="0.1"
                value={formData.local_market_distance}
                onChange={(e) => updateFormData({ local_market_distance: e.target.value })}
                placeholder="কিমি"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">দূরবর্তী বাজার</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="distant_market_name">দূরবর্তী বাজারের নাম</Label>
              <Input
                id="distant_market_name"
                value={formData.distant_market_name}
                onChange={(e) => updateFormData({ distant_market_name: e.target.value })}
                placeholder="বাজারের নাম"
              />
            </div>

            <div>
              <Label htmlFor="distant_market_distance">দূরত্ব (কিলোমিটার)</Label>
              <Input
                id="distant_market_distance"
                type="number"
                step="0.1"
                value={formData.distant_market_distance}
                onChange={(e) => updateFormData({ distant_market_distance: e.target.value })}
                placeholder="কিমি"
              />
            </div>

            <div>
              <Label htmlFor="profitable_market">কোন বাজার বেশি লাভজনক?</Label>
              <Select
                value={formData.profitable_market}
                onValueChange={(value) => updateFormData({ profitable_market: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="স্থানীয়">স্থানীয় বাজার</SelectItem>
                  <SelectItem value="দূরবর্তী">দূরবর্তী বাজার</SelectItem>
                  <SelectItem value="সমান">উভয়ই সমান</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transport_cost">পরিবহন খরচ (টাকা)</Label>
              <Input
                id="transport_cost"
                type="number"
                step="0.01"
                value={formData.transport_cost}
                onChange={(e) => updateFormData({ transport_cost: e.target.value })}
                placeholder="টাকা"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">কৃষি সহায়তা</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agricultural_officer_name">কৃষি অফিসারের নাম</Label>
              <Input
                id="agricultural_officer_name"
                value={formData.agricultural_officer_name}
                onChange={(e) => updateFormData({ agricultural_officer_name: e.target.value })}
                placeholder="অফিসারের নাম"
              />
            </div>

            <div>
              <Label htmlFor="officer_contact">যোগাযোগ নম্বর</Label>
              <Input
                id="officer_contact"
                value={formData.officer_contact}
                onChange={(e) => updateFormData({ officer_contact: e.target.value })}
                placeholder="01XXXXXXXXX"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="market_suggestions">বাজার ব্যবস্থা সাজেশন</Label>
              <Textarea
                id="market_suggestions"
                value={formData.market_suggestions}
                onChange={(e) => updateFormData({ market_suggestions: e.target.value })}
                placeholder="কৃষি অফিসারের পরামর্শ বা সরকারি সহায়তা কর্মসূচি সম্পর্কে"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">বাজার তথ্য টিপস:</h4>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>স্থানীয় ও দূরবর্তী বাজারের দাম তুলনা করুন</li>
          <li>পরিবহন খরচ হিসাব করুন</li>
          <li>কৃষি অফিসারের সাথে যোগাযোগ রাখুন</li>
          <li>সরকারি সহায়তা কর্মসূচি সম্পর্কে জানুন</li>
        </ul>
      </div>
    </div>
  );
};

export default Step5MarketInfo;
