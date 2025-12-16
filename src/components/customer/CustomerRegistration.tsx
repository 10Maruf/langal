import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Upload, Camera, IdCard, Phone, CheckCircle, ArrowLeft, ArrowRight, Building2, FileText, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/services/api";
import { AxiosError } from "axios";
import LocationSelector from "@/components/farmer/LocationSelector";

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

interface BusinessType {
    value: string;
    label: string;
}

interface CustomerFormData {
    // Personal Info
    fullName: string;
    fatherName: string;
    motherName: string;
    dateOfBirth: string;
    phone: string;
    nidNumber: string;
    password: string;
    confirmPassword: string;

    // Location
    location: LocationData | null;
    address: string;

    // Business Info
    businessName: string;
    businessType: string;
    customBusinessType: string;
    establishedYear: string;
    tradeLicenseNumber: string;

    // Files
    profilePhoto: File | null;
    nidPhoto: File | null;
}

type RegistrationStep = 'personal' | 'location' | 'business' | 'documents' | 'otp' | 'success';

interface CustomerRegistrationProps {
    onBack?: () => void;
}

const CustomerRegistration = ({ onBack }: CustomerRegistrationProps) => {
    const [currentStep, setCurrentStep] = useState<RegistrationStep>('personal');
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);

    const [formData, setFormData] = useState<CustomerFormData>({
        fullName: '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        phone: '',
        nidNumber: '',
        password: '',
        confirmPassword: '',
        location: null,
        address: '',
        businessName: '',
        businessType: '',
        customBusinessType: '',
        establishedYear: '',
        tradeLicenseNumber: '',
        profilePhoto: null,
        nidPhoto: null,
    });

    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
    const [nidPhotoPreview, setNidPhotoPreview] = useState<string | null>(null);

    const navigate = useNavigate();
    const { setAuthUser } = useAuth();
    const { toast } = useToast();
    const profilePhotoRef = useRef<HTMLInputElement>(null);
    const nidPhotoRef = useRef<HTMLInputElement>(null);

    // Memoized callbacks to prevent infinite re-renders
    const handleLocationChange = useCallback((location: LocationData) => {
        setFormData(prev => ({ ...prev, location }));
    }, []);

    const handleAddressChange = useCallback((address: string) => {
        setFormData(prev => ({ ...prev, address }));
    }, []);

    // Load business types on mount
    useEffect(() => {
        loadBusinessTypes();
    }, []);

    const loadBusinessTypes = async () => {
        try {
            const response = await api.get('/customer/business-types');
            if (response.data.success) {
                setBusinessTypes(response.data.data);
            }
        } catch (error) {
            console.error('Error loading business types:', error);
            // Fallback business types
            setBusinessTypes([
                { value: 'retailer', label: 'খুচরা বিক্রেতা' },
                { value: 'wholesaler', label: 'পাইকারি বিক্রেতা' },
                { value: 'processor', label: 'প্রক্রিয়াজাতকারী' },
                { value: 'restaurant', label: 'রেস্টুরেন্ট' },
                { value: 'hotel', label: 'হোটেল' },
                { value: 'supermarket', label: 'সুপারমার্কেট' },
                { value: 'grocery', label: 'মুদি দোকান' },
                { value: 'other', label: 'অন্যান্য' },
            ]);
        }
    };

    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, profilePhoto: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNidPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, nidPhoto: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setNidPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const validatePersonalStep = (): boolean => {
        if (!formData.fullName.trim()) {
            toast({ title: "ত্রুটি", description: "পূর্ণ নাম দিন", variant: "destructive" });
            return false;
        }
        if (!formData.fatherName.trim()) {
            toast({ title: "ত্রুটি", description: "পিতার নাম দিন", variant: "destructive" });
            return false;
        }
        if (!formData.motherName.trim()) {
            toast({ title: "ত্রুটি", description: "মাতার নাম দিন", variant: "destructive" });
            return false;
        }
        if (!formData.dateOfBirth) {
            toast({ title: "ত্রুটি", description: "জন্ম তারিখ দিন", variant: "destructive" });
            return false;
        }
        if (!formData.phone || formData.phone.length < 11) {
            toast({ title: "ত্রুটি", description: "সঠিক মোবাইল নম্বর দিন (১১ ডিজিট)", variant: "destructive" });
            return false;
        }
        if (!formData.nidNumber || formData.nidNumber.length < 10) {
            toast({ title: "ত্রুটি", description: "সঠিক NID নম্বর দিন", variant: "destructive" });
            return false;
        }
        if (!formData.password || formData.password.length < 6) {
            toast({ title: "ত্রুটি", description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে", variant: "destructive" });
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast({ title: "ত্রুটি", description: "পাসওয়ার্ড মিলছে না", variant: "destructive" });
            return false;
        }
        return true;
    };

    const validateLocationStep = (): boolean => {
        if (!formData.location) {
            toast({ title: "ত্রুটি", description: "অনুগ্রহ করে আপনার ঠিকানা নির্বাচন করুন", variant: "destructive" });
            return false;
        }
        return true;
    };

    const validateBusinessStep = (): boolean => {
        if (!formData.businessName.trim()) {
            toast({ title: "ত্রুটি", description: "ব্যবসার নাম দিন", variant: "destructive" });
            return false;
        }
        if (!formData.businessType) {
            toast({ title: "ত্রুটি", description: "ব্যবসার ধরণ নির্বাচন করুন", variant: "destructive" });
            return false;
        }
        if (formData.businessType === 'other' && !formData.customBusinessType.trim()) {
            toast({ title: "ত্রুটি", description: "ব্যবসার ধরণ লিখুন", variant: "destructive" });
            return false;
        }
        return true;
    };

    const validateDocumentsStep = (): boolean => {
        if (!formData.profilePhoto) {
            toast({ title: "ত্রুটি", description: "প্রোফাইল ছবি আপলোড করুন", variant: "destructive" });
            return false;
        }
        if (!formData.nidPhoto) {
            toast({ title: "ত্রুটি", description: "NID ছবি আপলোড করুন", variant: "destructive" });
            return false;
        }
        return true;
    };

    const handleNextStep = async () => {
        switch (currentStep) {
            case 'personal':
                if (validatePersonalStep()) {
                    setCurrentStep('location');
                }
                break;
            case 'location':
                if (validateLocationStep()) {
                    setCurrentStep('business');
                }
                break;
            case 'business':
                if (validateBusinessStep()) {
                    setCurrentStep('documents');
                }
                break;
            case 'documents':
                if (validateDocumentsStep()) {
                    await sendOtp();
                }
                break;
        }
    };

    const handlePreviousStep = () => {
        switch (currentStep) {
            case 'location':
                setCurrentStep('personal');
                break;
            case 'business':
                setCurrentStep('location');
                break;
            case 'documents':
                setCurrentStep('business');
                break;
            case 'otp':
                setCurrentStep('documents');
                break;
        }
    };

    const sendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/customer/send-otp', {
                phone: formData.phone,
                purpose: 'register'
            });

            if (response.data.success) {
                toast({
                    title: "OTP পাঠানো হয়েছে",
                    description: `আপনার ${formData.phone} নম্বরে OTP পাঠানো হয়েছে`,
                });

                // For development - show OTP if returned
                if (response.data.data?.otp_code) {
                    console.log('Dev OTP:', response.data.data.otp_code);
                    setOtp(response.data.data.otp_code);
                }

                setCurrentStep('otp');
            } else {
                throw new Error(response.data.message);
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

    const completeRegistration = async () => {
        const formDataToSend = new FormData();

        // Personal info
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('fullName', formData.fullName);
        formDataToSend.append('fatherName', formData.fatherName);
        formDataToSend.append('motherName', formData.motherName);
        formDataToSend.append('dateOfBirth', formData.dateOfBirth);
        formDataToSend.append('nidNumber', formData.nidNumber);
        formDataToSend.append('otp_code', otp);

        // Location data
        if (formData.location) {
            formDataToSend.append('postal_code', formData.location.postal_code.toString());
            formDataToSend.append('village', formData.location.village || '');
        }

        // Business data
        formDataToSend.append('businessName', formData.businessName);
        formDataToSend.append('businessType', formData.businessType);
        if (formData.businessType === 'other') {
            formDataToSend.append('customBusinessType', formData.customBusinessType);
        }
        if (formData.establishedYear) {
            formDataToSend.append('establishedYear', formData.establishedYear);
        }
        if (formData.tradeLicenseNumber) {
            formDataToSend.append('tradeLicenseNumber', formData.tradeLicenseNumber);
        }

        // Files
        if (formData.profilePhoto) {
            formDataToSend.append('profilePhoto', formData.profilePhoto);
        }
        if (formData.nidPhoto) {
            formDataToSend.append('nidPhoto', formData.nidPhoto);
        }

        const response = await api.post('/customer/register', formDataToSend);

        if (response.data.success) {
            const { user, token } = response.data.data;

            // Map backend user to frontend user format
            const authUser = {
                id: user.user_id.toString(),
                user_id: user.user_id,
                name: user.profile?.full_name || user.phone,
                type: 'customer' as const,
                email: user.email || '',
                phone: user.phone,
                profilePhoto: user.profile?.profile_photo_url_full,
                location: user.profile?.address || 'Bangladesh',
                location_info: user.location_info || undefined,
                businessName: user.customer_business?.business_name,
            };

            // Set user in context
            setAuthUser(authUser, token);
        } else {
            throw new Error(response.data.message || 'Registration failed');
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length < 6) {
            toast({
                title: "ত্রুটি",
                description: "সঠিক OTP কোড দিন (৬ ডিজিট)",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            await completeRegistration();

            toast({
                title: "নিবন্ধন সম্পন্ন!",
                description: "আপনার ব্যবসায়ী অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে",
            });

            setCurrentStep('success');
        } catch (error) {
            console.error("Registration Error:", error);
            const axiosError = error as AxiosError<{ message: string; errors?: Record<string, string[]> }>;

            let errorMessage = "নিবন্ধনে সমস্যা হয়েছে";
            if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            }
            if (axiosError.response?.data?.errors) {
                const errors = Object.values(axiosError.response.data.errors).flat();
                if (errors.length > 0) {
                    errorMessage = errors[0];
                }
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

    const getStepNumber = () => {
        const steps = ['personal', 'location', 'business', 'documents', 'otp'];
        return steps.indexOf(currentStep) + 1;
    };

    const renderStepIndicator = () => {
        const steps = [
            { id: 'personal', label: 'ব্যক্তিগত তথ্য' },
            { id: 'location', label: 'ঠিকানা' },
            { id: 'business', label: 'ব্যবসার তথ্য' },
            { id: 'documents', label: 'ডকুমেন্ট' },
            { id: 'otp', label: 'যাচাই' },
        ];

        return (
            <div className="flex justify-between mb-8">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                ${getStepNumber() > index + 1
                                    ? 'bg-purple-600 text-white'
                                    : getStepNumber() === index + 1
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                }`}
                        >
                            {getStepNumber() > index + 1 ? <CheckCircle className="h-5 w-5" /> : index + 1}
                        </div>
                        <span className="text-xs mt-1 text-center hidden sm:block">{step.label}</span>
                    </div>
                ))}
            </div>
        );
    };

    // Personal Info Step
    const renderPersonalStep = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">পূর্ণ নাম *</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        id="fullName"
                        placeholder="আপনার পূর্ণ নাম"
                        className="pl-10"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fatherName">পিতার নাম *</Label>
                    <Input
                        id="fatherName"
                        placeholder="পিতার নাম"
                        value={formData.fatherName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="motherName">মাতার নাম *</Label>
                    <Input
                        id="motherName"
                        placeholder="মাতার নাম"
                        value={formData.motherName}
                        onChange={(e) => setFormData(prev => ({ ...prev, motherName: e.target.value }))}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="dateOfBirth">জন্ম তারিখ *</Label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        id="dateOfBirth"
                        type="date"
                        className="pl-10"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">মোবাইল নম্বর *</Label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="০১XXXXXXXXX"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="nidNumber">জাতীয় পরিচয়পত্র নম্বর (NID) *</Label>
                <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        id="nidNumber"
                        placeholder="১০ বা ১৭ ডিজিট"
                        className="pl-10"
                        value={formData.nidNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, nidNumber: e.target.value }))}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="password">পাসওয়ার্ড *</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="কমপক্ষে ৬ অক্ষর"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন *</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="আবার পাসওয়ার্ড লিখুন"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                </div>
            </div>
        </div>
    );

    // Location Step
    const renderLocationStep = () => (
        <div className="space-y-4">
            <Alert className="border-purple-200 bg-purple-50">
                <AlertDescription className="text-purple-800">
                    আপনার ব্যবসার ঠিকানা নির্বাচন করুন। পোস্টাল কোড দিয়ে অথবা ম্যানুয়ালি নির্বাচন করতে পারবেন।
                </AlertDescription>
            </Alert>

            <LocationSelector
                value={formData.location}
                onChange={handleLocationChange}
                onAddressChange={handleAddressChange}
            />

            {formData.address && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Label className="text-sm text-purple-700">নির্বাচিত ঠিকানা:</Label>
                    <p className="text-purple-900 font-medium mt-1">{formData.address}</p>
                </div>
            )}
        </div>
    );

    // Business Info Step
    const renderBusinessStep = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="businessName">ব্যবসার নাম *</Label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        id="businessName"
                        placeholder="আপনার ব্যবসার নাম"
                        className="pl-10"
                        value={formData.businessName}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="businessType">ব্যবসার ধরণ *</Label>
                <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}
                >
                    <SelectTrigger className="border-purple-200">
                        <SelectValue placeholder="ব্যবসার ধরণ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        {businessTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {formData.businessType === 'other' && (
                <div className="space-y-2">
                    <Label htmlFor="customBusinessType">ব্যবসার ধরণ লিখুন *</Label>
                    <Input
                        id="customBusinessType"
                        placeholder="আপনার ব্যবসার ধরণ লিখুন"
                        value={formData.customBusinessType}
                        onChange={(e) => setFormData(prev => ({ ...prev, customBusinessType: e.target.value }))}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="establishedYear">প্রতিষ্ঠার বছর</Label>
                    <Input
                        id="establishedYear"
                        type="number"
                        placeholder="যেমন: ২০১৫"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={formData.establishedYear}
                        onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: e.target.value }))}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tradeLicenseNumber">ট্রেড লাইসেন্স নম্বর</Label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="tradeLicenseNumber"
                            placeholder="ট্রেড লাইসেন্স নম্বর (ঐচ্ছিক)"
                            className="pl-10"
                            value={formData.tradeLicenseNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, tradeLicenseNumber: e.target.value }))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // Documents Step
    const renderDocumentsStep = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Photo */}
                <div className="space-y-2">
                    <Label>প্রোফাইল ছবি *</Label>
                    <div
                        className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                        onClick={() => profilePhotoRef.current?.click()}
                    >
                        {profilePhotoPreview ? (
                            <img
                                src={profilePhotoPreview}
                                alt="Profile Preview"
                                className="w-32 h-32 mx-auto rounded-full object-cover"
                            />
                        ) : (
                            <>
                                <Camera className="mx-auto h-12 w-12 text-purple-400 mb-2" />
                                <p className="text-sm text-gray-600">ছবি আপলোড করতে ক্লিক করুন</p>
                            </>
                        )}
                        <input
                            ref={profilePhotoRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePhotoChange}
                        />
                    </div>
                    {formData.profilePhoto && (
                        <p className="text-sm text-green-600 text-center">
                            ✓ {formData.profilePhoto.name}
                        </p>
                    )}
                </div>

                {/* NID Photo */}
                <div className="space-y-2">
                    <Label>জাতীয় পরিচয়পত্রের ছবি *</Label>
                    <div
                        className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                        onClick={() => nidPhotoRef.current?.click()}
                    >
                        {nidPhotoPreview ? (
                            <img
                                src={nidPhotoPreview}
                                alt="NID Preview"
                                className="w-full h-32 mx-auto object-contain"
                            />
                        ) : (
                            <>
                                <IdCard className="mx-auto h-12 w-12 text-purple-400 mb-2" />
                                <p className="text-sm text-gray-600">NID ছবি আপলোড করতে ক্লিক করুন</p>
                            </>
                        )}
                        <input
                            ref={nidPhotoRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleNidPhotoChange}
                        />
                    </div>
                    {formData.nidPhoto && (
                        <p className="text-sm text-green-600 text-center">
                            ✓ {formData.nidPhoto.name}
                        </p>
                    )}
                </div>
            </div>

            <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-yellow-800">
                    আপনার NID স্পষ্ট এবং পড়া যায় এমন ছবি আপলোড করুন। এটি আপনার অ্যাকাউন্ট যাচাইয়ের জন্য প্রয়োজন।
                </AlertDescription>
            </Alert>
        </div>
    );

    // OTP Step
    const renderOtpStep = () => (
        <div className="space-y-6">
            <Alert className="border-purple-200 bg-purple-50">
                <AlertDescription className="text-purple-800">
                    আপনার {formData.phone} নম্বরে একটি OTP পাঠানো হয়েছে। অনুগ্রহ করে কোডটি লিখুন।
                </AlertDescription>
            </Alert>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="otp">OTP কোড</Label>
                    <Input
                        id="otp"
                        type="text"
                        placeholder="৬ ডিজিটের কোড"
                        maxLength={6}
                        className="text-center text-2xl tracking-widest"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isLoading || otp.length < 6}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            যাচাই হচ্ছে...
                        </>
                    ) : (
                        'নিবন্ধন সম্পন্ন করুন'
                    )}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={sendOtp}
                    disabled={isLoading}
                >
                    OTP পুনরায় পাঠান
                </Button>
            </form>
        </div>
    );

    // Success Step
    const renderSuccessStep = () => (
        <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">
                    নিবন্ধন সম্পন্ন!
                </h2>
                <p className="text-gray-600">
                    {formData.businessName} সফলভাবে নিবন্ধিত হয়েছে।
                </p>
            </div>

            <Alert className="border-purple-200 bg-purple-50 text-left">
                <AlertDescription className="text-purple-800">
                    আপনার অ্যাকাউন্ট যাচাইয়ের জন্য পর্যালোচনা করা হবে।
                    যাচাই সম্পন্ন হলে আপনি সম্পূর্ণ সুবিধা পাবেন।
                </AlertDescription>
            </Alert>

            <Button
                onClick={() => navigate('/customer')}
                className="w-full bg-purple-600 hover:bg-purple-700"
            >
                ড্যাশবোর্ডে যান
            </Button>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'personal':
                return renderPersonalStep();
            case 'location':
                return renderLocationStep();
            case 'business':
                return renderBusinessStep();
            case 'documents':
                return renderDocumentsStep();
            case 'otp':
                return renderOtpStep();
            case 'success':
                return renderSuccessStep();
            default:
                return renderPersonalStep();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-purple-800">
                        <Building2 className="inline-block mr-2 h-6 w-6" />
                        ব্যবসায়ী নিবন্ধন
                    </CardTitle>
                    <CardDescription>
                        ক্রেতা/ব্যবসায়ী হিসেবে নিবন্ধন করুন
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {currentStep !== 'success' && renderStepIndicator()}
                    {renderCurrentStep()}

                    {/* Navigation Buttons */}
                    {currentStep !== 'success' && currentStep !== 'otp' && (
                        <div className="flex justify-between mt-8">
                            {currentStep !== 'personal' ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePreviousStep}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    পূর্ববর্তী
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onBack ? onBack() : navigate('/register')}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    ফিরে যান
                                </Button>
                            )}

                            <Button
                                type="button"
                                onClick={handleNextStep}
                                disabled={isLoading}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        {currentStep === 'documents' ? 'OTP পাঠান' : 'পরবর্তী'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {currentStep === 'otp' && (
                        <div className="mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePreviousStep}
                                className="w-full"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                পূর্ববর্তী ধাপে যান
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CustomerRegistration;
