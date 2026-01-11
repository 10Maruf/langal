import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Search, Loader2, MapPin, User, CheckCircle, UserPlus } from "lucide-react";
import axios from 'axios';
import type { FieldDataFormData } from '@/pages/DataOperatorFieldDataCollectionNew';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

interface Farmer {
  user_id: number;
  phone_number: string;
  full_name: string;
  village?: string;
  post_office?: string;
}

interface Step1Props {
  formData: FieldDataFormData;
  updateFormData: (updates: Partial<FieldDataFormData>) => void;
}

const Step1BasicInfo: React.FC<Step1Props> = ({ formData, updateFormData }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('search');
  const [farmerSearch, setFarmerSearch] = useState('');
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [searchingFarmer, setSearchingFarmer] = useState(false);

  const districts = [
    "ঢাকা", "চট্টগ্রাম", "সিলেট", "কুমিল্লা", "রংপুর", "বরিশাল",
    "খুলনা", "ময়মনসিংহ", "রাজশাহী", "গাজীপুর"
  ];

  const searchFarmers = async () => {
    if (!farmerSearch.trim()) {
      toast({
        title: "খালি সার্চ",
        description: "দয়া করে ফোন নম্বর বা নাম দিয়ে সার্চ করুন",
        variant: "destructive",
      });
      return;
    }

    setSearchingFarmer(true);
    try {
      const response = await axios.get(`${API_URL}/api/data-operator/farmers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        params: {
          search: farmerSearch,
        }
      });

      if (response.data.success) {
        setFarmers(response.data.data || []);
        if (response.data.data.length === 0) {
          toast({
            title: "কৃষক পাওয়া যায়নি",
            description: "এই নম্বর বা নামে কোনো কৃষক পাওয়া যায়নি",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error searching farmers:', error);
      toast({
        title: "সার্চ ব্যর্থ",
        description: "কৃষক সার্চ করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setSearchingFarmer(false);
    }
  };

  const selectFarmer = (farmer: Farmer) => {
    updateFormData({
      farmer_id: farmer.user_id,
      farmer_name: farmer.full_name || '',
      farmer_phone: farmer.phone_number,
      village: farmer.village || '',
      postal_code: farmer.post_office || '',
      manual_farmer_id: undefined,
      manual_farmer_name: '',
      manual_farmer_phone: '',
    });
    setFarmers([]);
    setFarmerSearch('');

    toast({
      title: "কৃষক নির্বাচিত",
      description: `${farmer.full_name} নির্বাচন করা হয়েছে`,
    });
  };



  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">
            <Search className="h-4 w-4 mr-2" />
            কৃষক খুঁজুন
          </TabsTrigger>
          <TabsTrigger value="manual">
            <UserPlus className="h-4 w-4 mr-2" />
            নতুন কৃষক এন্ট্রি
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                কৃষক অনুসন্ধান ও নির্বাচন
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="ফোন নম্বর বা নাম দিয়ে সার্চ করুন"
                    value={farmerSearch}
                    onChange={(e) => setFarmerSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchFarmers()}
                    className="flex-1"
                  />
                  <Button onClick={searchFarmers} disabled={searchingFarmer}>
                    {searchingFarmer ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    <span className="ml-2">সার্চ</span>
                  </Button>
                </div>

                {farmers.length > 0 && (
                  <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                    {farmers.map((farmer) => (
                      <div
                        key={farmer.user_id}
                        className="p-4 hover:bg-green-50 cursor-pointer transition-colors"
                        onClick={() => selectFarmer(farmer)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {farmer.full_name || 'নাম নেই'}
                            </div>
                            <div className="text-sm text-gray-600">{farmer.phone_number}</div>
                            {farmer.village && (
                              <div className="text-xs text-gray-500 mt-1">
                                {farmer.village}
                              </div>
                            )}
                          </div>
                          <Button size="sm" variant="ghost">
                            নির্বাচন করুন
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {formData.farmer_id && formData.farmer_id > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      <div className="flex-1">
                        <div className="font-semibold text-green-900">নির্বাচিত কৃষক:</div>
                        <div className="text-sm mt-1">{formData.farmer_name}</div>
                        <div className="text-sm text-gray-600">{formData.farmer_phone}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="h-5 w-5" />
                নতুন কৃষক তথ্য এন্ট্রি
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
                      onChange={(e) => updateFormData({
                        manual_farmer_name: e.target.value,
                        farmer_id: undefined
                      })}
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
                    <Label htmlFor="manual_farmer_email">ইমেইল (ঐচ্ছিক)</Label>
                    <Input
                      id="manual_farmer_email"
                      type="email"
                      value={formData.manual_farmer_email || ''}
                      onChange={(e) => updateFormData({ manual_farmer_email: e.target.value })}
                      placeholder="example@email.com"
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
                </div>

                <h3 className="text-md font-medium border-b pb-2 mt-4">ঠিকানা</h3>

                <div>
                  <Label htmlFor="manual_farmer_address">বিস্তারিত ঠিকানা</Label>
                  <Textarea
                    id="manual_farmer_address"
                    value={formData.manual_farmer_address || ''}
                    onChange={(e) => updateFormData({ manual_farmer_address: e.target.value })}
                    placeholder="গ্রাম, ওয়ার্ড, ডাকঘর, পোস্ট কোড"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manual_farmer_district">জেলা</Label>
                    <Select
                      value={formData.manual_farmer_district || ''}
                      onValueChange={(value) => updateFormData({ manual_farmer_district: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="জেলা নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="manual_farmer_upazila">উপজেলা</Label>
                    <Input
                      id="manual_farmer_upazila"
                      value={formData.manual_farmer_upazila || ''}
                      onChange={(e) => updateFormData({ manual_farmer_upazila: e.target.value })}
                      placeholder="উপজেলার নাম"
                    />
                  </div>
                </div>

                <h3 className="text-md font-medium border-b pb-2 mt-4">পেশাগত তথ্য</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manual_farmer_occupation">পেশা</Label>
                    <Select
                      value={formData.manual_farmer_occupation || 'কৃষক'}
                      onValueChange={(value) => updateFormData({ manual_farmer_occupation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="পেশা নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="কৃষক">কৃষক</SelectItem>
                        <SelectItem value="কৃষি উদ্যোক্তা">কৃষি উদ্যোক্তা</SelectItem>
                        <SelectItem value="পশুপালনকারী">পশুপালনকারী</SelectItem>
                        <SelectItem value="মৎস্যচাষী">মৎস্যচাষী</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <div className="font-semibold text-blue-900">নতুন কৃষক তথ্য প্রস্তুত:</div>
                        <div className="text-sm mt-1">{formData.manual_farmer_name}</div>
                        <div className="text-sm text-gray-600">{formData.manual_farmer_phone}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            অবস্থান তথ্য
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="village">গ্রাম/এলাকা</Label>
              <Input
                id="village"
                value={formData.village}
                onChange={(e) => updateFormData({ village: e.target.value })}
                placeholder="গ্রামের নাম"
              />
            </div>

            <div>
              <Label htmlFor="postal_code">পোস্টাল কোড</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => updateFormData({ postal_code: e.target.value })}
                placeholder="পোস্ট অফিসের কোড"
              />
            </div>

            <div>
              <Label htmlFor="collection_date">সংগ্রহের তারিখ</Label>
              <Input
                id="collection_date"
                type="date"
                value={formData.collection_date}
                onChange={(e) => updateFormData({ collection_date: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">নির্দেশনা:</h4>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>বিদ্যমান কৃষক থাকলে "কৃষক খুঁজুন" ট্যাব ব্যবহার করুন</li>
          <li>নতুন কৃষক হলে "নতুন কৃষক এন্ট্রি" ট্যাব ব্যবহার করুন</li>
          <li>সব তথ্য সঠিকভাবে যাচাই করুন</li>
          <li>পরবর্তী ধাপে যেতে "পরবর্তী" বাটনে ক্লিক করুন</li>
        </ul>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
