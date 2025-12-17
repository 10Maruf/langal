import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Phone, Calendar, CheckCircle, ArrowLeft, ArrowRight, UserCheck, Lock, User, Upload, Camera, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface ExpertFormData {
    phone: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    nidNumber: string;
    dateOfBirth: string;
    fatherName: string;
    motherName: string;
    address: string;
    location: LocationData | null;
    // Expert specific fields
    qualification: string;
    specialization: string;
    experienceYears: string;
    institution: string;
    consultationFee: string;
    licenseNumber: string;
    availability: string;
    bio: string;
    // File uploads
    profilePhoto: File | null;
    certificationPhoto: File | null;
}

type RegistrationStep = 'phone' | 'otp' | 'personal' | 'professional' | 'documents' | 'success';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

interface ExpertRegistrationProps {
    onBackToMainRegister: () => void;
}

const ExpertRegistration = ({ onBackToMainRegister }: ExpertRegistrationProps) => {
    const [currentStep, setCurrentStep] = useState<RegistrationStep>('phone');
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');

    const [formData, setFormData] = useState<ExpertFormData>({
        phone: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        nidNumber: '',
        dateOfBirth: '',
        fatherName: '',
        motherName: '',
        address: '',
        location: null,
        // Expert specific fields
        qualification: '',
        specialization: '',
        experienceYears: '',
        institution: '',
        consultationFee: '',
        licenseNumber: '',
        availability: '',
        bio: '',
        // File uploads
        profilePhoto: null,
        certificationPhoto: null
    });

    // File refs
    const profilePhotoRef = useRef<HTMLInputElement>(null);
    const certificationPhotoRef = useRef<HTMLInputElement>(null);

    // File previews
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
    const [certificationPhotoPreview, setCertificationPhotoPreview] = useState<string | null>(null);

    const navigate = useNavigate();
    const { setAuthUser } = useAuth();
    const { toast } = useToast();

    // Memoized callbacks to prevent infinite re-renders
    const handleLocationChange = useCallback((location: LocationData) => {
        setFormData(prev => ({ ...prev, location }));
    }, []);

    const handleAddressChange = useCallback((address: string) => {
        setFormData(prev => ({ ...prev, address }));
    }, []);

    // File upload handlers
    const handleFileChange = (field: 'profilePhoto' | 'certificationPhoto', file: File | null) => {
        if (file) {
            setFormData(prev => ({ ...prev, [field]: file }));
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (result) {
                    if (field === 'profilePhoto') {
                        setProfilePhotoPreview(result);
                    } else if (field === 'certificationPhoto') {
                        setCertificationPhotoPreview(result);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Step 1: Phone number submission - Send OTP
    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.phone) {
            toast({
                title: "ত্রুটি",
                description: "মোবাইল নম্বর দিন",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/expert/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    phone: formData.phone,
                    purpose: 'register'
                }),
            });

            const data = await response.json();

            if (response.ok && data?.success) {
                if (data.data?.otp_code) {
                    setGeneratedOtp(data.data.otp_code);
                    console.log('Generated OTP:', data.data.otp_code);
                }

                toast({
                    title: "OTP পাঠানো হয়েছে",
                    description: `আপনার ${formData.phone} নম্বরে OTP পাঠানো হয়েছে`,
                });

                setCurrentStep('otp');
            } else {
                const backendMsg = data?.message;
                if (response.status === 409 && backendMsg?.includes('already exists')) {
                    toast({
                        title: 'অ্যাকাউন্ট বিদ্যমান',
                        description: 'এই নম্বরে ইতিমধ্যে একটি অ্যাকাউন্ট আছে। লগইন করুন।',
                        variant: 'destructive'
                    });
                } else {
                    toast({
                        title: 'OTP পাঠাতে সমস্যা',
                        description: backendMsg || 'সার্ভার থেকে OTP পাঠানো যায়নি।',
                        variant: 'destructive'
                    });
                }
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "OTP পাঠাতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
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
            const response = await fetch(`${API_BASE}/expert/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: formData.phone,
                    otp_code: otp
                }),
            });

            const data = await response.json();

            if (response.ok && data?.success) {
                toast({
                    title: "OTP যাচাই সফল",
                    description: "এখন আপনার তথ্য পূরণ করুন",
                });
                setCurrentStep('personal');
            } else {
                toast({
                    title: 'ভুল OTP',
                    description: data?.message || 'আপনার দেওয়া OTP সঠিক নয়।',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "OTP যাচাই করতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Personal Info submission
    const handlePersonalFormNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.nidNumber || !formData.dateOfBirth || !formData.fatherName || !formData.motherName || !formData.location) {
            toast({
                title: "ত্রুটি",
                description: "সব ব্যক্তিগত তথ্য পূরণ করুন",
                variant: "destructive",
            });
            return;
        }
        setCurrentStep('professional');
    };

    // Step 3: Professional Info submission
    const handleProfessionalFormNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.qualification || !formData.specialization || !formData.institution || !formData.experienceYears) {
            toast({
                title: "ত্রুটি",
                description: "সব বিশেষজ্ঞ তথ্য পূরণ করুন",
                variant: "destructive",
            });
            return;
        }
        setCurrentStep('documents');
    };

    // Step 4: Submit registration form
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.password || !formData.confirmPassword) {
            toast({
                title: "ত্রুটি",
                description: "পাসওয়ার্ড দিন",
                variant: "destructive",
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "ত্রুটি",
                description: "পাসওয়ার্ড মিলছে না",
                variant: "destructive",
            });
            return;
        }

        if (formData.password.length < 6) {
            toast({
                title: "ত্রুটি",
                description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
                variant: "destructive",
            });
            return;
        }

        if (!formData.fullName || !formData.nidNumber || !formData.dateOfBirth || !formData.fatherName || !formData.motherName || !formData.location) {
            toast({
                title: "ত্রুটি",
                description: "সব ব্যক্তিগত তথ্য পূরণ করুন",
                variant: "destructive",
            });
            return;
        }

        if (!formData.location?.postal_code) {
            toast({
                title: "ত্রুটি",
                description: "সম্পূর্ণ ঠিকানা নির্বাচন করুন (পোস্টাল কোড সহ)",
                variant: "destructive",
            });
            return;
        }

        if (!formData.address) {
            toast({
                title: "ত্রুটি",
                description: "ঠিকানা সম্পূর্ণভাবে পূরণ করুন",
                variant: "destructive",
            });
            return;
        }

        if (!formData.qualification || !formData.specialization || !formData.institution || !formData.experienceYears) {
            toast({
                title: "ত্রুটি",
                description: "সব বিশেষজ্ঞ তথ্য পূরণ করুন",
                variant: "destructive",
            });
            return;
        }

        if (!formData.profilePhoto) {
            toast({
                title: "ত্রুটি",
                description: "প্রোফাইল ছবি আপলোড করুন",
                variant: "destructive",
            });
            return;
        }

        if (!formData.certificationPhoto) {
            toast({
                title: "ত্রুটি",
                description: "সার্টিফিকেট/ডিগ্রি আপলোড করুন",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Create FormData for multipart/form-data request
            const requestFormData = new FormData();
            requestFormData.append('phone', formData.phone);
            requestFormData.append('password', formData.password);
            requestFormData.append('fullName', formData.fullName);
            requestFormData.append('nidNumber', formData.nidNumber);
            requestFormData.append('dateOfBirth', formData.dateOfBirth);
            requestFormData.append('fatherName', formData.fatherName);
            requestFormData.append('motherName', formData.motherName);
            requestFormData.append('address', formData.address);
            requestFormData.append('village', formData.location?.village || '');
            requestFormData.append('postalCode', formData.location?.postal_code?.toString() || '');
            requestFormData.append('otp_code', otp);
            
            // Expert specific fields
            requestFormData.append('qualification', formData.qualification);
            requestFormData.append('specialization', formData.specialization);
            requestFormData.append('experienceYears', formData.experienceYears);
            requestFormData.append('institution', formData.institution);
            
            // Optional fields
            if (formData.consultationFee) requestFormData.append('consultationFee', formData.consultationFee);
            if (formData.licenseNumber) requestFormData.append('licenseNumber', formData.licenseNumber);
            if (formData.availability) requestFormData.append('availability', formData.availability);
            if (formData.bio) requestFormData.append('bio', formData.bio);
            
            // File uploads
            if (formData.profilePhoto) requestFormData.append('profilePhoto', formData.profilePhoto);
            if (formData.certificationPhoto) requestFormData.append('certificationPhoto', formData.certificationPhoto);

            console.log('Sending registration with files...');

            const response = await fetch(`${API_BASE}/expert/register`, {
                method: 'POST',
                body: requestFormData,
                // Don't set Content-Type header - browser will set it with boundary
            });

            const data = await response.json();
            console.log('Registration response:', data);

            if (response.ok && data?.success) {
                // Store authentication data
                if (data.data?.token) {
                    localStorage.setItem('auth_token', data.data.token);
                    localStorage.setItem('user_data', JSON.stringify(data.data.user));

                    const backendUser = data.data.user;
                    setAuthUser({
                        id: backendUser.user_id?.toString() || '',
                        user_id: backendUser.user_id,
                        name: backendUser.profile?.full_name || 'বিশেষজ্ঞ',
                        type: 'expert',
                        email: backendUser.email || '',
                        phone: backendUser.phone,
                        profilePhoto: backendUser.profile?.profile_photo_url_full,
                        nidNumber: backendUser.profile?.nid_number,
                        location: backendUser.profile?.address
                    }, data.data.token);
                }

                toast({
                    title: "সফল",
                    description: "নিবন্ধন সফল হয়েছে",
                });

                setCurrentStep('success');

                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate('/consultant-dashboard');
                }, 2000);
            } else {
                console.error('Registration failed:', data);
                toast({
                    title: 'নিবন্ধন ব্যর্থ',
                    description: data?.message || data?.errors ? JSON.stringify(data.errors) : 'নিবন্ধন সম্পন্ন করা যায়নি।',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast({
                title: "ত্রুটি",
                description: "নিবন্ধনে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/expert/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    phone: formData.phone,
                    purpose: 'register'
                }),
            });

            const data = await response.json();

            if (data.success) {
                if (data.data?.otp_code) {
                    setGeneratedOtp(data.data.otp_code);
                    console.log('New OTP:', data.data.otp_code);
                }

                toast({
                    title: "নতুন OTP পাঠানো হয়েছে",
                    description: `আপনার ${formData.phone} নম্বরে নতুন OTP পাঠানো হয়েছে`,
                });
            } else {
                throw new Error(data.message || 'OTP পাঠাতে সমস্যা হয়েছে');
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "OTP পাঠাতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Step handlers
    const handleInfoFormNext = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.nidNumber || !formData.dateOfBirth || 
            !formData.fatherName || !formData.motherName || !formData.location || !formData.address) {
            toast({
                title: "ত্রুটি",
                description: "সব প্রয়োজনীয় তথ্য পূরণ করুন",
                variant: "destructive",
            });
            return;
        }

        if (!formData.location?.postal_code) {
            toast({
                title: "ত্রুটি",
                description: "সম্পূর্ণ ঠিকানা নির্বাচন করুন",
                variant: "destructive",
            });
            return;
        }

        if (!formData.qualification || !formData.specialization || !formData.institution || !formData.experienceYears) {
            toast({
                title: "ত্রুটি",
                description: "সব বিশেষজ্ঞ তথ্য পূরণ করুন",
                variant: "destructive",
            });
            return;
        }

        setCurrentStep('documents');
    };

    // Render phone form
    const renderPhoneForm = () => (
        <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <Phone className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                    বিশেষজ্ঞ হিসেবে নিবন্ধনের জন্য প্রথমে আপনার মোবাইল নম্বর যাচাই করুন
                </AlertDescription>
            </Alert>

            <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">
                    <Phone className="inline h-4 w-4 mr-1" />
                    মোবাইল নম্বর *
                </Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="০১XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="text-lg border-blue-200 focus:border-blue-500"
                />
            </div>

            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBackToMainRegister}
                    className="flex-1"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    ফিরে যান
                </Button>

                <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            পাঠানো হচ্ছে...
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
    );

    // Render OTP form
    const renderOtpForm = () => (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
            <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                    আপনার <span className="font-semibold">{formData.phone}</span> নম্বরে একটি ৬ ডিজিটের OTP কোড পাঠানো হয়েছে
                </AlertDescription>
            </Alert>

            <div className="space-y-3">
                <Label htmlFor="otp" className="text-base font-medium text-center block">
                    OTP কোড লিখুন *
                </Label>
                <Input
                    id="otp"
                    type="text"
                    placeholder="০০০০০০"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    className="text-center text-3xl tracking-[0.5em] font-bold border-blue-300 focus:border-blue-500"
                />
                <div className="text-sm text-center pt-2">
                    <span className="text-gray-600">OTP পাননি? </span>
                    <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                    >
                        আবার পাঠান
                    </Button>
                </div>
            </div>

            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep('phone')}
                    className="flex-1"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    নম্বর পরিবর্তন
                </Button>

                <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            যাচাই হচ্ছে...
                        </>
                    ) : (
                        <>
                            যাচাই করুন
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    );

    // Render personal info form (Step 2)
    const renderPersonalForm = () => (
        <form onSubmit={handlePersonalFormNext} className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
                <User className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                    আপনার ব্যক্তিগত তথ্য পূরণ করুন
                </AlertDescription>
            </Alert>

            {/* Personal Information */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-blue-200">
                    <User className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">ব্যক্তিগত তথ্য</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">পূর্ণ নাম *</Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="আপনার পূর্ণ নাম"
                            value={formData.fullName}
                            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                            required
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nidNumber">এনআইডি নম্বর *</Label>
                        <Input
                            id="nidNumber"
                            type="text"
                            placeholder="জাতীয় পরিচয়পত্র নম্বর"
                            value={formData.nidNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, nidNumber: e.target.value }))}
                            required
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">জন্ম তারিখ *</Label>
                        <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            required
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fatherName">পিতার নাম *</Label>
                        <Input
                            id="fatherName"
                            type="text"
                            placeholder="পিতার পূর্ণ নাম"
                            value={formData.fatherName}
                            onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                            required
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="motherName">মাতার নাম *</Label>
                        <Input
                            id="motherName"
                            type="text"
                            placeholder="মাতার পূর্ণ নাম"
                            value={formData.motherName}
                            onChange={(e) => setFormData(prev => ({ ...prev, motherName: e.target.value }))}
                            required
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-blue-200">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">ঠিকানা</h3>
                </div>

                <div className="space-y-2">
                <Label className="text-base font-medium">সম্পূর্ণ ঠিকানা *</Label>
                <LocationSelector
                    value={formData.location}
                    onChange={handleLocationChange}
                    onAddressChange={handleAddressChange}
                />
                {formData.address && (
                    <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-1">নির্বাচিত ঠিকানা:</p>
                        <p className="text-sm text-blue-700 font-medium">{formData.address}</p>
                    </div>
                )}
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep('otp')}
                    className="flex-1"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    পূর্ববর্তী
                </Button>

                <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                    পরবর্তী
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
    );

    // Render professional info form (Step 3)
    const renderProfessionalForm = () => (
        <form onSubmit={handleProfessionalFormNext} className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
                <UserCheck className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                    আপনার বিশেষজ্ঞ যোগ্যতা পূরণ করুন
                </AlertDescription>
            </Alert>

            {/* Expert Qualification */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-blue-200">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">বিশেষজ্ঞ যোগ্যতা</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="qualification">শিক্ষাগত যোগ্যতা *</Label>
                        <Input
                            id="qualification"
                            type="text"
                            placeholder="যেমন: কৃষি বিষয়ে স্নাতক/স্নাতকোত্তর"
                            value={formData.qualification}
                            onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                            required
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="specialization">বিশেষত্ব *</Label>
                        <Input
                            id="specialization"
                            type="text"
                            placeholder="যেমন: ফসল উৎপাদন, মাটি বিজ্ঞান"
                            value={formData.specialization}
                            onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                            required
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="institution">প্রতিষ্ঠান *</Label>
                        <Input
                            id="institution"
                            type="text"
                            placeholder="যেমন: কৃষি বিশ্ববিদ্যালয়, কৃষি সম্প্রসারণ অধিদপ্তর"
                            value={formData.institution}
                            onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                            required
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="experienceYears">অভিজ্ঞতা (বছর) *</Label>
                        <Input
                            id="experienceYears"
                            type="number"
                            placeholder="যেমন: ৫"
                            value={formData.experienceYears}
                            onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                            required
                            min="0"
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="consultationFee">পরামর্শ ফি (টাকা)</Label>
                        <Input
                            id="consultationFee"
                            type="number"
                            placeholder="যেমন: 500"
                            value={formData.consultationFee}
                            onChange={(e) => setFormData(prev => ({ ...prev, consultationFee: e.target.value }))}
                            min="0"
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="licenseNumber">লাইসেন্স নম্বর (যদি থাকে)</Label>
                        <Input
                            id="licenseNumber"
                            type="text"
                            placeholder="লাইসেন্স নম্বর"
                            value={formData.licenseNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="availability">কাজের সময়</Label>
                        <Input
                            id="availability"
                            type="text"
                            placeholder="যেমন: সকাল ৯টা - বিকাল ৫টা"
                            value={formData.availability}
                            onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">সংক্ষিপ্ত পরিচয়</Label>
                    <Textarea
                        id="bio"
                        placeholder="আপনার কাজের অভিজ্ঞতা ও বিশেষত্ব সম্পর্কে লিখুন..."
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        className="border-blue-200 focus:border-blue-500"
                        rows={3}
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep('personal')}
                    className="flex-1"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    পূর্ববর্তী
                </Button>

                <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                    পরবর্তী
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
    );

    // Render documents form (Step 3 - Documents + Password)
    const renderDocumentsForm = () => (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
                <FileText className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                    প্রোফাইল ছবি, সার্টিফিকেট এবং পাসওয়ার্ড দিন
                </AlertDescription>
            </Alert>

            {/* Documents Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-blue-200">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">ছবি ও ডকুমেন্টস</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Profile Photo */}
                    <div className="space-y-2">
                        <Label>প্রোফাইল ছবি *</Label>
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-blue-50/30">
                            {profilePhotoPreview ? (
                                <div className="space-y-2">
                                    <img src={profilePhotoPreview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-full" />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => profilePhotoRef.current?.click()}
                                        className="border-blue-300 text-blue-600"
                                    >
                                        <Camera className="h-4 w-4 mr-2" />
                                        ছবি পরিবর্তন করুন
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Camera className="mx-auto h-8 w-8 text-blue-400 mb-2" />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => profilePhotoRef.current?.click()}
                                        className="mb-2 border-blue-300 text-blue-600"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        প্রোফাইল ছবি আপলোড করুন
                                    </Button>
                                    <p className="text-xs text-gray-500">আপনার প্রোফাইল ছবি</p>
                                </>
                            )}
                            <input
                                ref={profilePhotoRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    handleFileChange('profilePhoto', e.target.files?.[0] || null);
                                    e.target.value = '';
                                }}
                            />
                        </div>
                    </div>

                    {/* Certification Photo */}
                    <div className="space-y-2">
                        <Label>সার্টিফিকেট/ডিগ্রি *</Label>
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center bg-blue-50/30">
                            {certificationPhotoPreview ? (
                                <div className="space-y-2">
                                    {certificationPhotoPreview.startsWith('data:image') ? (
                                        <img src={certificationPhotoPreview} alt="Preview" className="mx-auto h-32 object-contain" />
                                    ) : (
                                        <div className="mx-auto h-32 flex items-center justify-center">
                                            <FileText className="h-16 w-16 text-blue-600" />
                                        </div>
                                    )}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => certificationPhotoRef.current?.click()}
                                        className="border-blue-300 text-blue-600"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        পরিবর্তন করুন
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <FileText className="mx-auto h-8 w-8 text-blue-400 mb-2" />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => certificationPhotoRef.current?.click()}
                                        className="mb-2 border-blue-300 text-blue-600"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        সার্টিফিকেট আপলোড করুন
                                    </Button>
                                    <p className="text-xs text-gray-500">শিক্ষাগত যোগ্যতার সার্টিফিকেট বা ডিগ্রি</p>
                                </>
                            )}
                            <input
                                ref={certificationPhotoRef}
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                    handleFileChange('certificationPhoto', e.target.files?.[0] || null);
                                    e.target.value = '';
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-blue-200">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">নিরাপত্তা</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">পাসওয়ার্ড *</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            required
                            minLength={6}
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন *</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="আবার পাসওয়ার্ড দিন"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            required
                            minLength={6}
                            className="border-blue-200 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep('professional')}
                    className="flex-1"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    পূর্ববর্তী
                </Button>

                <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            নিবন্ধন হচ্ছে...
                        </>
                    ) : (
                        <>
                            নিবন্ধন সম্পন্ন করুন
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    );

    // Render success message
    const renderSuccess = () => (
        <div className="text-center space-y-6 py-12">
            <div className="flex justify-center animate-bounce">
                <div className="rounded-full bg-gradient-to-br from-green-100 to-green-200 p-8 shadow-lg">
                    <CheckCircle className="h-20 w-20 text-green-600" />
                </div>
            </div>
            
            <div className="space-y-3">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    নিবন্ধন সফল!
                </h3>
                <p className="text-gray-600 text-lg">
                    স্বাগতম! আপনার বিশেষজ্ঞ অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে
                </p>
                <p className="text-sm text-gray-500">
                    এখন আপনি কৃষকদের পরামর্শ প্রদান করতে পারবেন
                </p>
            </div>

            <Alert className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                    আপনাকে স্বয়ংক্রিয়ভাবে ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...
                </AlertDescription>
            </Alert>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl flex items-center justify-center gap-2">
                        <UserCheck className="h-6 w-6" />
                        বিশেষজ্ঞ নিবন্ধন
                    </CardTitle>
                    <CardDescription className="text-blue-50">
                        {currentStep === 'phone' && 'ধাপ ১/৪: মোবাইল নম্বর যাচাই করুন'}
                        {currentStep === 'otp' && 'OTP যাচাই করুন'}
                        {currentStep === 'personal' && 'ধাপ ২/৪: ব্যক্তিগত তথ্য পূরণ করুন'}
                        {currentStep === 'professional' && 'ধাপ ৩/৪: বিশেষজ্ঞ যোগ্যতা পূরণ করুন'}
                        {currentStep === 'documents' && 'ধাপ ৪/৪: ডকুমেন্টস ও পাসওয়ার্ড'}
                        {currentStep === 'success' && 'নিবন্ধন সম্পন্ন'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    {currentStep === 'phone' && renderPhoneForm()}
                    {currentStep === 'otp' && renderOtpForm()}
                    {currentStep === 'personal' && renderPersonalForm()}
                    {currentStep === 'professional' && renderProfessionalForm()}
                    {currentStep === 'documents' && renderDocumentsForm()}
                    {currentStep === 'success' && renderSuccess()}
                </CardContent>
            </Card>
        </div>
    );
};

export default ExpertRegistration;
