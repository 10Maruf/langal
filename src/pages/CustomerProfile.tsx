import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    User,
    MapPin,
    Phone,
    Calendar,
    Edit,
    Save,
    Camera,
    ArrowLeft,
    Building2,
    FileText,
    Loader2,
    X,
    IdCard,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import api from "@/services/api";
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

interface CustomerProfileData {
    // User info
    userId: number;
    phone: string;
    isVerified: boolean;

    // Profile info
    fullName: string;
    fatherName: string;
    motherName: string;
    dateOfBirth: string;
    nidNumber: string;
    address: string;
    village: string;
    postalCode: number | null;
    profilePhotoUrl: string | null;
    verificationStatus: string;

    // Business info
    businessName: string;
    businessType: string;
    customBusinessType: string;
    tradeLicenseNumber: string;
    establishedYear: number | null;
    businessAddress: string;

    // Location info
    locationInfo: {
        village: string;
        postal_code: number;
        post_office_bn: string;
        upazila_bn: string;
        district_bn: string;
        division_bn: string;
    } | null;

    // Dates
    createdAt: string;
}

const CustomerProfile = () => {
    const { toast } = useToast();
    const { user, setAuthUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
    const profilePhotoRef = useRef<HTMLInputElement>(null);

    const [profileData, setProfileData] = useState<CustomerProfileData>({
        userId: 0,
        phone: '',
        isVerified: false,
        fullName: '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        nidNumber: '',
        address: '',
        village: '',
        postalCode: null,
        profilePhotoUrl: null,
        verificationStatus: 'pending',
        businessName: '',
        businessType: '',
        customBusinessType: '',
        tradeLicenseNumber: '',
        establishedYear: null,
        businessAddress: '',
        locationInfo: null,
        createdAt: '',
    });

    const [editData, setEditData] = useState<Partial<CustomerProfileData>>({});
    const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [location, setLocation] = useState<LocationData | null>(null);

    // Load profile data on mount
    useEffect(() => {
        loadProfile();
        loadBusinessTypes();
    }, []);

    const loadProfile = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/customer/profile');
            if (response.data.success) {
                const data = response.data.data;
                const profile = data.profile || {};
                const business = data.customer_business || {};

                setProfileData({
                    userId: data.user_id,
                    phone: data.phone || '',
                    isVerified: data.is_verified || false,
                    fullName: profile.full_name || '',
                    fatherName: profile.father_name || '',
                    motherName: profile.mother_name || '',
                    dateOfBirth: profile.date_of_birth || '',
                    nidNumber: profile.nid_number || '',
                    address: profile.address || '',
                    village: profile.village || '',
                    postalCode: profile.postal_code || null,
                    profilePhotoUrl: profile.profile_photo_url_full || null,
                    verificationStatus: profile.verification_status || 'pending',
                    businessName: business.business_name || '',
                    businessType: business.business_type || '',
                    customBusinessType: business.custom_business_type || '',
                    tradeLicenseNumber: business.trade_license_number || '',
                    establishedYear: business.established_year || null,
                    businessAddress: business.business_address || '',
                    locationInfo: data.location_info || null,
                    createdAt: data.created_at || '',
                });

                // Set location if available
                if (data.location_info) {
                    setLocation({
                        division: '',
                        division_bn: data.location_info.division_bn || '',
                        district: '',
                        district_bn: data.location_info.district_bn || '',
                        upazila: '',
                        upazila_bn: data.location_info.upazila_bn || '',
                        post_office: '',
                        post_office_bn: data.location_info.post_office_bn || '',
                        postal_code: data.location_info.postal_code || 0,
                        village: data.location_info.village || '',
                    });
                }
            }
        } catch (error: any) {
            console.error('Error loading profile:', error);
            if (error.response?.status === 401) {
                toast({
                    title: "সেশন শেষ",
                    description: "অনুগ্রহ করে আবার লগইন করুন",
                    variant: "destructive",
                });
                navigate('/login');
            } else {
                toast({
                    title: "ত্রুটি",
                    description: "প্রোফাইল লোড করতে সমস্যা হয়েছে",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const loadBusinessTypes = async () => {
        try {
            const response = await api.get('/customer/business-types');
            if (response.data.success) {
                setBusinessTypes(response.data.data);
            }
        } catch (error) {
            console.error('Error loading business types:', error);
        }
    };

    const handleEdit = () => {
        setEditData({
            fullName: profileData.fullName,
            fatherName: profileData.fatherName,
            motherName: profileData.motherName,
            dateOfBirth: profileData.dateOfBirth,
            businessName: profileData.businessName,
            businessType: profileData.businessType,
            customBusinessType: profileData.customBusinessType,
            tradeLicenseNumber: profileData.tradeLicenseNumber,
            establishedYear: profileData.establishedYear,
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({});
        setNewProfilePhoto(null);
        setPhotoPreview(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();

            // Add edited fields
            if (editData.fullName) formData.append('fullName', editData.fullName);
            if (editData.fatherName) formData.append('fatherName', editData.fatherName);
            if (editData.motherName) formData.append('motherName', editData.motherName);
            if (editData.dateOfBirth) formData.append('dateOfBirth', editData.dateOfBirth);
            if (editData.businessName) formData.append('businessName', editData.businessName);
            if (editData.businessType) formData.append('businessType', editData.businessType);
            if (editData.businessType === 'other' && editData.customBusinessType) {
                formData.append('customBusinessType', editData.customBusinessType);
            }
            if (editData.tradeLicenseNumber !== undefined) {
                formData.append('tradeLicenseNumber', editData.tradeLicenseNumber);
            }
            if (editData.establishedYear) {
                formData.append('establishedYear', editData.establishedYear.toString());
            }

            // Add location if changed
            if (location) {
                formData.append('postal_code', location.postal_code.toString());
                formData.append('village', location.village || '');
            }

            // Add profile photo if changed
            if (newProfilePhoto) {
                formData.append('profilePhoto', newProfilePhoto);
            }

            const response = await api.post('/customer/profile', formData);

            if (response.data.success) {
                toast({
                    title: "সফল",
                    description: "প্রোফাইল আপডেট হয়েছে",
                });

                // Update local state
                await loadProfile();

                // Update auth context
                if (user) {
                    const updatedUser = {
                        ...user,
                        name: editData.fullName || user.name,
                    };
                    setAuthUser(updatedUser, localStorage.getItem('auth_token') || '');
                }

                setIsEditing(false);
                setEditData({});
                setNewProfilePhoto(null);
                setPhotoPreview(null);
            }
        } catch (error: any) {
            console.error('Error saving profile:', error);
            toast({
                title: "ত্রুটি",
                description: error.response?.data?.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewProfilePhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getBusinessTypeLabel = (type: string): string => {
        if (type === 'other' && profileData.customBusinessType) {
            return profileData.customBusinessType;
        }
        const found = businessTypes.find(bt => bt.value === type);
        return found?.label || type;
    };

    const getVerificationBadge = () => {
        switch (profileData.verificationStatus) {
            case 'approved':
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        যাচাইকৃত
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <XCircle className="mr-1 h-3 w-3" />
                        প্রত্যাখ্যাত
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Clock className="mr-1 h-3 w-3" />
                        মুলতবি
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        যাচাই অপেক্ষমান
                    </Badge>
                );
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/customer-dashboard">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                ড্যাশবোর্ডে ফিরুন
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">আমার প্রোফাইল</h1>
                    <p className="text-muted-foreground">আপনার ব্যক্তিগত তথ্য ও ব্যবসার তথ্য</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Rejection Alert */}
                    {profileData.verificationStatus === 'rejected' && (
                        <div className="lg:col-span-3 mb-4">
                            <Card className="border-red-200 bg-red-50">
                                <CardContent className="pt-6">
                                    <div className="flex items-start">
                                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-red-800">প্রোফাইল প্রত্যাখ্যাত</h4>
                                            <p className="text-sm text-red-700 mt-1">
                                                আপনার প্রোফাইল প্রত্যাখ্যাত হয়েছে। সঠিক তথ্য দিয়ে প্রোফাইল সংশোধনের জন্য অনুগ্রহ করে নিকটস্থ কৃষি অফিসে যোগাযোগ করুন।
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Profile Card - Left Side */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="relative mx-auto">
                                    <Avatar className="w-24 h-24 mx-auto">
                                        <AvatarImage src={photoPreview || profileData.profilePhotoUrl || ''} />
                                        <AvatarFallback className="text-2xl bg-purple-100 text-purple-600">
                                            {profileData.fullName?.charAt(0) || 'C'}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                                            onClick={() => profilePhotoRef.current?.click()}
                                        >
                                            <Camera className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <input
                                        ref={profilePhotoRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold">{profileData.fullName}</h2>
                                    <p className="text-muted-foreground text-sm">{profileData.businessName}</p>
                                    <div className="mt-2">
                                        {getVerificationBadge()}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{profileData.phone}</span>
                                    </div>
                                    {profileData.address && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                            <span className="break-words">{profileData.address}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>যোগদান: {formatDate(profileData.createdAt)}</span>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                {/* Business Info Summary */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Building2 className="h-4 w-4 text-purple-500" />
                                        <span>{getBusinessTypeLabel(profileData.businessType)}</span>
                                    </div>
                                    {profileData.establishedYear && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-purple-500" />
                                            <span>প্রতিষ্ঠিত: {profileData.establishedYear}</span>
                                        </div>
                                    )}
                                    {profileData.tradeLicenseNumber && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <FileText className="h-4 w-4 text-purple-500" />
                                            <span>লাইসেন্স: {profileData.tradeLicenseNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content - Right Side */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-purple-600" />
                                    ব্যক্তিগত তথ্য
                                </CardTitle>
                                {!isEditing ? (
                                    <Button variant="outline" size="sm" onClick={handleEdit}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        এডিট করুন
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
                                            {isSaving ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="h-4 w-4 mr-2" />
                                            )}
                                            সেভ করুন
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleCancel}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="fullName">পূর্ণ নাম</Label>
                                        <Input
                                            id="fullName"
                                            value={isEditing ? (editData.fullName || '') : profileData.fullName}
                                            onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                                            disabled={!isEditing}
                                            className={isEditing ? "border-purple-200" : "text-black opacity-100"}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">মোবাইল নম্বর</Label>
                                        <Input
                                            id="phone"
                                            value={profileData.phone}
                                            disabled
                                            className="bg-gray-50 text-black opacity-100"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">মোবাইল নম্বর পরিবর্তন করা যায় না</p>
                                    </div>
                                    <div>
                                        <Label htmlFor="fatherName">পিতার নাম</Label>
                                        <Input
                                            id="fatherName"
                                            value={isEditing ? (editData.fatherName || '') : profileData.fatherName}
                                            onChange={(e) => setEditData(prev => ({ ...prev, fatherName: e.target.value }))}
                                            disabled={!isEditing}
                                            className={isEditing ? "border-purple-200" : "text-black opacity-100"}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="motherName">মাতার নাম</Label>
                                        <Input
                                            id="motherName"
                                            value={isEditing ? (editData.motherName || '') : profileData.motherName}
                                            onChange={(e) => setEditData(prev => ({ ...prev, motherName: e.target.value }))}
                                            disabled={!isEditing}
                                            className={isEditing ? "border-purple-200" : "text-black opacity-100"}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="dateOfBirth">জন্ম তারিখ</Label>
                                        <Input
                                            id="dateOfBirth"
                                            type={isEditing ? "date" : "text"}
                                            value={isEditing ? (editData.dateOfBirth || '') : (profileData.dateOfBirth ? formatDate(profileData.dateOfBirth) : '')}
                                            onChange={(e) => setEditData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                            disabled={!isEditing}
                                            className={isEditing ? "border-purple-200" : "text-black opacity-100"}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="nid">NID নম্বর</Label>
                                        <div className="relative">
                                            <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                                            <Input
                                                id="nid"
                                                value={profileData.nidNumber}
                                                disabled
                                                className="pl-10 bg-gray-50 text-black opacity-100"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>যাচাই স্ট্যাটাস</Label>
                                        <div className="mt-2">
                                            {getVerificationBadge()}
                                        </div>
                                    </div>
                                </div>

                                {/* Location Section */}
                                {isEditing && (
                                    <div className="mt-6">
                                        <Label className="mb-2 block">ঠিকানা পরিবর্তন করুন</Label>
                                        <LocationSelector
                                            value={location}
                                            onChange={(loc) => setLocation(loc)}
                                        />
                                    </div>
                                )}

                                {!isEditing && profileData.locationInfo && (
                                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                                        <Label className="text-sm text-purple-700">ঠিকানা:</Label>
                                        <p className="text-purple-900 mt-1">
                                            {[
                                                profileData.locationInfo.village,
                                                profileData.locationInfo.post_office_bn,
                                                profileData.locationInfo.upazila_bn,
                                                profileData.locationInfo.district_bn,
                                                profileData.locationInfo.division_bn
                                            ].filter(Boolean).join(', ')}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Business Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-purple-600" />
                                    ব্যবসার তথ্য
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="businessName">ব্যবসার নাম</Label>
                                        <Input
                                            id="businessName"
                                            value={isEditing ? (editData.businessName || '') : profileData.businessName}
                                            onChange={(e) => setEditData(prev => ({ ...prev, businessName: e.target.value }))}
                                            disabled={!isEditing}
                                            className={isEditing ? "border-purple-200" : "text-black opacity-100"}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="businessType">ব্যবসার ধরণ</Label>
                                        {isEditing ? (
                                            <Select
                                                value={editData.businessType || profileData.businessType}
                                                onValueChange={(value) => setEditData(prev => ({ ...prev, businessType: value }))}
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
                                        ) : (
                                            <Input
                                                value={getBusinessTypeLabel(profileData.businessType)}
                                                disabled
                                                className="text-black opacity-100"
                                            />
                                        )}
                                    </div>

                                    {/* Custom business type input */}
                                    {isEditing && (editData.businessType === 'other' || (!editData.businessType && profileData.businessType === 'other')) && (
                                        <div className="md:col-span-2">
                                            <Label htmlFor="customBusinessType">ব্যবসার ধরণ লিখুন</Label>
                                            <Input
                                                id="customBusinessType"
                                                value={editData.customBusinessType || profileData.customBusinessType}
                                                onChange={(e) => setEditData(prev => ({ ...prev, customBusinessType: e.target.value }))}
                                                placeholder="আপনার ব্যবসার ধরণ লিখুন"
                                                className="border-purple-200"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="establishedYear">প্রতিষ্ঠার বছর</Label>
                                        <Input
                                            id="establishedYear"
                                            type="number"
                                            value={isEditing ? (editData.establishedYear || '') : (profileData.establishedYear || '')}
                                            onChange={(e) => setEditData(prev => ({ ...prev, establishedYear: parseInt(e.target.value) || null }))}
                                            disabled={!isEditing}
                                            placeholder="যেমন: ২০১৫"
                                            className={isEditing ? "border-purple-200" : "text-black opacity-100"}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="tradeLicense">ট্রেড লাইসেন্স নম্বর</Label>
                                        <Input
                                            id="tradeLicense"
                                            value={isEditing ? (editData.tradeLicenseNumber ?? profileData.tradeLicenseNumber) : profileData.tradeLicenseNumber}
                                            onChange={(e) => setEditData(prev => ({ ...prev, tradeLicenseNumber: e.target.value }))}
                                            disabled={!isEditing}
                                            placeholder="ঐচ্ছিক"
                                            className={isEditing ? "border-purple-200" : "text-black opacity-100"}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
