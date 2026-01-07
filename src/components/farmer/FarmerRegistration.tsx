import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Upload, Camera, IdCard, Phone, Calendar, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/services/api";
import { AxiosError } from "axios";
import {
    banglaToEnglish,
    englishToBangla,
    isBanglaText,
    isBanglaNumber,
    formatBanglaNumberInput,
    parseBanglaNumber,
    farmSizeUnits,
    farmTypes,
    validateBanglaInput,
    validateBanglaNumber
} from "@/lib/banglaUtils";
import LocationSelector from "@/components/farmer/LocationSelector"; interface InitialData {
    phone: string;
    nidNumber: string;
    krishiCardNumber: string;
    documentType: 'nid' | 'krishi';
    dateOfBirth: string;
}

interface DocumentData {
    frontImage: File | null;
    backImage: File | null;
}

interface ParsedData {
    fullName: string;
    address: string;
    dateOfBirth: string;
    nidNumber: string;
    fatherName: string;
    motherName: string;
}

interface LocationData {
    division: string;
    division_bn: string;
    district: string;
    district_bn: string;
    upazila: string;
    upazila_bn: string;
    post_office: string;
    post_office_bn: string;
    postal_code: number;
    village: string;
}

interface FarmerFormData {
    fullName: string;
    fatherName: string;
    motherName: string;
    address: string;
    dateOfBirth: string;
    farmSize: string; // Will store Bangla number, converted to English before sending
    farmSizeUnit: 'bigha' | 'katha' | 'acre';
    farmType: string;
    customFarmType: string; // For custom input when "অন্যান্য" is selected
    experience: string; // Bangla number (years)
    profilePhoto: File | null;
    location: LocationData | null;
}

type RegistrationStep = 'initial' | 'documents' | 'form' | 'otp' | 'success';

interface FarmerRegistrationProps {
    onBack?: () => void;
}

const FarmerRegistration = ({ onBack }: FarmerRegistrationProps) => {
    const [currentStep, setCurrentStep] = useState<RegistrationStep>('initial');
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');

    const [initialData, setInitialData] = useState<InitialData>({
        phone: '',
        nidNumber: '',
        krishiCardNumber: '',
        documentType: 'nid',
        dateOfBirth: ''
    });

    const [documentData, setDocumentData] = useState<DocumentData>({
        frontImage: null,
        backImage: null
    });

    const [parsedData, setParsedData] = useState<ParsedData>({
        fullName: '',
        address: '',
        dateOfBirth: '',
        nidNumber: '',
        fatherName: '',
        motherName: ''
    });

    const [farmerFormData, setFarmerFormData] = useState<FarmerFormData>({
        fullName: '',
        fatherName: '',
        motherName: '',
        address: '',
        dateOfBirth: '',
        farmSize: '',
        farmSizeUnit: 'bigha',
        farmType: '',
        customFarmType: '',
        experience: '',
        profilePhoto: null,
        location: null
    });

    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

    const navigate = useNavigate();
    const { setAuthUser, login } = useAuth();
    const { toast } = useToast();
    const frontImageRef = useRef<HTMLInputElement>(null);
    const backImageRef = useRef<HTMLInputElement>(null);
    const profilePhotoRef = useRef<HTMLInputElement>(null);

    const handleInitialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!initialData.phone || !initialData.dateOfBirth) {
            toast({
                title: "ত্রুটি",
                description: "অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন",
                variant: "destructive",
            });
            return;
        }

        // Check if at least one of NID or Krishi Card is provided
        if (!initialData.nidNumber && !initialData.krishiCardNumber) {
            toast({
                title: "ত্রুটি",
                description: "এনআইডি নম্বর অথবা কৃষি কার্ড নম্বর দিতে হবে",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Simulate verification process
            await new Promise(resolve => setTimeout(resolve, 1000));

            // For prototype mode - skip document scanning, go directly to form
            toast({
                title: "যাচাইকরণ সফল",
                description: "এখন আপনার তথ্য পূরণ করুন",
            });
            setCurrentStep('form'); // Skip 'documents' step, go directly to 'form'

        } catch (error) {
            console.error(error);
            toast({
                title: "ত্রুটি",
                description: "যাচাইকরণে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const verifyInitialData = async (data: InitialData): Promise<boolean> => {
        // Simulate API call for verification
        // In real implementation, this would verify with government database
        return true;
    };

    const handleDocumentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!documentData.frontImage || !documentData.backImage) {
            toast({
                title: "ত্রুটি",
                description: "অনুগ্রহ করে কাগজপত্রের উভয় পাশের ছবি আপলোড করুন",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Simulate OCR processing
            await new Promise(resolve => setTimeout(resolve, 3000));

            const parsed = await parseDocumentImages(documentData);
            setParsedData(parsed);

            // Auto-fill form data
            setFarmerFormData(prev => ({
                ...prev,
                fullName: parsed.fullName,
                fatherName: parsed.fatherName,
                motherName: parsed.motherName,
                address: parsed.address,
                dateOfBirth: parsed.dateOfBirth
            }));

            toast({
                title: "তথ্য সংগ্রহ সফল",
                description: "কাগজপত্র থেকে তথ্য সংগ্রহ করা হয়েছে। অতিরিক্ত তথ্য পূরণ করুন",
            });

            setCurrentStep('form');
        } catch (error) {
            console.error(error);
            toast({
                title: "ত্রুটি",
                description: "কাগজপত্র পড়তে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const parseDocumentImages = async (documents: DocumentData): Promise<ParsedData> => {
        // Simulate OCR parsing
        // In real implementation, this would use OCR service
        return {
            fullName: "মোহাম্মদ রহিম উদ্দিন",
            address: "গ্রাম: রামপুর, পোস্ট: রামপুর, উপজেলা: সাভার, জেলা: ঢাকা",
            dateOfBirth: initialData.dateOfBirth,
            nidNumber: initialData.documentType === 'nid' ? initialData.nidNumber : '',
            fatherName: "মোহাম্মদ করিম উদ্দিন",
            motherName: "ফাতেমা খাতুন"
        };
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!farmerFormData.fullName || !farmerFormData.farmSize || !farmerFormData.farmType ||
            !farmerFormData.experience || !farmerFormData.profilePhoto) {
            toast({
                title: "ত্রুটি",
                description: "অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন",
                variant: "destructive",
            });
            return;
        }

        // Validate Bangla text inputs
        const nameError = validateBanglaInput(farmerFormData.fullName, "পূর্ণ নাম");
        if (nameError) {
            toast({ title: "ত্রুটি", description: nameError, variant: "destructive" });
            return;
        }

        if (farmerFormData.fatherName) {
            const fatherNameError = validateBanglaInput(farmerFormData.fatherName, "পিতার নাম");
            if (fatherNameError) {
                toast({ title: "ত্রুটি", description: fatherNameError, variant: "destructive" });
                return;
            }
        }

        if (farmerFormData.motherName) {
            const motherNameError = validateBanglaInput(farmerFormData.motherName, "মাতার নাম");
            if (motherNameError) {
                toast({ title: "ত্রুটি", description: motherNameError, variant: "destructive" });
                return;
            }
        }

        if (farmerFormData.address) {
            const addressError = validateBanglaInput(farmerFormData.address, "ঠিকানা");
            if (addressError) {
                toast({ title: "ত্রুটি", description: addressError, variant: "destructive" });
                return;
            }
        }

        // Validate Bangla numbers
        const farmSizeError = validateBanglaNumber(farmerFormData.farmSize, "জমির পরিমাণ");
        if (farmSizeError) {
            toast({ title: "ত্রুটি", description: farmSizeError, variant: "destructive" });
            return;
        }

        const experienceError = validateBanglaNumber(farmerFormData.experience, "অভিজ্ঞতা");
        if (experienceError) {
            toast({ title: "ত্রুটি", description: experienceError, variant: "destructive" });
            return;
        }

        // Validate custom farm type if "অন্যান্য" is selected
        if (farmerFormData.farmType === 'অন্যান্য' && !farmerFormData.customFarmType) {
            toast({
                title: "ত্রুটি",
                description: "চাষের ধরণ উল্লেখ করুন",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Send OTP via API
            const response = await api.post('/farmer/send-otp', {
                phone: initialData.phone,
                purpose: 'register'
            });

            if (response.data.success) {
                toast({
                    title: "OTP পাঠানো হয়েছে",
                    description: `আপনার ${initialData.phone} নম্বরে OTP পাঠানো হয়েছে`,
                });

                // For dev/demo purposes, save and display the OTP
                if (response.data.data.otp_code) {
                    console.log("Dev OTP:", response.data.data.otp_code);
                    setGeneratedOtp(response.data.data.otp_code);
                }

                setCurrentStep('otp');
            } else {
                throw new Error(response.data.message || 'OTP sending failed');
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast({
                title: "ত্রুটি",
                description: axiosError.response?.data?.message || "OTP পাঠাতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/farmer/send-otp', {
                phone: initialData.phone,
                purpose: 'register'
            });

            if (response.data.success) {
                toast({
                    title: "OTP পুনরায় পাঠানো হয়েছে",
                    description: `আপনার ${initialData.phone} নম্বরে নতুন OTP পাঠানো হয়েছে`,
                });

                if (response.data.data.otp_code) {
                    console.log("Dev OTP:", response.data.data.otp_code);
                    setGeneratedOtp(response.data.data.otp_code);
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string; data?: { otp_code?: string } }>;
            toast({
                title: "ত্রুটি",
                description: axiosError.response?.data?.message || "OTP পুনরায় পাঠাতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const completeRegistration = async (): Promise<void> => {
        const formData = new FormData();

        // Convert Bangla numbers to English before sending
        const farmSizeEnglish = banglaToEnglish(farmerFormData.farmSize);
        const experienceEnglish = banglaToEnglish(farmerFormData.experience);

        // Determine final farm type (use custom if "অন্যান্য" is selected)
        const finalFarmType = farmerFormData.farmType === 'অন্যান্য'
            ? farmerFormData.customFarmType
            : farmerFormData.farmType;

        // Append all text fields
        formData.append('phone', initialData.phone);
        formData.append('otp_code', otp);
        formData.append('fullName', farmerFormData.fullName);
        formData.append('fatherName', farmerFormData.fatherName || '');
        formData.append('motherName', farmerFormData.motherName || '');
        formData.append('address', farmerFormData.address || '');
        formData.append('dateOfBirth', initialData.dateOfBirth);

        // Send location data (postal code and other location details)
        if (farmerFormData.location) {
            formData.append('postal_code', farmerFormData.location.postal_code.toString());
            formData.append('division', farmerFormData.location.division || '');
            formData.append('division_bn', farmerFormData.location.division_bn || '');
            formData.append('district', farmerFormData.location.district || '');
            formData.append('district_bn', farmerFormData.location.district_bn || '');
            formData.append('upazila', farmerFormData.location.upazila || '');
            formData.append('upazila_bn', farmerFormData.location.upazila_bn || '');
            formData.append('village', farmerFormData.location.village || '');
        }

        // Send NID or Krishi card based on what was provided
        if (initialData.nidNumber) {
            formData.append('nidNumber', initialData.nidNumber);
        }
        if (initialData.krishiCardNumber) {
            formData.append('krishiCardNumber', initialData.krishiCardNumber);
        }

        // Send farm data with English numbers
        formData.append('farmSize', farmSizeEnglish);
        formData.append('farmSizeUnit', farmerFormData.farmSizeUnit);
        formData.append('farmType', finalFarmType);
        formData.append('experience', experienceEnglish);

        // Append files
        if (farmerFormData.profilePhoto) {
            formData.append('profilePhoto', farmerFormData.profilePhoto);
            console.log('[FarmerRegistration] Profile photo appended:', farmerFormData.profilePhoto.name, farmerFormData.profilePhoto.size);
        } else {
            console.warn('[FarmerRegistration] No profile photo to upload!');
        }

        // Note: Document images are not yet handled by backend, but we can send them if needed
        // if (documentData.frontImage) formData.append('documentFront', documentData.frontImage);
        // if (documentData.backImage) formData.append('documentBack', documentData.backImage);

        console.log('[FarmerRegistration] Sending registration request with FormData');

        // Don't set Content-Type header manually for FormData - axios will set it with proper boundary
        const response = await api.post('/farmer/register', formData);

        if (response.data.success) {
            const { user, token } = response.data.data;

            // Map backend user to frontend user format
            const authUser = {
                id: user.user_id.toString(),
                name: user.profile?.full_name || user.phone,
                type: 'farmer' as const,
                email: user.email || '',
                phone: user.phone,
                profilePhoto: user.profile?.profile_photo_url_full,
                location: user.profile?.address || 'Bangladesh',
                location_info: user.location_info || undefined
            };

            // Set user in context
            setAuthUser(authUser, token);
        } else {
            throw new Error(response.data.message || 'Registration failed');
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp) {
            toast({
                title: "ত্রুটি",
                description: "OTP কোড দিন",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Complete registration via API
            await completeRegistration();

            toast({
                title: "নিবন্ধন সম্পন্ন!",
                description: "আপনার কৃষক অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে",
            });

            setCurrentStep('success');
        } catch (error) {
            console.error("Registration Error:", error);
            const axiosError = error as AxiosError<{ message: string; errors?: Record<string, string[]> }>;

            if (axiosError.response) {
                console.error('Error Response Data:', JSON.stringify(axiosError.response.data, null, 2));
            }

            let errorMessage = "নিবন্ধন সম্পন্ন করতে সমস্যা হয়েছে";

            if (axiosError.response?.data?.errors) {
                // Extract the first validation error message
                const firstErrorKey = Object.keys(axiosError.response.data.errors)[0];
                errorMessage = axiosError.response.data.errors[firstErrorKey][0];
            } else if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            }

            toast({
                title: "ত্রুটি",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (field: 'frontImage' | 'backImage' | 'profilePhoto', file: File | null) => {
        if (field === 'profilePhoto') {
            setFarmerFormData(prev => ({ ...prev, profilePhoto: file }));

            // Create preview URL
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setProfilePhotoPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setProfilePhotoPreview(null);
            }
        } else {
            setDocumentData(prev => ({ ...prev, [field]: file }));
        }
    };

    const renderStepIndicator = () => {
        const steps = [
            { key: 'initial', label: 'প্রাথমিক তথ্য', icon: Phone },
            { key: 'documents', label: 'কাগজপত্র', icon: IdCard },
            { key: 'form', label: 'বিস্তারিত তথ্য', icon: Camera },
            { key: 'otp', label: 'OTP যাচাই', icon: CheckCircle }
        ];

        const currentStepIndex = steps.findIndex(step => step.key === currentStep);

        return (
            <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div key={step.key} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isCompleted
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : isCurrent
                                        ? 'bg-blue-500 border-blue-500 text-white'
                                        : 'bg-gray-200 border-gray-300 text-gray-500'
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`ml-2 text-sm ${isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'
                                    }`}>
                                    {step.label}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderInitialForm = () => (
        <div className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
                <Phone className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                    কৃষক নিবন্ধনের জন্য আপনার মোবাইল নম্বর এবং পরিচয়পত্রের তথ্য প্রয়োজন
                    <br />
                    {/* <span className="text-orange-600 font-medium">প্রোটোটাইপ মোড: যেকোনো তথ্য দিলেই হবে</span> */}
                </AlertDescription>
            </Alert>

            <form onSubmit={handleInitialSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">মোবাইল নম্বর *</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="যেকোনো নম্বর (যেমন: 01700000000)"
                        value={initialData.phone}
                        onChange={(e) => setInitialData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="documentType">পরিচয়পত্রের ধরণ *</Label>
                    <Select
                        value={initialData.documentType}
                        onValueChange={(value: 'nid' | 'krishi') =>
                            setInitialData(prev => ({ ...prev, documentType: value }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="পরিচয়পত্রের ধরণ নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="nid">জাতীয় পরিচয়পত্র (NID)</SelectItem>
                            <SelectItem value="krishi">কৃষি কার্ড</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {initialData.documentType === 'nid' && (
                    <div className="space-y-2">
                        <Label htmlFor="nidNumber">জাতীয় পরিচয়পত্র নম্বর *</Label>
                        <Input
                            id="nidNumber"
                            type="text"
                            placeholder="১০ বা ১৭ ডিজিটের NID"
                            value={initialData.nidNumber}
                            onChange={(e) => setInitialData(prev => ({ ...prev, nidNumber: e.target.value }))}
                            required
                        />
                    </div>
                )}

                {initialData.documentType === 'krishi' && (
                    <div className="space-y-2">
                        <Label htmlFor="krishiCardNumber">কৃষি কার্ড নম্বর *</Label>
                        <Input
                            id="krishiCardNumber"
                            type="text"
                            placeholder="কৃষি কার্ড নম্বর"
                            value={initialData.krishiCardNumber}
                            onChange={(e) => setInitialData(prev => ({ ...prev, krishiCardNumber: e.target.value }))}
                            required
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">জন্ম তারিখ *</Label>
                    <Input
                        id="dateOfBirth"
                        type="date"
                        value={initialData.dateOfBirth}
                        onChange={(e) => setInitialData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            যাচাই করা হচ্ছে...
                        </>
                    ) : (
                        <>
                            পরবর্তী ধাপ
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onBack ? onBack() : navigate('/register')}
                    className="w-full"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    ফিরে যান
                </Button>
            </form>
        </div>
    );

    const renderDocumentForm = () => (
        <div className="space-y-6">
            <Alert className="border-orange-200 bg-orange-50">
                <IdCard className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                    আপনার {initialData.documentType === 'nid' ? 'জাতীয় পরিচয়পত্র' : 'কৃষি কার্ড'} এর উভয় পাশের স্পষ্ট ছবি আপলোড করুন
                </AlertDescription>
            </Alert>

            <form onSubmit={handleDocumentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>সামনের দিকের ছবি *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <IdCard className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => frontImageRef.current?.click()}
                                className="mb-2"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                সামনের ছবি
                            </Button>
                            <input
                                ref={frontImageRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange('frontImage', e.target.files?.[0] || null)}
                            />
                            {documentData.frontImage && (
                                <p className="text-sm text-green-600">{documentData.frontImage.name}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>পিছনের দিকের ছবি *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <IdCard className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => backImageRef.current?.click()}
                                className="mb-2"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                পিছনের ছবি
                            </Button>
                            <input
                                ref={backImageRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange('backImage', e.target.files?.[0] || null)}
                            />
                            {documentData.backImage && (
                                <p className="text-sm text-green-600">{documentData.backImage.name}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep('initial')}
                        className="flex-1"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        পূর্ববর্তী
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                প্রক্রিয়া করা হচ্ছে...
                            </>
                        ) : (
                            <>
                                তথ্য সংগ্রহ করুন
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );

    const renderForm = () => (
        <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
                <Camera className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                    সব তথ্য বাংলায় পূরণ করুন। সংখ্যা বাংলায় লিখুন (০-৯)
                </AlertDescription>
            </Alert>

            <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">পূর্ণ নাম (বাংলায়) *</Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="যেমন: মোহাম্মদ রহিম উদ্দিন"
                            value={farmerFormData.fullName}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || isBanglaText(value)) {
                                    setFarmerFormData(prev => ({ ...prev, fullName: value }));
                                }
                            }}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fatherName">পিতার নাম (বাংলায়)</Label>
                        <Input
                            id="fatherName"
                            type="text"
                            placeholder="যেমন: মোহাম্মদ করিম উদ্দিন"
                            value={farmerFormData.fatherName}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || isBanglaText(value)) {
                                    setFarmerFormData(prev => ({ ...prev, fatherName: value }));
                                }
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="motherName">মাতার নাম (বাংলায়)</Label>
                        <Input
                            id="motherName"
                            type="text"
                            placeholder="যেমন: ফাতেমা খাতুন"
                            value={farmerFormData.motherName}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || isBanglaText(value)) {
                                    setFarmerFormData(prev => ({ ...prev, motherName: value }));
                                }
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="farmSizeUnit">জমির একক *</Label>
                        <Select
                            value={farmerFormData.farmSizeUnit}
                            onValueChange={(value: 'bigha' | 'katha' | 'acre') =>
                                setFarmerFormData(prev => ({ ...prev, farmSizeUnit: value }))
                            }
                        >
                            <SelectTrigger id="farmSizeUnit">
                                <SelectValue placeholder="একক নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                {farmSizeUnits.map(unit => (
                                    <SelectItem key={unit.value} value={unit.value}>
                                        {unit.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="farmSize">জমির পরিমাণ (বাংলা সংখ্যায়) *</Label>
                        <Input
                            id="farmSize"
                            type="text"
                            placeholder="যেমন: ২।৫"
                            value={farmerFormData.farmSize}
                            onChange={(e) => {
                                const value = formatBanglaNumberInput(e.target.value);
                                setFarmerFormData(prev => ({ ...prev, farmSize: value }));
                            }}
                            required
                        />
                        <p className="text-xs text-gray-500">
                            বাংলা সংখ্যায় লিখুন: ০১২৩৪৫৬৭৮৯। দশমিক এর জন্য: ।
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="farmType">চাষের ধরণ *</Label>
                        <Select
                            value={farmerFormData.farmType}
                            onValueChange={(value) =>
                                setFarmerFormData(prev => ({ ...prev, farmType: value }))
                            }
                        >
                            <SelectTrigger id="farmType">
                                <SelectValue placeholder="চাষের ধরণ নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                {farmTypes.map(type => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {farmerFormData.farmType === 'অন্যান্য' && (
                    <div className="space-y-2">
                        <Label htmlFor="customFarmType">চাষের ধরণ উল্লেখ করুন (বাংলায়) *</Label>
                        <Input
                            id="customFarmType"
                            type="text"
                            placeholder="যেমন: আলু চাষ"
                            value={farmerFormData.customFarmType}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || isBanglaText(value)) {
                                    setFarmerFormData(prev => ({ ...prev, customFarmType: value }));
                                }
                            }}
                            required
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label className="text-base font-medium">ঠিকানা *</Label>
                    <LocationSelector
                        value={farmerFormData.location}
                        onChange={(location) => setFarmerFormData(prev => ({ ...prev, location }))}
                        onAddressChange={(address) => setFarmerFormData(prev => ({ ...prev, address }))}
                    />
                    {farmerFormData.address && (
                        <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                            <p className="text-sm font-medium text-blue-800">সম্পূর্ণ ঠিকানা:</p>
                            <p className="text-sm text-blue-700">{farmerFormData.address}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="experience">কৃষিকাজের অভিজ্ঞতা (বছর - বাংলা সংখ্যায়) *</Label>
                    <Input
                        id="experience"
                        type="text"
                        placeholder="যেমন: ১৫"
                        value={farmerFormData.experience}
                        onChange={(e) => {
                            const value = formatBanglaNumberInput(e.target.value);
                            setFarmerFormData(prev => ({ ...prev, experience: value }));
                        }}
                        required
                    />
                    <p className="text-xs text-gray-500">
                        কত বছর কৃষিকাজ করছেন বাংলা সংখ্যায় লিখুন (০-৯)
                    </p>
                </div>

                <div className="space-y-2">
                    <Label>প্রোফাইল ছবি *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        {profilePhotoPreview ? (
                            <div className="space-y-3">
                                <div className="flex justify-center">
                                    <img
                                        src={profilePhotoPreview}
                                        alt="Profile Preview"
                                        className="w-40 h-40 object-cover rounded-full border-4 border-green-200"
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-green-600 font-medium mb-2">
                                        {farmerFormData.profilePhoto?.name}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setFarmerFormData(prev => ({ ...prev, profilePhoto: null }));
                                            setProfilePhotoPreview(null);
                                        }}
                                    >
                                        ছবি পরিবর্তন করুন
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => profilePhotoRef.current?.click()}
                                    className="mb-2"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    ছবি আপলোড করুন
                                </Button>
                                <p className="text-xs text-gray-500 mt-2">
                                    JPG, PNG বা JPEG (সর্বোচ্চ 5MB)
                                </p>
                            </div>
                        )}
                        <input
                            ref={profilePhotoRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange('profilePhoto', e.target.files?.[0] || null)}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep('initial')}
                        className="flex-1"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        পূর্ববর্তী
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                OTP পাঠানো হচ্ছে...
                            </>
                        ) : (
                            <>
                                OTP পাঠান
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );

    const renderOtpForm = () => (
        <div className="space-y-6">
            <Alert className="border-purple-200 bg-purple-50">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-purple-800">
                    আপনার {initialData.phone} নম্বরে একটি ৬ ডিজিটের OTP কোড পাঠানো হয়েছে
                </AlertDescription>
            </Alert>

            {/* OTP Display for Demo/Testing - Shows OTP on screen */}
            {generatedOtp && (
                <Alert className="border-orange-300 bg-orange-50">
                    <AlertDescription className="text-orange-800 text-center">
                        <span className="font-medium">🔐 ডেমো OTP কোড:</span>
                        <br />
                        <span className="text-2xl font-bold tracking-widest text-orange-600">{generatedOtp}</span>
                        <br />
                        <span className="text-xs text-gray-500">(মোবাইল টেস্টিং এর জন্য)</span>
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="otp">OTP কোড *</Label>
                    <Input
                        id="otp"
                        type="text"
                        placeholder="৬ ডিজিট OTP কোড"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                        className="text-center text-2xl tracking-widest"
                    />
                    <p className="text-sm text-gray-600 text-center">
                        OTP পাননি? <Button type="button" variant="link" className="p-0" onClick={handleResendOtp} disabled={isLoading}>আবার পাঠান</Button>
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep('form')}
                        className="flex-1"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        পূর্ববর্তী
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                নিবন্ধন সম্পন্ন করা হচ্ছে...
                            </>
                        ) : (
                            <>
                                নিবন্ধন সম্পন্ন করুন
                                <CheckCircle className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );

    const renderSuccess = () => (
        <div className="text-center space-y-6">
            <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-600">নিবন্ধন সফল!</h3>
                <p className="text-gray-600">
                    আপনার কৃষক অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। এখন আপনি মোবাইল নম্বর দিয়ে লগইন করতে পারবেন।
                </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">আপনার লগইন তথ্য:</h4>
                <p className="text-green-700">মোবাইল নম্বর: {initialData.phone}</p>
                <p className="text-sm text-green-600 mt-1">লগইনের সময় OTP ব্যবহার করতে হবে</p>
            </div>

            <Button
                onClick={() => {
                    navigate('/farmer-dashboard');
                }}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
            >
                ড্যাশবোর্ডে যান
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">কৃষক নিবন্ধন</CardTitle>
                    <CardDescription>
                        {currentStep === 'success' ? 'নিবন্ধন সম্পন্ন' : 'ধাপে ধাপে নিবন্ধন প্রক্রিয়া'}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {currentStep !== 'success' && renderStepIndicator()}

                    {currentStep === 'initial' && renderInitialForm()}
                    {currentStep === 'documents' && renderDocumentForm()}
                    {currentStep === 'form' && renderForm()}
                    {currentStep === 'otp' && renderOtpForm()}
                    {currentStep === 'success' && renderSuccess()}
                </CardContent>
            </Card>
        </div>
    );
};

export default FarmerRegistration;
