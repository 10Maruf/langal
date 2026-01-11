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
import { AlertCircle, FileText, Camera } from "lucide-react";
import type { FieldDataFormData } from '@/pages/DataOperatorFieldDataCollectionNew';

interface Step7Props {
  formData: FieldDataFormData;
  updateFormData: (updates: Partial<FieldDataFormData>) => void;
}

const CHALLENGES = [
  'আবহাওয়া সমস্যা',
  'পানির অভাব',
  'শ্রমিক সংকট',
  'বাজার প্রবেশ',
  'দাম পতন',
  'সংরক্ষণ সমস্যা',
  'কীট আক্রমণ',
  'রোগবালাই',
];

const Step7AdditionalInfo: React.FC<Step7Props> = ({ formData, updateFormData }) => {
  const toggleChallenge = (challenge: string) => {
    const current = formData.challenges || [];
    const updated = current.includes(challenge)
      ? current.filter(c => c !== challenge)
      : [...current, challenge];
    updateFormData({ challenges: updated });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5" />
            রোগ ও কীট আক্রমণ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="disease_name">রোগের নাম</Label>
              <Input
                id="disease_name"
                value={formData.disease_name}
                onChange={(e) => updateFormData({ disease_name: e.target.value })}
                placeholder="যেমন: পাতা পোড়া, ব্লাস্ট"
              />
            </div>

            <div>
              <Label htmlFor="pest_attack">কীট আক্রমণ</Label>
              <Input
                id="pest_attack"
                value={formData.pest_attack}
                onChange={(e) => updateFormData({ pest_attack: e.target.value })}
                placeholder="যেমন: মাজরা পোকা, পামরী পোকা"
              />
            </div>

            <div>
              <Label htmlFor="severity_level">তীব্রতার স্তর</Label>
              <Select
                value={formData.severity_level}
                onValueChange={(value) => updateFormData({ severity_level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="মৃদু">মৃদু</SelectItem>
                  <SelectItem value="মাঝারি">মাঝারি</SelectItem>
                  <SelectItem value="তীব্র">তীব্র</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">সমস্যা ও চ্যালেঞ্জ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>প্রধান চ্যালেঞ্জসমূহ (একাধিক নির্বাচন করুন)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {CHALLENGES.map((challenge) => (
                  <div key={challenge} className="flex items-center space-x-2">
                    <Checkbox
                      id={challenge}
                      checked={formData.challenges?.includes(challenge)}
                      onCheckedChange={() => toggleChallenge(challenge)}
                    />
                    <label
                      htmlFor={challenge}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {challenge}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">কৃষক সংক্রান্ত তথ্য</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="farmer_education">শিক্ষাগত যোগ্যতা</Label>
              <Select
                value={formData.farmer_education}
                onValueChange={(value) => updateFormData({ farmer_education: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="অশিক্ষিত">অশিক্ষিত</SelectItem>
                  <SelectItem value="প্রাথমিক">প্রাথমিক</SelectItem>
                  <SelectItem value="মাধ্যমিক">মাধ্যমিক</SelectItem>
                  <SelectItem value="উচ্চ মাধ্যমিক">উচ্চ মাধ্যমিক</SelectItem>
                  <SelectItem value="স্নাতক">স্নাতক</SelectItem>
                  <SelectItem value="স্নাতকোত্তর">স্নাতকোত্তর</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="farming_experience">কৃষিকাজের অভিজ্ঞতা (বছর)</Label>
              <Input
                id="farming_experience"
                type="number"
                value={formData.farming_experience}
                onChange={(e) => updateFormData({ farming_experience: e.target.value })}
                placeholder="বছর"
              />
            </div>

            <div>
              <Label htmlFor="training_received">প্রশিক্ষণ নিয়েছেন?</Label>
              <Select
                value={formData.training_received}
                onValueChange={(value) => updateFormData({ training_received: value })}
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
              <Label htmlFor="bank_loan_taken">ব্যাংক ঋণ নিয়েছেন?</Label>
              <Select
                value={formData.bank_loan_taken}
                onValueChange={(value) => updateFormData({ bank_loan_taken: value })}
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

            {formData.bank_loan_taken === 'yes' && (
              <div>
                <Label htmlFor="loan_amount">ঋণের পরিমাণ (টাকা)</Label>
                <Input
                  id="loan_amount"
                  type="number"
                  value={formData.loan_amount}
                  onChange={(e) => updateFormData({ loan_amount: e.target.value })}
                  placeholder="টাকা"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            অতিরিক্ত মন্তব্য ও নোট
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">বিশেষ মন্তব্য বা পর্যবেক্ষণ</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateFormData({ notes: e.target.value })}
                placeholder="ডাটা অপারেটরের পর্যবেক্ষণ, কৃষকের মতামত, বিশেষ কোনো তথ্য..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="follow_up_required">ফলোআপ প্রয়োজন?</Label>
                <Select
                  value={formData.follow_up_required}
                  onValueChange={(value) => updateFormData({ follow_up_required: value })}
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

              {formData.follow_up_required === 'yes' && (
                <div>
                  <Label htmlFor="follow_up_date">ফলোআপ তারিখ</Label>
                  <Input
                    id="follow_up_date"
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) => updateFormData({ follow_up_date: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
          <Camera className="h-5 w-5" />
          সংযুক্তি (ভবিষ্যতে যুক্ত হবে)
        </h4>
        <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
          <li>ছবি সংযুক্তি (জমি, ফসল, রোগ)</li>
          <li>ভয়েস নোট (কৃষকের মতামত)</li>
          <li>ডকুমেন্ট (মাটি পরীক্ষার রিপোর্ট)</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">শেষ ধাপ:</h4>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>সব তথ্য যাচাই করুন</li>
          <li>প্রয়োজনীয় মন্তব্য যোগ করুন</li>
          <li>"সম্পূর্ণ করুন" বাটনে ক্লিক করে ডেটা জমা দিন</li>
        </ul>
      </div>
    </div>
  );
};

export default Step7AdditionalInfo;
