import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle2, Save } from "lucide-react";
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DataOperatorHeader from '@/components/data-operator/DataOperatorHeader';

// Import step components
import Step1BasicInfo from '@/components/field-data-collection/Step1BasicInfo';
import Step2LandDetails from '@/components/field-data-collection/Step2LandDetails';
import Step3CropInfo from '@/components/field-data-collection/Step3CropInfo';
import Step4FertilizerPesticide from '@/components/field-data-collection/Step4FertilizerPesticide';
import Step5MarketInfo from '@/components/field-data-collection/Step5MarketInfo';
import Step6FinancialInfo from '@/components/field-data-collection/Step6FinancialInfo';
import Step7AdditionalInfo from '@/components/field-data-collection/Step7AdditionalInfo';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export interface FieldDataFormData {
  // Step 1: Farmer Information (Manual Entry)
  farmer_name: string;
  farmer_phone: string;
  farmer_address: string;

  manual_farmer_name?: string;
  manual_farmer_nid?: string;
  manual_farmer_phone?: string;
  manual_farmer_email?: string;
  manual_farmer_dob?: string;
  manual_farmer_father?: string;
  manual_farmer_mother?: string;
  manual_farmer_address?: string;
  manual_farmer_district?: string;
  manual_farmer_upazila?: string;
  manual_farmer_occupation?: string;
  manual_farmer_land?: string;

  // Location fields from LocationSelector
  division?: string;
  division_bn?: string;
  district?: string;
  district_bn?: string;
  upazila?: string;
  upazila_bn?: string;
  post_office?: string;
  post_office_bn?: string;

  // Common fields
  village: string;
  postal_code: string;
  collection_date: string;

  // Step 2: Land Details
  total_land: string;
  cultivable_land: string;
  land_size_unit: string;
  land_ownership_type: string;
  is_cultivable: string;
  number_of_plots: string;
  irrigation_facility: string;
  irrigation_status: string;

  // Step 3: Crop Information
  primary_crops: string[];
  secondary_crops: string;
  crop_type: string;
  season: string;
  crop_frequency: string;
  crop_rotation: string;
  seeds_source: string;
  seed_dealers: string;
  production_amount: string;
  production_unit: string;

  // Step 4: Fertilizer & Pesticide
  urea_amount: string;
  tsp_amount: string;
  mp_amount: string;
  dap_amount: string;
  gypsum_amount: string;
  zinc_amount: string;
  cow_dung: string;
  compost: string;
  vermicompost: string;
  organic_fertilizer_application: string;
  insecticide_names: string;
  fungicide_names: string;
  herbicide_names: string;
  pesticide_usage_amount: string;
  fertilizer_dealers: string;
  pesticide_dealers: string;

  // Step 5: Market Information
  market_price: string;
  current_market_price: string;
  expected_price: string;
  local_market_name: string;
  local_market_distance: string;
  distant_market_name: string;
  distant_market_distance: string;
  profitable_market: string;
  transport_cost: string;
  agricultural_officer_name: string;
  officer_contact: string;
  market_suggestions: string;

  // Step 6: Financial Information
  seed_cost: string;
  fertilizer_cost: string;
  pesticide_cost: string;
  labor_cost: string;
  irrigation_cost: string;
  land_preparation_cost: string;
  equipment_rent: string;
  transport_cost_production: string;
  total_expenses: string;
  total_production: string;
  sold_quantity: string;
  sale_price: string;
  total_income: string;
  net_profit: string;

  // Step 7: Additional Information
  disease_name: string;
  pest_attack: string;
  severity_level: string;
  challenges: string[];
  farmer_education: string;
  farming_experience: string;
  training_received: string;
  bank_loan_taken: string;
  loan_amount: string;
  notes: string;
  follow_up_required: string;
  follow_up_date: string;

  // Legacy fields
  livestock_info: string;
  land_service_date: string;
  tree_fertilizer_info: string;
  ph_value: string;
  crop_calculation: string;
  available_resources: string;
  seminar_name: string;
  identity_number: string;
  collection_year: string;
}

const STEPS = [
  { id: 1, title: 'মৌলিক তথ্য', titleEn: 'Basic Info' },
  { id: 2, title: 'জমির বিবরণ', titleEn: 'Land Details' },
  { id: 3, title: 'ফসল তথ্য', titleEn: 'Crop Info' },
  { id: 4, title: 'সার ও কীটনাশক', titleEn: 'Fertilizer' },
  { id: 5, title: 'বাজার তথ্য', titleEn: 'Market Info' },
  { id: 6, title: 'আর্থিক তথ্য', titleEn: 'Financial' },
  { id: 7, title: 'অতিরিক্ত তথ্য', titleEn: 'Additional' },
];

const DataOperatorFieldDataCollectionNew = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FieldDataFormData>({
    // Step 1 - Farmer info
    farmer_name: '',
    farmer_phone: '',
    farmer_address: '',

    // Manual farmer details
    manual_farmer_name: '',
    manual_farmer_nid: '',
    manual_farmer_phone: '',
    manual_farmer_email: '',
    manual_farmer_dob: '',
    manual_farmer_father: '',
    manual_farmer_mother: '',
    manual_farmer_address: '',
    manual_farmer_district: '',
    manual_farmer_upazila: '',
    manual_farmer_occupation: 'কৃষক',
    manual_farmer_land: '',

    // Location fields
    division: '',
    division_bn: '',
    district: '',
    district_bn: '',
    upazila: '',
    upazila_bn: '',
    post_office: '',
    post_office_bn: '',

    village: '',
    postal_code: '',
    collection_date: new Date().toISOString().split('T')[0],

    // Step 2
    total_land: '',
    cultivable_land: '',
    land_size_unit: 'decimal',
    land_ownership_type: '',
    is_cultivable: 'yes',
    number_of_plots: '',
    irrigation_facility: 'yes',
    irrigation_status: '',

    // Step 3
    primary_crops: [],
    secondary_crops: '',
    crop_type: '',
    season: '',
    crop_frequency: '',
    crop_rotation: '',
    seeds_source: '',
    seed_dealers: '',
    production_amount: '',
    production_unit: 'kg',

    // Step 4
    urea_amount: '',
    tsp_amount: '',
    mp_amount: '',
    dap_amount: '',
    gypsum_amount: '',
    zinc_amount: '',
    cow_dung: '',
    compost: '',
    vermicompost: '',
    organic_fertilizer_application: '',
    insecticide_names: '',
    fungicide_names: '',
    herbicide_names: '',
    pesticide_usage_amount: '',
    fertilizer_dealers: '',
    pesticide_dealers: '',

    // Step 5
    market_price: '',
    current_market_price: '',
    expected_price: '',
    local_market_name: '',
    local_market_distance: '',
    distant_market_name: '',
    distant_market_distance: '',
    profitable_market: '',
    transport_cost: '',
    agricultural_officer_name: '',
    officer_contact: '',
    market_suggestions: '',

    // Step 6
    seed_cost: '',
    fertilizer_cost: '',
    pesticide_cost: '',
    labor_cost: '',
    irrigation_cost: '',
    land_preparation_cost: '',
    equipment_rent: '',
    transport_cost_production: '',
    total_expenses: '',
    total_production: '',
    sold_quantity: '',
    sale_price: '',
    total_income: '',
    net_profit: '',

    // Step 7
    disease_name: '',
    pest_attack: '',
    severity_level: '',
    challenges: [],
    farmer_education: '',
    farming_experience: '',
    training_received: 'no',
    bank_loan_taken: 'no',
    loan_amount: '',
    notes: '',
    follow_up_required: 'no',
    follow_up_date: '',

    // Legacy
    livestock_info: '',
    land_service_date: '',
    tree_fertilizer_info: '',
    ph_value: '',
    crop_calculation: '',
    available_resources: '',
    seminar_name: '',
    identity_number: '',
    collection_year: new Date().getFullYear().toString(),
  });

  const progress = (currentStep / STEPS.length) * 100;

  const updateFormData = useCallback((updates: Partial<FieldDataFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    // Validate farmer info
    if (!formData.manual_farmer_name || !formData.manual_farmer_phone) {
      toast({
        title: "তথ্য অসম্পূর্ণ",
        description: "কৃষকের নাম এবং ফোন নম্বর প্রয়োজন",
        variant: "destructive",
      });
      setCurrentStep(1);
      return;
    }

    // Validate location
    if (!formData.postal_code || !formData.division) {
      toast({
        title: "তথ্য অসম্পূর্ণ",
        description: "অনুগ্রহ করে অবস্থান নির্বাচন করুন",
        variant: "destructive",
      });
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    try {
      // Prepare data for field data submission (merged table)
      const submitData = {
        // Farmer info (directly in field_data_collection)
        farmer_name: formData.manual_farmer_name,
        farmer_phone: formData.manual_farmer_phone,
        farmer_nid: formData.manual_farmer_nid,
        farmer_email: formData.manual_farmer_email,
        farmer_dob: formData.manual_farmer_dob,
        farmer_father: formData.manual_farmer_father,
        farmer_mother: formData.manual_farmer_mother,
        farmer_occupation: formData.manual_farmer_occupation,
        farmer_land_ownership: formData.manual_farmer_land,
        farmer_address: formData.manual_farmer_address || formData.farmer_address,

        // Location info from LocationSelector
        division: formData.division,
        division_bn: formData.division_bn,
        district: formData.district,
        district_bn: formData.district_bn,
        upazila: formData.upazila,
        upazila_bn: formData.upazila_bn,
        post_office: formData.post_office,
        post_office_bn: formData.post_office_bn,
        village: formData.village,
        postal_code: formData.postal_code,

        // Land Details
        land_size: formData.total_land,
        land_size_unit: formData.land_size_unit,
        irrigation_status: formData.irrigation_status,

        // Crop Info
        crop_type: formData.crop_type,
        season: formData.season,
        production_amount: formData.production_amount,
        production_unit: formData.production_unit,

        // Fertilizer info
        organic_fertilizer_application: formData.organic_fertilizer_application,
        fertilizer_application: [
          formData.urea_amount && `ইউরিয়া: ${formData.urea_amount}`,
          formData.tsp_amount && `টিএসপি: ${formData.tsp_amount}`,
          formData.mp_amount && `এমপি: ${formData.mp_amount}`,
          formData.dap_amount && `ডিএপি: ${formData.dap_amount}`,
        ].filter(Boolean).join(', '),

        // Market & financial info
        market_price: formData.market_price,
        expenses: formData.total_expenses,

        // Additional info
        notes: formData.notes,
        collection_year: formData.collection_year,
      };

      const response = await axios.post(
        `${API_URL}/api/field-data`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        toast({
          title: "সফল!",
          description: "ফিল্ড ডেটা সফলভাবে সংরক্ষণ করা হয়েছে",
        });

        // Navigate back to dashboard
        setTimeout(() => {
          navigate('/data-operator-dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting field data:', error);
      const axiosError = error as { response?: { data?: { message_bn?: string } } };
      toast({
        title: "জমা দিতে ব্যর্থ",
        description: axiosError.response?.data?.message_bn || "ফিল্ড ডেটা সংরক্ষণ করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step2LandDetails formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <Step3CropInfo formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <Step4FertilizerPesticide formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <Step5MarketInfo formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <Step6FinancialInfo formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <Step7AdditionalInfo formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DataOperatorHeader />

      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/data-operator-dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ফিল্ড ডেটা সংগ্রহ</h1>
                <p className="text-gray-600">মাঠ থেকে সম্পূর্ণ কৃষি তথ্য সংগ্রহ করুন</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  ধাপ {currentStep} / {STEPS.length}
                </span>
                <span className="text-sm font-medium text-green-600">
                  {Math.round(progress)}% সম্পন্ন
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-7 gap-2">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`p-3 rounded-lg text-center transition-all ${currentStep === step.id
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : currentStep > step.id
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${currentStep === step.id
                        ? 'bg-white text-green-600'
                        : currentStep > step.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                      {currentStep > step.id ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-bold">{step.id}</span>
                      )}
                    </div>
                    <span className="text-xs font-medium hidden md:block">{step.title}</span>
                    <span className="text-[10px] text-gray-500 hidden lg:block">{step.titleEn}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700">
              {STEPS[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            পূর্ববর্তী
          </Button>

          <div className="flex gap-4">
            <Button
              onClick={() => {
                toast({
                  title: "ড্রাফট সংরক্ষিত",
                  description: "আপনার তথ্য ড্রাফট হিসেবে সংরক্ষণ করা হয়েছে",
                });
              }}
              variant="outline"
              size="lg"
            >
              <Save className="mr-2 h-4 w-4" />
              ড্রাফট সংরক্ষণ
            </Button>

            {currentStep < STEPS.length ? (
              <Button
                onClick={nextStep}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                পরবর্তী
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    জমা দেওয়া হচ্ছে...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    সম্পূর্ণ করুন
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataOperatorFieldDataCollectionNew;
