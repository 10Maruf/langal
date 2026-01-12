import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Upload, Camera, IdCard, Phone, CheckCircle, ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/services/api";
import { AxiosError } from "axios";
import {
    isBanglaText,
    validateBanglaInput
} from "@/lib/banglaUtils";
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

interface BasicInfoData {
    fullName: string;
    nidNumber: string;
    dateOfBirth: string;
    fatherName: string;
    motherName: string;
}

interface LocationImageData {
    location: LocationData | null;
    profilePhoto: File | null;
}

interface CredentialsData {
    mobileNumber: string;
    password: string;
    confirmPassword: string;
}

type RegistrationStep = 'basic' | 'location' | 'credentials' | 'otp' | 'success';

const DataOperatorRegistration = () => {
    const [currentStep, setCurrentStep] = useState<RegistrationStep>('basic');
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');
    
    const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
        fullName: '',
        nidNumber: '',
        dateOfBirth: '',
        fatherName: '',
        motherName: ''
    });

    const [locationImage, setLocationImage] = useState<LocationImageData>({
        location: null,
        profilePhoto: null
    });

    const [credentials, setCredentials] = useState<CredentialsData>({
        mobileNumber: '',
        password: '',
        confirmPassword: ''
    });

    const [address, setAddress] = useState('');
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

    const navigate = useNavigate();
    const { setAuthUser } = useAuth();
    const { toast } = useToast();
    const profilePhotoRef = useRef<HTMLInputElement>(null);

    const handleBasicInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!basicInfo.fullName || !basicInfo.nidNumber || !basicInfo.dateOfBirth) {
            toast({
                title: "ত্রুটি",
                description: "অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন",
                variant: "destructive",
            });
            return;
        }

        // Validate Bangla text inputs
        const nameError = validateBanglaInput(basicInfo.fullName, "পূর্ণ নাম");
        if (nameError) {
            toast({ title: "ত্রুটি", description: nameError, variant: "destructive" });
            return;
        }

        if (basicInfo.fatherName) {
            const fatherNameError = validateBanglaInput(basicInfo.fatherName, "পিতার নাম");
            if (fatherNameError) {
                toast({ title: "ত্রুটি", description: fatherNameError, variant: "destructive" });
                return;
            }
        }

        if (basicInfo.motherName) {
            const motherNameError = validateBanglaInput(basicInfo.motherName, "মাতার নাম");
            if (motherNameError) {
                toast({ title: "ত্রুটি", description: motherNameError, variant: "destructive" });
                return;
            }
        }

        // Validate NID (10-17 digits)
        if (!/^\d{10,17}$/.test(basicInfo.nidNumber)) {
            toast({
                title: "ত্রুটি",
                description: "এনআইডি নম্বর ১০ থেকে ১৭ ডিজিটের হতে হবে",
                variant: "destructive",
            });
            return;
        }

        // Validate age (must be 18+)
        const birthDate = new Date(basicInfo.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
            toast({
                title: "ত্রুটি",
                description: "বয়স কমপক্ষে ১৮ বছর হতে হবে",
                variant: "destructive",
            });
            return;
        }

        setCurrentStep('location');
    };

    const handleLocationSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!locationImage.location || !locationImage.profilePhoto) {
            toast({
                title: "ত্রুটি",
                description: "অনুগ্রহ করে ঠিকানা এবং প্রোফাইল ছবি দিন",
                variant: "destructive",
            });
            return;
        }

        setCurrentStep('credentials');
    };

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!credentials.mobileNumber || !credentials.password || !credentials.confirmPassword) {
            toast({
                title: "ত্রুটি",
                description: "অনুগ্রহ করে সব তথ্য পূরণ করুন",
                variant: "destructive",
            });
            return;
        }

        // Validate mobile number (11 digits starting with 01)
        if (!/^01\d{9}$/.test(credentials.mobileNumber)) {
            toast({
                title: "ত্রুটি",
                description: "সঠিক মোবাইল নম্বর দিন (১১ ডিজিট, ০১ দিয়ে শুরু)",
                variant: "destructive",
            });
            return;
        }

        // Validate password
        if (credentials.password.length < 6) {
            toast({
                title: "ত্রুটি",
                description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
                variant: "destructive",
            });
            return;
        }

        if (credentials.password !== credentials.confirmPassword) {
            toast({
                title: "ত্রুটি",
                description: "পাসওয়ার্ড মিলছে না",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Send OTP via API
            const response = await api.post('/data-operator/send-otp', {
                phone: credentials.mobileNumber
            });

            if (response.data.success) {
                toast({
                    title: "OTP পাঠানো হয়েছে",
                    description: `আপনার ${credentials.mobileNumber} নম্বরে OTP পাঠানো হয়েছে`,
                });

                // For dev/demo purposes, log the OTP if returned
                if (response.data.data.otp_code) {
                    console.log("Dev OTP:", response.data.data.otp_code);
                    toast({
                        title: "Dev Mode OTP",
                        description: `OTP Code: ${response.data.data.otp_code}`,
                    });
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

    const completeRegistration = async (): Promise<void> => {
        const formData = new FormData();

        // Append all text fields
        formData.append('phone', credentials.mobileNumber);
        formData.append('password', credentials.password);
        formData.append('otp_code', otp);
        formData.append('fullName', basicInfo.fullName);
        formData.append('nidNumber', basicInfo.nidNumber);
        formData.append('dateOfBirth', basicInfo.dateOfBirth);
        formData.append('fatherName', basicInfo.fatherName || '');
        formData.append('motherName', basicInfo.motherName || '');
        formData.append('address', address || '');

        // Send location data
        if (locationImage.location) {
            formData.append('postal_code', locationImage.location.postal_code.toString());
            formData.append('division', locationImage.location.division || '');
            formData.append('division_bn', locationImage.location.division_bn || '');
            formData.append('district', locationImage.location.district || '');
            formData.append('district_bn', locationImage.location.district_bn || '');
            formData.append('upazila', locationImage.location.upazila || '');
            formData.append('upazila_bn', locationImage.location.upazila_bn || '');
            formData.append('village', locationImage.location.village || '');
        }

        // Append profile photo
        if (locationImage.profilePhoto) {
            formData.append('profilePhoto', locationImage.profilePhoto);
        }

        const response = await api.post('/data-operator/register', formData);

        if (response.data.success) {
            const { user, token } = response.data.data;

            // Map backend user to frontend user format
            const authUser = {
                id: user.user_id.toString(),
                name: user.profile?.full_name || user.phone,
                type: 'data_operator' as const,
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
            await completeRegistration();

            toast({
                title: "নিবন্ধন সম্পন্ন!",
                description: "আপনার ডাটা অপারেটর অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে",
            });

            setCurrentStep('success');
        } catch (error) {
            console.error("Registration Error:", error);
            const axiosError = error as AxiosError<{ message: string; errors?: Record<string, string[]> }>;

            let errorMessage = "নিবন্ধন সম্পন্ন করতে সমস্যা হয়েছে";

            if (axiosError.response?.data?.errors) {
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

    const handleFileChange = (file: File | null) => {
        setLocationImage(prev => ({ ...prev, profilePhoto: file }));

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setProfilePhotoPreview(null);
        }
    };

    const renderStepIndicator = () => {
        const steps = [
            { key: 'basic', label: 'প্রাথমিক তথ্য', icon: IdCard },
            { key: 'location', label: 'ঠিকানা ও ছবি', icon: Camera },
            { key: 'credentials', label: 'মোবাইল ও পাসওয়ার্ড', icon: Phone },
            { key: 'otp', label: 'OTP যাচাই', icon: CheckCircle }
        ];

        const currentStepIndex = steps.findIndex(step => step.key === currentStep);

        return (
            <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-2 md:space-x-4">
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
                                <span className={`ml-2 text-xs md:text-sm ${isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'
                                    }`}>
                                    {step.label}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={`w-6 md:w-8 h-0.5 mx-2 md:mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderBasicInfoForm = () => (
        <div className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
                <IdCard className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                    ডাটা অপারেটর নিবন্ধনের জন্য আপনার প্রাথমিক তথ্য প্রয়োজন
                </AlertDescription>
            </Alert>

            <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">পূর্ণ নাম (বাংলায়) *</Label>
                    <Input
                        id="fullName"
                        type="text"
                        placeholder="যেমন: মোহাম্মদ রহিম উদ্দিন"
                        value={basicInfo.fullName}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || isBanglaText(value)) {
                                setBasicInfo(prev => ({ ...prev, fullName: value }));
                            }
                        }}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nidNumber">এনআইডি নম্বর *</Label>
                    <Input
                        id="nidNumber"
                        type="text"
                        placeholder="১০ বা ১৭ ডিজিটের NID"
                        value={basicInfo.nidNumber}
                        onChange={(e) => setBasicInfo(prev => ({ ...prev, nidNumber: e.target.value }))}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">জন্ম তারিখ *</Label>
                    <Input
                        id="dateOfBirth"
                        type="date"
                        value={basicInfo.dateOfBirth}
                        onChange={(e) => setBasicInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fatherName">পিতার নাম (বাংলায়)</Label>
                    <Input
                        id="fatherName"
                        type="text"
                        placeholder="যেমন: মোহাম্মদ করিম উদ্দিন"
                        value={basicInfo.fatherName}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || isBanglaText(value)) {
                                setBasicInfo(prev => ({ ...prev, fatherName: value }));
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
                        value={basicInfo.motherName}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || isBanglaText(value)) {
                                setBasicInfo(prev => ({ ...prev, motherName: value }));
                            }
                        }}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    পরবর্তী ধাপ
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </form>
        </div>
    );

    const renderLocationForm = () => (
        <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
                <Camera className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                    আপনার ঠিকানা এবং প্রোফাইল ছবি আপলোড করুন
                </AlertDescription>
            </Alert>

            <form onSubmit={handleLocationSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-base font-medium">ঠিকানা *</Label>
                    <LocationSelector
                        value={locationImage.location}
                        onChange={(location) => setLocationImage(prev => ({ ...prev, location }))}
                        onAddressChange={(newAddress) => setAddress(newAddress)}
                    />
                    {address && (
                        <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                            <p className="text-sm font-medium text-blue-800">সম্পূর্ণ ঠিকানা:</p>
                            <p className="text-sm text-blue-700">{address}</p>
                        </div>
                    )}
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
                                        {locationImage.profilePhoto?.name}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleFileChange(null)}
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
                            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep('basic')}
                        className="flex-1"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        পূর্ববর্তী
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                        পরবর্তী ধাপ
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );

    const renderCredentialsForm = () => (
        <div className="space-y-6">
            <Alert className="border-purple-200 bg-purple-50">
                <Phone className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-purple-800">
                    আপনার মোবাইল নম্বর এবং একটি শক্তিশালী পাসওয়ার্ড সেট করুন
                </AlertDescription>
            </Alert>

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="mobileNumber">মোবাইল নম্বর *</Label>
                    <Input
                        id="mobileNumber"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={credentials.mobileNumber}
                        onChange={(e) => setCredentials(prev => ({ ...prev, mobileNumber: e.target.value }))}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">পাসওয়ার্ড *</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন *</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                        value={credentials.confirmPassword}
                        onChange={(e) => setCredentials(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep('location')}
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
            <Alert className="border-orange-200 bg-orange-50">
                <CheckCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                    আপনার {credentials.mobileNumber} নম্বরে একটি ৬ ডিজিটের OTP কোড পাঠানো হয়েছে
                </AlertDescription>
            </Alert>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="otp">OTP কোড *</Label>
                    <Input
                        id="otp"
                        type="text"
                        placeholder="৬ ডিজিট"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                        className="text-center text-2xl tracking-widest"
                    />
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep('credentials')}
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
                    আপনার ডাটা অপারেটর অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।
                </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">আপনার লগইন তথ্য:</h4>
                <p className="text-green-700">মোবাইল নম্বর: {credentials.mobileNumber}</p>
                <p className="text-sm text-green-600 mt-1">আপনার পাসওয়ার্ড ব্যবহার করে লগইন করুন</p>
            </div>

            <Button
                onClick={() => {
                    navigate('/data-operator');
                }}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
            >
                লগইন পেজে যান
            </Button>
        </div>
    );

    return (
        <div 
            className="min-h-screen w-full flex items-center justify-center p-4"
            style={{
                backgroundImage: 'url(/img/DataOperator.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <Card className="w-full max-w-2xl backdrop-blur-md bg-white/80 border border-white/50 shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">ডাটা অপারেটর নিবন্ধন</CardTitle>
                    <CardDescription>
                        {currentStep === 'success' ? 'নিবন্ধন সম্পন্ন' : 'ধাপে ধাপে নিবন্ধন প্রক্রিয়া'}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {currentStep !== 'success' && renderStepIndicator()}

                    {currentStep === 'basic' && renderBasicInfoForm()}
                    {currentStep === 'location' && renderLocationForm()}
                    {currentStep === 'credentials' && renderCredentialsForm()}
                    {currentStep === 'otp' && renderOtpForm()}
                    {currentStep === 'success' && renderSuccess()}
                </CardContent>
            </Card>
        </div>
    );
};

export default DataOperatorRegistration;
