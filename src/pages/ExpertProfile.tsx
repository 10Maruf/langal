import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
    MapPin,
    Phone,
    Mail,
    GraduationCap,
    Briefcase,
    Edit,
    Save,
    X,
    Building,
    FileText,
    Clock,
    ArrowLeft,
    Loader2
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

// Helper to get full image URL
const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return '';
    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    // Otherwise, prepend base URL
    const baseUrl = API_BASE.replace(/\/?api\/?$/, '');
    return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

const ExpertProfile = () => {
    const { setAuthUser } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        qualification: "",
        experience: "",
        specialization: [] as string[],
        workplace: "",
        designation: "",
        bio: "",
        profilePhoto: "",
        certificationDocument: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`${API_BASE}/expert/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                
                if (response.ok && data.success) {
                    const userData = data.data.user;
                    const expertData = userData.expert;
                    const userProfile = userData.profile;

                    let photoUrl = userProfile?.profile_photo_url_full || "";
                    
                    // Fallback to localStorage if API returns empty
                    if (!photoUrl) {
                        try {
                            const storedUser = localStorage.getItem('user');
                            if (storedUser) {
                                const parsedUser = JSON.parse(storedUser);
                                if (parsedUser.profilePhoto) {
                                    photoUrl = parsedUser.profilePhoto;
                                }
                            }
                        } catch (e) {
                            console.error('Error parsing stored user:', e);
                        }
                    }

                    const certUrl = expertData?.certification_document_url_full || "";
                    
                    setProfileData(prev => ({
                        ...prev,
                        name: userProfile?.full_name || userData.name,
                        email: userData.email || "N/A",
                        phone: userData.phone,
                        address: userProfile?.address || "N/A",
                        qualification: expertData?.qualification || "N/A",
                        experience: expertData?.experience_years ? `${expertData.experience_years} বছর` : "N/A",
                        specialization: expertData?.specialization ? expertData.specialization.split(',') : [],
                        workplace: expertData?.institution || "N/A",
                        designation: "বিশেষজ্ঞ", 
                        bio: expertData?.bio || "কোন তথ্য নেই",
                        profilePhoto: photoUrl,
                        certificationDocument: certUrl,
                    }));
                } else {
                    toast({
                        title: "ত্রুটি",
                        description: "প্রোফাইল তথ্য লোড করা যায়নি",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast({
                    title: "ত্রুটি",
                    description: "সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [navigate, toast]);

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setProfileData(prev => ({
                ...prev,
                profilePhoto: previewUrl
            }));
            // Reset error state for new image
            setImageError(false);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const formData = new FormData();
            
            // Append fields
            formData.append('name', profileData.name);
            formData.append('email', profileData.email);
            formData.append('phone', profileData.phone);
            formData.append('address', profileData.address);
            formData.append('qualification', profileData.qualification);
            formData.append('specialization', profileData.specialization.join(','));
            formData.append('experience_years', profileData.experience.replace(/[^0-9]/g, ''));
            formData.append('institution', profileData.workplace);
            formData.append('bio', profileData.bio);
            
            // Append file if selected
            if (selectedFile) {
                formData.append('profilePhoto', selectedFile);
            }
            
            // Use _method PUT for Laravel if using POST (Laravel sometimes has issues with PUT and FormData)
            formData.append('_method', 'PUT');

            const response = await fetch(`${API_BASE}/expert/profile`, {
                method: 'POST', // Use POST with _method=PUT for file upload support
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                toast({
                    title: "সফল",
                    description: "প্রোফাইল আপডেট করা হয়েছে",
                });
                setIsEditing(false);
                
                // Update localStorage user data if photo changed or other fields
                if (data.data?.user) {
                     const updatedUser = data.data.user;
                     const storedUser = localStorage.getItem('user');
                     if (storedUser) {
                         const parsedUser = JSON.parse(storedUser);
                         
                         // Update fields
                         if (updatedUser.profile?.profile_photo_url_full) {
                             parsedUser.profilePhoto = updatedUser.profile.profile_photo_url_full;
                         }
                         parsedUser.name = updatedUser.profile?.full_name || updatedUser.name;
                         parsedUser.email = updatedUser.email;
                         parsedUser.phone = updatedUser.phone;
                         parsedUser.location = updatedUser.profile?.address;
                         
                         // Update context and localStorage
                         setAuthUser(parsedUser, token || "");
                     }
                }
            } else {
                throw new Error(data.message || "Failed to update");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "ত্রুটি",
                description: "প্রোফাইল আপডেট করা যায়নি",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedFile(null);
        // Ideally reset to original data, but for now just close edit mode
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-6 pb-20">
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            ফিরে যান
                        </Button>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">আমার প্রোফাইল</h1>
                    <p className="text-muted-foreground">বিশেষজ্ঞ প্রোফাইল ও তথ্য ব্যবস্থাপনা</p>
                </div>

                <div className="grid gap-6">
                    {/* Basic Profile Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {/* Direct image instead of Avatar component */}
                                <div className="h-20 w-20 rounded-full overflow-hidden bg-green-700 flex items-center justify-center relative group">
                                    {profileData.profilePhoto && !imageError ? (
                                        <img 
                                            src={getImageUrl(profileData.profilePhoto)}
                                            alt={profileData.name}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                console.error('✗ Profile photo failed:', getImageUrl(profileData.profilePhoto));
                                                setImageError(true);
                                            }}
                                        />
                                    ) : null}
                                    {(!profileData.profilePhoto || profileData.profilePhoto === '' || imageError) && (
                                        <span className="text-2xl text-white font-bold">
                                            {profileData.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    )}
                                    
                                    {/* Image Upload Overlay */}
                                    {isEditing && (
                                        <label 
                                            htmlFor="profile-photo-upload" 
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Edit className="h-6 w-6 text-white" />
                                            <input 
                                                type="file" 
                                                id="profile-photo-upload" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    )}
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{profileData.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4" />
                                        {profileData.designation}
                                    </CardDescription>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <Building className="h-4 w-4" />
                                        {profileData.workplace}
                                    </CardDescription>
                                </div>
                            </div>
                            <Button
                                variant={isEditing ? "destructive" : "outline"}
                                onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                            >
                                {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                                {isEditing ? "বাতিল" : "সম্পাদনা"}
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">ইমেইল</Label>
                                    {isEditing ? (
                                        <Input
                                            id="email"
                                            value={profileData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                        />
                                    ) : (
                                        <p className="flex items-center gap-2 text-sm">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            {profileData.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">ফোন</Label>
                                    {isEditing ? (
                                        <Input
                                            id="phone"
                                            value={profileData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                        />
                                    ) : (
                                        <p className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            {profileData.phone}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="qualification">শিক্ষাগত যোগ্যতা</Label>
                                    {isEditing ? (
                                        <Input
                                            id="qualification"
                                            value={profileData.qualification}
                                            onChange={(e) => handleInputChange("qualification", e.target.value)}
                                        />
                                    ) : (
                                        <p className="flex items-center gap-2 text-sm">
                                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                            {profileData.qualification}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="experience">অভিজ্ঞতা</Label>
                                    {isEditing ? (
                                        <Input
                                            id="experience"
                                            value={profileData.experience}
                                            onChange={(e) => handleInputChange("experience", e.target.value)}
                                        />
                                    ) : (
                                        <p className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            {profileData.experience}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">ঠিকানা</Label>
                                {isEditing ? (
                                    <Input
                                        id="address"
                                        value={profileData.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                    />
                                ) : (
                                    <p className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        {profileData.address}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>বিশেষত্ব</Label>
                                <div className="flex flex-wrap gap-2">
                                    {profileData.specialization.map((spec, index) => (
                                        <Badge key={index} variant="secondary">
                                            {spec}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">পরিচিতি</Label>
                                {isEditing ? (
                                    <Textarea
                                        id="bio"
                                        value={profileData.bio}
                                        onChange={(e) => handleInputChange("bio", e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                ) : (
                                    <p className="text-sm text-muted-foreground">{profileData.bio}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>সার্টিফিকেট</Label>
                                {profileData.certificationDocument ? (
                                    <div className="border rounded-lg p-4 bg-muted/20">
                                        {profileData.certificationDocument.endsWith('.pdf') ? (
                                            <a 
                                                href={getImageUrl(profileData.certificationDocument)} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:underline"
                                            >
                                                <FileText className="h-5 w-5" />
                                                সার্টিফিকেট দেখুন (PDF)
                                            </a>
                                        ) : (
                                            <img 
                                                src={getImageUrl(profileData.certificationDocument)} 
                                                alt="Certification" 
                                                className="max-h-60 rounded-md object-contain w-full"
                                                onError={(e) => {
                                                    console.error('Certificate image failed to load:', getImageUrl(profileData.certificationDocument));
                                                }}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">সার্টিফিকেট আপলোড করা হয়নি</p>
                                )}
                            </div>

                            {isEditing && (
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={handleCancel}>
                                        বাতিল
                                    </Button>
                                    <Button onClick={handleSave}>
                                        <Save className="h-4 w-4 mr-2" />
                                        সংরক্ষণ
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default ExpertProfile;
