import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Star, Calendar, MapPin, Phone, Mail, GraduationCap, Award, Users, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface ConsultantProfileProps {
    onBack?: () => void;
}

const ConsultantProfile = ({ onBack }: ConsultantProfileProps) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Profile data - fetch from API
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        nidNumber: "",
        qualification: "",
        specialization: "",
        experience: "",
        institution: "",
        district: "",
        division: "",
        bio: "",
        languages: ["বাংলা"],
        availability: "",
        consultationFee: "",
        profilePhoto: "",
        address: "",
        dateOfBirth: "",
        fatherName: "",
        motherName: ""
    });

    // Fetch profile data on mount
    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/expert/profile');
            
            if (response.data.success) {
                const data = response.data.data;
                const userProfile = data.user?.profile;
                const expertProfile = data.user?.expert;

                setProfileData({
                    name: userProfile?.full_name || "",
                    email: data.user?.email || "",
                    phone: data.user?.phone || "",
                    nidNumber: userProfile?.nid_number || "",
                    qualification: expertProfile?.qualification || "",
                    specialization: expertProfile?.specialization || "",
                    experience: expertProfile?.experience_years?.toString() || "",
                    institution: expertProfile?.institution || "",
                    district: "",
                    division: "",
                    bio: expertProfile?.bio || "",
                    languages: ["বাংলা"],
                    availability: "",
                    consultationFee: expertProfile?.consultation_fee?.toString() || "",
                    profilePhoto: userProfile?.profile_photo || "",
                    address: userProfile?.address || "",
                    dateOfBirth: userProfile?.date_of_birth || "",
                    fatherName: userProfile?.father_name || "",
                    motherName: userProfile?.mother_name || ""
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast({
                title: "ত্রুটি",
                description: "প্রোফাইল লোড করতে সমস্যা হয়েছে",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        // In real app, save to API
        toast({
            title: "প্রোফাইল আপডেট",
            description: "আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে।",
        });
        setIsEditing(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // In real app, upload to server
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileData({
                    ...profileData,
                    profilePhoto: e.target?.result as string
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="p-4 flex items-center gap-3">
                    {onBack && (
                        <Button variant="ghost" size="sm" onClick={onBack}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <div>
                        <h1 className="text-xl font-bold">প্রোফাইল</h1>
                        <p className="text-sm text-muted-foreground">আপনার বিশেষজ্ঞ প্রোফাইল পরিচালনা করুন</p>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="p-4 space-y-6">
                {/* Profile Header */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={profileData.profilePhoto} alt={profileData.name} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                        {profileData.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer">
                                        <Camera className="h-4 w-4" />
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="text-center">
                                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                                <p className="text-muted-foreground">{profileData.specialization}</p>
                                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                                    <MapPin className="h-4 w-4" />
                                    {profileData.institution}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Award className="h-3 w-3" />
                                    যাচাইকৃত বিশেষজ্ঞ
                                </Badge>
                                <Badge variant="outline">
                                    {profileData.experience} বছর অভিজ্ঞতা
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Information */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>ব্যক্তিগত তথ্য</CardTitle>
                        <Button
                            variant={isEditing ? "outline" : "default"}
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? "বাতিল" : "সম্পাদনা"}
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>পূর্ণ নাম</Label>
                                {isEditing ? (
                                    <Input
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-sm p-2 bg-muted rounded">{profileData.name}</p>
                                )}
                            </div>

                            <div>
                                <Label>জাতীয় পরিচয়পত্র</Label>
                                {isEditing ? (
                                    <Input
                                        value={profileData.nidNumber}
                                        onChange={(e) => setProfileData({ ...profileData, nidNumber: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-sm p-2 bg-muted rounded">{profileData.nidNumber}</p>
                                )}
                            </div>

                            <div>
                                <Label className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    ইমেইল
                                </Label>
                                {isEditing ? (
                                    <Input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-sm p-2 bg-muted rounded">{profileData.email}</p>
                                )}
                            </div>

                            <div>
                                <Label className="flex items-center gap-1">
                                    <Phone className="h-4 w-4" />
                                    মোবাইল নম্বর
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-sm p-2 bg-muted rounded">{profileData.phone}</p>
                                )}
                            </div>

                            <div>
                                <Label>বিভাগ</Label>
                                {isEditing ? (
                                    <Select value={profileData.division} onValueChange={(value) => setProfileData({ ...profileData, division: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ঢাকা">ঢাকা</SelectItem>
                                            <SelectItem value="চট্টগ্রাম">চট্টগ্রাম</SelectItem>
                                            <SelectItem value="রাজশাহী">রাজশাহী</SelectItem>
                                            <SelectItem value="খুলনা">খুলনা</SelectItem>
                                            <SelectItem value="সিলেট">সিলেট</SelectItem>
                                            <SelectItem value="বরিশাল">বরিশাল</SelectItem>
                                            <SelectItem value="রংপুর">রংপুর</SelectItem>
                                            <SelectItem value="ময়মনসিংহ">ময়মনসিংহ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="text-sm p-2 bg-muted rounded">{profileData.division}</p>
                                )}
                            </div>

                            <div>
                                <Label>জেলা</Label>
                                {isEditing ? (
                                    <Input
                                        value={profileData.district}
                                        onChange={(e) => setProfileData({ ...profileData, district: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-sm p-2 bg-muted rounded">{profileData.district}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label>প্রতিষ্ঠান</Label>
                            {isEditing ? (
                                <Input
                                    value={profileData.institution}
                                    onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
                                />
                            ) : (
                                <p className="text-sm p-2 bg-muted rounded">{profileData.institution}</p>
                            )}
                        </div>

                        <div>
                            <Label>শিক্ষাগত যোগ্যতা</Label>
                            {isEditing ? (
                                <Input
                                    value={profileData.qualification}
                                    onChange={(e) => setProfileData({ ...profileData, qualification: e.target.value })}
                                />
                            ) : (
                                <p className="text-sm p-2 bg-muted rounded flex items-center gap-1">
                                    <GraduationCap className="h-4 w-4" />
                                    {profileData.qualification}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>বিশেষত্ব</Label>
                            {isEditing ? (
                                <Input
                                    value={profileData.specialization}
                                    onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                                />
                            ) : (
                                <p className="text-sm p-2 bg-muted rounded">{profileData.specialization}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>অভিজ্ঞতা (বছর)</Label>
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        value={profileData.experience}
                                        onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-sm p-2 bg-muted rounded">{profileData.experience} বছর</p>
                                )}
                            </div>

                            <div>
                                <Label>পরামর্শ ফি (টাকা)</Label>
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        value={profileData.consultationFee}
                                        onChange={(e) => setProfileData({ ...profileData, consultationFee: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-sm p-2 bg-muted rounded">৳{profileData.consultationFee}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label>কাজের সময়</Label>
                            {isEditing ? (
                                <Input
                                    value={profileData.availability}
                                    onChange={(e) => setProfileData({ ...profileData, availability: e.target.value })}
                                />
                            ) : (
                                <p className="text-sm p-2 bg-muted rounded flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {profileData.availability}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>সংক্ষিপ্ত পরিচয়</Label>
                            {isEditing ? (
                                <Textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    rows={4}
                                />
                            ) : (
                                <p className="text-sm p-2 bg-muted rounded">{profileData.bio}</p>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex gap-2">
                                <Button onClick={handleSave} className="flex-1">
                                    সংরক্ষণ করুন
                                </Button>
                                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                                    বাতিল
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
                </div>
            )}
        </div>
    );
};

export default ConsultantProfile;
