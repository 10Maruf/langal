import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X, Plus, Upload, MapPin, Tag, DollarSign } from "lucide-react";
import { LISTING_CATEGORIES, LISTING_TYPES } from "@/types/marketplace";
import { useAuth } from "@/contexts/AuthContext";
import LocationSelector from "@/components/farmer/LocationSelector";

interface CreateListingProps {
    onListing: (listingData: any) => void;
    onCancel: () => void;
}

export const CreateListing = ({ onListing, onCancel }: CreateListingProps) => {
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [phone, setPhone] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null);

    // Location states
    const [locationMode, setLocationMode] = useState<'profile' | 'custom'>('profile');
    const [profileLocation, setProfileLocation] = useState("");
    const [profilePostalCode, setProfilePostalCode] = useState<number | null>(null);
    const [profileVillage, setProfileVillage] = useState<string>("");
    const [customLocationData, setCustomLocationData] = useState<any>(null);
    const [customAddress, setCustomAddress] = useState("");

    // Load user profile data on mount
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const API_BASE = import.meta.env?.VITE_API_BASE?.replace(/\/$/, '') || 'http://localhost:8000/api';
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`${API_BASE}/farmer/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Profile API Response:', result);

                    if (result.success && result.data) {
                        // Profile data is in result.data.user
                        const userData = result.data.user || result.data;
                        const profileData = userData.profile || userData;

                        console.log('User Data:', userData);
                        console.log('Profile Data:', profileData);
                        console.log('Available fields:', Object.keys(profileData));

                        setUserProfile(profileData);

                        // Auto-fill phone from database (from user object)
                        if (userData.phone) {
                            setPhone(userData.phone);
                        }

                        // Save postal_code and village from profile for later use
                        if (profileData.postal_code) {
                            setProfilePostalCode(profileData.postal_code);
                        }
                        if (profileData.village) {
                            setProfileVillage(profileData.village);
                        }

                        // Build profile location string from profile data
                        // Since old structure uses 'address' field instead of separate location fields
                        let locationString = '';

                        if (profileData.address) {
                            locationString = profileData.address;
                        } else if (profileData.postal_code) {
                            locationString = `পোস্টাল কোড: ${profileData.postal_code}`;
                        }

                        if (locationString) {
                            setProfileLocation(locationString);
                            console.log('Profile Location Set:', locationString);
                        } else {
                            console.log('No address or postal_code found in profile');
                        }
                    }
                } else {
                    console.error('Profile API Error:', response.status, await response.text());
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
                // Fallback to user data from context
                if (user?.phone) setPhone(user.phone);
                if (user?.location) setProfileLocation(user.location);
            }
        };
        loadUserProfile();
    }, [user]);

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files);
            setImages([...images, ...newImages]);
        }
    };

    const handleSubmit = async () => {
        // Upload images first if any
        let uploadedImagePaths: string[] = [];

        if (images.length > 0) {
            try {
                const formData = new FormData();
                images.forEach(image => {
                    formData.append('images[]', image);
                });

                const API_BASE = import.meta.env?.VITE_API_BASE?.replace(/\/$/, '') || 'http://localhost:8000/api';
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`${API_BASE}/images/marketplace`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        uploadedImagePaths = result.data.map((img: { path: string }) => img.path);
                    }
                } else {
                    console.error('Image upload failed:', await response.text());
                }
            } catch (error) {
                console.error('Error uploading images:', error);
            }
        }

        // Determine final location based on mode
        const finalLocation = locationMode === 'profile'
            ? profileLocation
            : customAddress;

        // Get postal_code and village based on location mode
        let postalCode: number | null = null;
        let village: string | null = null;

        if (locationMode === 'profile') {
            // Use profile data
            postalCode = profilePostalCode;
            village = profileVillage || null;
        } else if (locationMode === 'custom' && customLocationData) {
            // Use custom location data
            postalCode = customLocationData.postal_code || null;
            village = customLocationData.village || null;
        }

        const listingData = {
            title,
            description,
            price: parseFloat(price),
            currency: "BDT",
            category,
            listing_type: type,
            location: finalLocation || user?.location || 'বাংলাদেশ',
            postal_code: postalCode,
            village: village,
            contact_phone: phone,
            contactInfo: {
                phone: phone
            },
            tags,
            images: uploadedImagePaths
        };

        onListing(listingData);
    }; const getTypeButtonText = () => {
        switch (user?.type) {
            case "farmer":
                return "বিজ্ঞাপন দিন";
            case "customer":
                return "বিজ্ঞাপন দিন";
            default:
                return "তালিকাভুক্ত করুন";
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">নতুন বিজ্ঞাপন তৈরি করুন</CardTitle>
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Author Info */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={userProfile?.profile_photo_url_full || user?.profilePhoto || "/placeholder.svg"} />
                        <AvatarFallback>{userProfile?.full_name?.[0] || user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-medium">{userProfile?.full_name || user?.name || "ব্যবহারকারী"}</p>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground line-clamp-1">
                                {profileLocation || userProfile?.district || user?.location || "বাংলাদেশ"}
                            </span>
                            {user?.type === "farmer" && (
                                <Badge variant="secondary" className="text-xs">কৃষক</Badge>
                            )}
                            {user?.type === "expert" && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">বিশেষজ্ঞ</Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Listing Type & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">ধরন</label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="ধরন নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                {LISTING_TYPES.map((listingType) => (
                                    <SelectItem key={listingType.id} value={listingType.id}>
                                        {listingType.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">ক্যাটেগরি</label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="ক্যাটেগরি নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                {LISTING_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-2">শিরোনাম</label>
                    <Input
                        placeholder="আপনার পণ্য বা সেবার শিরোনাম লিখুন..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-2">বিবরণ</label>
                    <Textarea
                        placeholder="বিস্তারিত বিবরণ লিখুন..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        দাম (টাকা)
                    </label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                {/* Contact Phone */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        যোগাযোগ নম্বর
                        <span className="text-xs text-muted-foreground ml-2">(ডাটাবেজ থেকে এসেছে, প্রয়োজনে পরিবর্তন করুন)</span>
                    </label>
                    <Input
                        placeholder="01712-345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                {/* Location Selection */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        স্থান নির্বাচন করুন
                    </label>

                    <RadioGroup value={locationMode} onValueChange={(value: 'profile' | 'custom') => setLocationMode(value)}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="profile" id="profile-location" />
                            <Label htmlFor="profile-location" className="font-normal cursor-pointer">
                                প্রোফাইলের ঠিকানা ব্যবহার করুন
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="custom-location" />
                            <Label htmlFor="custom-location" className="font-normal cursor-pointer">
                                নতুন ঠিকানা নির্বাচন করুন
                            </Label>
                        </div>
                    </RadioGroup>

                    {locationMode === 'profile' ? (
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">আপনার প্রোফাইল থেকে:</p>
                            <p className="text-sm font-medium">
                                {profileLocation || "ঠিকানা পাওয়া যায়নি"}
                            </p>
                        </div>
                    ) : (
                        <div className="border rounded-lg p-4 space-y-4">
                            <LocationSelector
                                value={customLocationData}
                                onChange={(locationData) => setCustomLocationData(locationData)}
                                onAddressChange={(address) => setCustomAddress(address)}
                            />
                            {customAddress && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-xs text-green-700 mb-1">সম্পূর্ণ ঠিকানা:</p>
                                    <p className="text-sm font-medium text-green-900">{customAddress}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        <Tag className="h-4 w-4 inline mr-1" />
                        ট্যাগসমূহ
                    </label>
                    <div className="flex gap-2 mb-2">
                        <Input
                            placeholder="ট্যাগ যোগ করুন..."
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                        />
                        <Button type="button" variant="outline" onClick={handleAddTag}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="cursor-pointer">
                                #{tag}
                                <X
                                    className="h-3 w-3 ml-1"
                                    onClick={() => handleRemoveTag(tag)}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        <Upload className="h-4 w-4 inline mr-1" />
                        ছবি আপলোড করুন
                    </label>
                    <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mb-2"
                    />
                    {images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                            {images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Upload ${index + 1}`}
                                        className="w-full h-20 object-cover rounded border"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                    <Button
                        onClick={handleSubmit}
                        disabled={
                            !title ||
                            !description ||
                            !category ||
                            !type ||
                            !price ||
                            !phone ||
                            (locationMode === 'profile' ? !profileLocation : !customAddress)
                        }
                        className="flex-1"
                    >
                        {getTypeButtonText()}
                    </Button>
                    <Button variant="outline" onClick={onCancel}>
                        বাতিল
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};