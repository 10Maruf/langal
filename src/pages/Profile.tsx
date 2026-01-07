import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User,
    MapPin,
    Phone,
    Calendar,
    CreditCard,
    Briefcase,
    Edit,
    Camera,
    Save,
    X,
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Leaf,
    TreeDeciduous,
    Home,
    IdCard,
    FileText,
    Tractor,
    LandPlot,
    Timer
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getProfilePhotoUrl } from "@/lib/utils";

const Profile = () => {
    const navigate = useNavigate();
    const { user, setAuthUser } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        nid: "",
        address: "",
        dateOfBirth: "",
        occupation: "কৃষক",
        farmSize: "",
        farmSizeUnit: "bigha" as 'bigha' | 'katha' | 'acre',
        crops: "",
        experience: "",
        landOwnership: "",
        krishiCardNumber: "",
        bio: "",
        profilePhotoUrl: "",
        verificationStatus: "pending" as 'pending' | 'approved' | 'rejected'
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/farmer/profile');
                if (response.data.success) {
                    const userData = response.data.data.user;
                    const profile = userData.profile || {};
                    const farmer = userData.farmer || {};
                    const additionalInfo = farmer.additional_info || {};

                    setProfileData(prev => ({
                        ...prev,
                        name: profile.full_name || "",
                        email: userData.email || "",
                        phone: userData.phone || "",
                        nid: profile.nid_number || "",
                        address: profile.address || "",
                        dateOfBirth: profile.date_of_birth || "",
                        profilePhotoUrl: profile.profile_photo_url_full || "",
                        verificationStatus: profile.verification_status || "pending",
                        occupation: additionalInfo.occupation || "কৃষক",
                        farmSize: farmer.farm_size ? String(farmer.farm_size) : "",
                        farmSizeUnit: farmer.farm_size_unit || "bigha",
                        crops: farmer.farm_type || "",
                        experience: farmer.experience_years ? String(farmer.experience_years) : "",
                        landOwnership: farmer.land_ownership || "",
                        krishiCardNumber: farmer.krishi_card_number || "",
                        bio: additionalInfo.bio || ""
                    }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast({
                    title: "ত্রুটি",
                    description: "প্রোফাইল তথ্য লোড করতে সমস্যা হয়েছে",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleProfilePhotoClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "ত্রুটি",
                    description: "শুধুমাত্র ছবি ফাইল নির্বাচন করুন",
                    variant: "destructive",
                });
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "ত্রুটি",
                    description: "ছবির সাইজ ৫ MB এর কম হতে হবে",
                    variant: "destructive",
                });
                return;
            }

            setSelectedProfilePhoto(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            // Create FormData for multipart/form-data
            const formData = new FormData();

            formData.append('full_name', profileData.name);
            formData.append('phone', profileData.phone);
            formData.append('address', profileData.address);
            formData.append('farm_size', profileData.farmSize || '0');
            formData.append('farm_size_unit', profileData.farmSizeUnit);
            formData.append('farm_type', profileData.crops);
            formData.append('experience_years', profileData.experience || '0');
            formData.append('land_ownership', profileData.landOwnership);
            formData.append('krishi_card_number', profileData.krishiCardNumber);
            formData.append('additional_info', JSON.stringify({
                bio: profileData.bio,
                occupation: profileData.occupation
            }));

            // Add profile photo if selected
            if (selectedProfilePhoto) {
                formData.append('profile_photo', selectedProfilePhoto);
            }

            // Don't set Content-Type header manually for FormData - axios will set it with proper boundary
            const response = await api.post('/farmer/profile', formData);

            if (response.data.success) {
                // Update local state with fresh data from server
                const userData = response.data.data.user;
                const profile = userData.profile || {};
                const farmer = userData.farmer || {};
                const additionalInfo = farmer.additional_info || {};

                setProfileData(prev => ({
                    ...prev,
                    name: profile.full_name || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    nid: profile.nid_number || "",
                    address: profile.address || "",
                    dateOfBirth: profile.date_of_birth || "",
                    profilePhotoUrl: profile.profile_photo_url_full || "",
                    occupation: additionalInfo.occupation || "কৃষক",
                    farmSize: farmer.farm_size ? String(farmer.farm_size) : "",
                    farmSizeUnit: farmer.farm_size_unit || "bigha",
                    crops: farmer.farm_type || "",
                    experience: farmer.experience_years ? String(farmer.experience_years) : "",
                    landOwnership: farmer.land_ownership || "",
                    krishiCardNumber: farmer.krishi_card_number || "",
                    bio: additionalInfo.bio || ""
                }));

                // Clear selected photo and preview
                setSelectedProfilePhoto(null);
                setPreviewUrl("");

                // Update AuthContext with new verification status
                if (user) {
                    setAuthUser({
                        ...user,
                        name: profile.full_name || user.name,
                        profilePhoto: profile.profile_photo_url_full || user.profilePhoto,
                        verificationStatus: profile.verification_status || 'pending'
                    }, localStorage.getItem('auth_token') || '');
                }

                toast({
                    title: "সফল",
                    description: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে",
                });
                setIsEditing(false);
            }
        } catch (error: any) {
            console.error("Error updating profile:", error);

            // Get error message from server response if available
            const errorMessage = error?.response?.data?.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে";

            toast({
                title: "ত্রুটি",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedProfilePhoto(null);
        setPreviewUrl("");
        // Reset to original data if needed
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-6 pb-20">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Back Button */}
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            ফিরে যান
                        </Button>
                    </div>

                    {/* Verification Status Alerts */}
                    {profileData.verificationStatus === 'approved' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-medium text-green-800">প্রোফাইল যাচাইকৃত</h4>
                                    <p className="text-sm text-green-700 mt-1">
                                        আপনার প্রোফাইল সফলভাবে যাচাই করা হয়েছে। আপনি সকল সেবা ব্যবহার করতে পারবেন।
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {profileData.verificationStatus === 'pending' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <Clock className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-medium text-yellow-800">যাচাই মুলতবি</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        আপনার প্রোফাইল যাচাইয়ের জন্য অপেক্ষমাণ। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {profileData.verificationStatus === 'rejected' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-medium text-red-800">প্রোফাইল প্রত্যাখ্যাত</h4>
                                    <p className="text-sm text-red-700 mt-1">
                                        আপনার প্রোফাইল প্রত্যাখ্যাত হয়েছে। সঠিক তথ্য দিয়ে পুনরায় আপডেট করার জন্য অনুগ্রহ করে নিকটস্থ কৃষি অফিসে যোগাযোগ করুন।
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile Header */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage
                                            src={previewUrl || getProfilePhotoUrl(profileData.profilePhotoUrl) || "/img/farmer-avatar.jpg"}
                                            alt="Profile"
                                        />
                                        <AvatarFallback className="text-2xl">
                                            {profileData.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleProfilePhotoChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                                                onClick={handleProfilePhotoClick}
                                                type="button"
                                            >
                                                <Camera className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <h1 className="text-2xl font-bold">{profileData.name}</h1>
                                        {profileData.verificationStatus === 'approved' && (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                যাচাইকৃত
                                            </Badge>
                                        )}
                                        {profileData.verificationStatus === 'pending' && (
                                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                                <Clock className="mr-1 h-3 w-3" />
                                                মুলতবি
                                            </Badge>
                                        )}
                                        {profileData.verificationStatus === 'rejected' && (
                                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                                <XCircle className="mr-1 h-3 w-3" />
                                                প্রত্যাখ্যাত
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground">{profileData.occupation}</p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                                        {profileData.experience && (
                                            <Badge variant="secondary">{profileData.experience} বছর অভিজ্ঞতা</Badge>
                                        )}
                                        {profileData.farmSize && (
                                            <Badge variant="outline">
                                                {profileData.farmSize} {profileData.farmSizeUnit === 'bigha' ? 'বিঘা' : profileData.farmSizeUnit === 'katha' ? 'কাঠা' : 'একর'} জমি
                                            </Badge>
                                        )}
                                        {profileData.crops && (
                                            <Badge variant="outline">{profileData.crops}</Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    {!isEditing ? (
                                        <Button onClick={() => setIsEditing(true)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            সম্পাদনা করুন
                                        </Button>
                                    ) : (
                                        <>
                                            <Button onClick={handleSave}>
                                                <Save className="h-4 w-4 mr-2" />
                                                সংরক্ষণ
                                            </Button>
                                            <Button variant="outline" onClick={handleCancel}>
                                                <X className="h-4 w-4 mr-2" />
                                                বাতিল
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Personal Information */}
                        <Card className="border-l-4 border-l-emerald-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-emerald-700">
                                    <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                                        <User className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    ব্যক্তিগত তথ্য
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Name */}
                                <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
                                    <User className="h-5 w-5 text-emerald-600 mr-3" />
                                    <div className="flex-1">
                                        <Label htmlFor="name" className="text-xs text-emerald-600 font-medium">নাম</Label>
                                        {isEditing ? (
                                            <Input
                                                id="name"
                                                value={profileData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="mt-1"
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-800">{profileData.name || 'উল্লেখ করা হয়নি'}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Date of Birth */}
                                <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                                    <Calendar className="h-5 w-5 text-pink-600 mr-3" />
                                    <div className="flex-1">
                                        <Label htmlFor="dob" className="text-xs text-pink-600 font-medium">জন্ম তারিখ</Label>
                                        {isEditing ? (
                                            <Input
                                                id="dob"
                                                type="date"
                                                value={profileData.dateOfBirth}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                className="mt-1"
                                                disabled
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-800">{profileData.dateOfBirth || 'উল্লেখ করা হয়নি'}</p>
                                        )}
                                    </div>
                                </div>

                                {/* NID */}
                                <div className="flex items-center p-3 bg-cyan-50 rounded-lg">
                                    <CreditCard className="h-5 w-5 text-cyan-600 mr-3" />
                                    <div className="flex-1">
                                        <Label htmlFor="nid" className="text-xs text-cyan-600 font-medium">জাতীয় পরিচয়পত্র নম্বর</Label>
                                        {isEditing ? (
                                            <Input
                                                id="nid"
                                                value={profileData.nid}
                                                onChange={(e) => handleInputChange('nid', e.target.value)}
                                                className="mt-1"
                                                disabled
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-800">{profileData.nid || 'উল্লেখ করা হয়নি'}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Occupation */}
                                <div className="flex items-center p-3 bg-violet-50 rounded-lg">
                                    <Briefcase className="h-5 w-5 text-violet-600 mr-3" />
                                    <div className="flex-1">
                                        <Label htmlFor="occupation" className="text-xs text-violet-600 font-medium">পেশা</Label>
                                        {isEditing ? (
                                            <Input
                                                id="occupation"
                                                value={profileData.occupation}
                                                onChange={(e) => handleInputChange('occupation', e.target.value)}
                                                className="mt-1"
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-800">{profileData.occupation}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-blue-700">
                                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                        <Phone className="h-5 w-5 text-blue-600" />
                                    </div>
                                    যোগাযোগের তথ্য
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                    <Phone className="h-5 w-5 text-blue-600 mr-3" />
                                    <div className="flex-1">
                                        <Label htmlFor="phone" className="text-xs text-blue-600 font-medium">মোবাইল নম্বর</Label>
                                        {isEditing ? (
                                            <Input
                                                id="phone"
                                                value={profileData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="mt-1"
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-800">{profileData.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                                    <MapPin className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                                    <div className="flex-1">
                                        <Label htmlFor="address" className="text-xs text-gray-600 font-medium">ঠিকানা</Label>
                                        {isEditing ? (
                                            <Textarea
                                                id="address"
                                                value={profileData.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                rows={3}
                                                className="mt-1"
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-gray-800">{profileData.address || 'উল্লেখ করা হয়নি'}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Farm Information */}
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-green-700">
                                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                                        <Leaf className="h-5 w-5 text-green-600" />
                                    </div>
                                    কৃষি তথ্য
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Farm Size */}
                                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                    <LandPlot className="h-5 w-5 text-green-600 mr-3" />
                                    <div className="flex-1">
                                        <Label htmlFor="farmSize" className="text-xs text-green-600 font-medium">জমির পরিমাণ</Label>
                                        {isEditing ? (
                                            <div className="flex gap-2 mt-1">
                                                <Input
                                                    id="farmSize"
                                                    type="number"
                                                    value={profileData.farmSize}
                                                    onChange={(e) => handleInputChange('farmSize', e.target.value)}
                                                    placeholder="জমির পরিমাণ"
                                                    className="flex-1"
                                                />
                                                <select
                                                    value={profileData.farmSizeUnit}
                                                    onChange={(e) => handleInputChange('farmSizeUnit', e.target.value)}
                                                    className="px-3 py-2 border rounded-md bg-background"
                                                >
                                                    <option value="bigha">বিঘা</option>
                                                    <option value="katha">কাঠা</option>
                                                    <option value="acre">একর</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-800">
                                                {profileData.farmSize ? `${profileData.farmSize} ${profileData.farmSizeUnit === 'bigha' ? 'বিঘা' : profileData.farmSizeUnit === 'katha' ? 'কাঠা' : 'একর'}` : 'উল্লেখ করা হয়নি'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Crops */}
                                <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                                    <TreeDeciduous className="h-5 w-5 text-amber-600 mr-3" />
                                    <div className="flex-1">
                                        <Label htmlFor="crops" className="text-xs text-amber-600 font-medium">ফসলের ধরন</Label>
                                        {isEditing ? (
                                            <Input
                                                id="crops"
                                                value={profileData.crops}
                                                onChange={(e) => handleInputChange('crops', e.target.value)}
                                                placeholder="যেমন: ধান, গম, সবজি"
                                                className="mt-1"
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-800">{profileData.crops || 'উল্লেখ করা হয়নি'}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                                    <Timer className="h-5 w-5 text-purple-600 mr-3" />
                                    <div className="flex-1">
                                        <Label htmlFor="experience" className="text-xs text-purple-600 font-medium">কৃষি অভিজ্ঞতা</Label>
                                        {isEditing ? (
                                            <div className="flex gap-2 items-center mt-1">
                                                <Input
                                                    id="experience"
                                                    type="number"
                                                    value={profileData.experience}
                                                    onChange={(e) => handleInputChange('experience', e.target.value)}
                                                    placeholder="বছর"
                                                    className="flex-1"
                                                />
                                                <span className="text-sm text-muted-foreground">বছর</span>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-800">
                                                {profileData.experience ? `${profileData.experience} বছর` : 'উল্লেখ করা হয়নি'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Land Ownership */}
                                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                                    <Home className="h-5 w-5 text-orange-600 mr-3" />
                                    <div className="flex-1">
                                        <Label htmlFor="landOwnership" className="text-xs text-orange-600 font-medium">জমির মালিকানা</Label>
                                        {isEditing ? (
                                            <select
                                                value={profileData.landOwnership}
                                                onChange={(e) => handleInputChange('landOwnership', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md bg-background mt-1"
                                            >
                                                <option value="">নির্বাচন করুন</option>
                                                <option value="নিজস্ব">নিজস্ব</option>
                                                <option value="লীজ">লীজ</option>
                                                <option value="বর্গা">বর্গা</option>
                                                <option value="মিশ্র">মিশ্র (নিজস্ব + বর্গা)</option>
                                            </select>
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-800">{profileData.landOwnership || 'উল্লেখ করা হয়নি'}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Krishi Card */}
                                <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                                    <IdCard className="h-5 w-5 text-teal-600 mr-3" />
                                    <div className="flex-1">
                                        <Label htmlFor="krishiCardNumber" className="text-xs text-teal-600 font-medium">কৃষি কার্ড নম্বর</Label>
                                        {isEditing ? (
                                            <Input
                                                id="krishiCardNumber"
                                                value={profileData.krishiCardNumber}
                                                onChange={(e) => handleInputChange('krishiCardNumber', e.target.value)}
                                                placeholder="কৃষি কার্ড নম্বর (যদি থাকে)"
                                                className="mt-1"
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-800">{profileData.krishiCardNumber || 'উল্লেখ করা হয়নি'}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bio */}
                        <Card className="border-l-4 border-l-indigo-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-indigo-700">
                                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                        <FileText className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    আমার সম্পর্কে
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-3 bg-indigo-50 rounded-lg">
                                    {isEditing ? (
                                        <Textarea
                                            id="bio"
                                            value={profileData.bio}
                                            onChange={(e) => handleInputChange('bio', e.target.value)}
                                            rows={4}
                                            placeholder="আপনার সম্পর্কে কিছু লিখুন..."
                                            className="bg-white"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {profileData.bio || 'আপনার সম্পর্কে কিছু লেখা হয়নি। সম্পাদনা করে যোগ করুন।'}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
