import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { TTSButton } from "@/components/ui/tts-button";
import {
    Star,
    Search,
    Loader2,
    Users,
    CheckCircle,
    Briefcase,
    GraduationCap,
    Stethoscope,
    ArrowLeft,
} from "lucide-react";
import { getAllExperts, Expert } from "@/services/consultationService";
import { getProfilePhotoUrl } from "@/lib/utils";

// Helper to get profile from user (handles both `profile` and `userProfile` keys)
const getUserProfile = (user: Expert["user"]) => {
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return user.profile || (user as any).userProfile || (user as any).user_profile || null;
};

const ExpertListPage = () => {
    const navigate = useNavigate();
    const [experts, setExperts] = useState<Expert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = async () => {
        try {
            setLoading(true);
            const response = await getAllExperts();
            if (response.success) {
                // Handle response format: { success, data: { experts: [], pagination: {} } }
                const expertsData = response.data?.experts || response.data || [];
                setExperts(Array.isArray(expertsData) ? expertsData : []);
            } else {
                setError("বিশেষজ্ঞদের তালিকা লোড করতে ব্যর্থ হয়েছে");
            }
        } catch (err) {
            console.error("Error fetching experts:", err);
            setError("সার্ভারে সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    const filteredExperts = experts.filter((expert) => {
        const profile = getUserProfile(expert.user);
        const name = profile?.full_name || "";
        const nameBn = profile?.full_name_bn || "";
        const specialization = expert.specialization_bn || expert.specialization || "";

        return (
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            nameBn.includes(searchQuery) ||
            specialization.includes(searchQuery)
        );
    });

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-3 w-3 ${star <= rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-300"
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header />

            {/* Page Title with Back Button */}
            <div className="bg-white border-b pt-16">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="rounded-full"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">বিশেষজ্ঞ পরামর্শ</h1>
                            <p className="text-sm text-gray-500">অভিজ্ঞ বিশেষজ্ঞদের কাছ থেকে সঠিক সমাধান পান</p>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/consultation/appointments')}
                            className="gap-2"
                        >
                            <CheckCircle className="h-4 w-4" />
                            আমার অ্যাপয়েন্টমেন্ট
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white border-b sticky top-16 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="নাম বা বিশেষত্ব দিয়ে খুঁজুন..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 rounded-lg border-gray-200"
                        />
                    </div>
                </div>
            </div>

            {/* Expert Grid */}
            <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
                        <p className="text-gray-500">বিশেষজ্ঞদের তালিকা লোড হচ্ছে...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button onClick={fetchExperts} variant="outline">
                            আবার চেষ্টা করুন
                        </Button>
                    </div>
                ) : filteredExperts.length === 0 ? (
                    <div className="text-center py-16">
                        <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">কোন বিশেষজ্ঞ পাওয়া যায়নি</p>
                        <p className="text-gray-400 text-sm mt-1">অন্য কিছু দিয়ে খোঁজার চেষ্টা করুন</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredExperts.map((expert) => {
                            const profile = getUserProfile(expert.user);
                            return (
                                <Card
                                    key={expert.expert_id || expert.id}
                                    className="overflow-hidden bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-green-200"
                                    onClick={() => navigate(`/consultation/expert/${expert.expert_id || expert.id}`)}
                                >
                                    <CardContent className="p-4">
                                        {/* Avatar & Verified Badge */}
                                        <div className="flex flex-col items-center text-center">
                                            <div className="relative mb-3">
                                                <Avatar className="h-20 w-20 border-3 border-green-100 shadow-md">
                                                    <AvatarImage
                                                        src={getProfilePhotoUrl(profile?.avatar_url || profile?.profile_photo_url)}
                                                        alt={profile?.full_name}
                                                    />
                                                    <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-200 text-green-700 text-2xl font-semibold">
                                                        {profile?.full_name?.charAt(0) || "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {/* Online Status Indicator */}
                                                <div className={`absolute top-0 right-0 h-4 w-4 rounded-full border-2 border-white ${expert.is_online ? 'bg-green-500' : 'bg-gray-400'
                                                    }`} title={expert.is_online ? 'অনলাইন' : 'অফলাইন'} />
                                                {expert.is_government_approved && (
                                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                                        <CheckCircle className="h-4 w-4 text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Name */}
                                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                                                {profile?.full_name_bn || profile?.full_name || "নাম নেই"}
                                            </h3>

                                            {/* Online Status Label */}
                                            {expert.is_online && (
                                                <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-0.5">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                                    অনলাইন
                                                </span>
                                            )}

                                            {/* Specialization */}
                                            <div className="flex items-center gap-1 mt-1">
                                                <Stethoscope className="h-3 w-3 text-green-600" />
                                                <p className="text-xs text-green-600 font-medium line-clamp-1">
                                                    {expert.specialization_bn || expert.specialization || "সাধারণ"}
                                                </p>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1 mt-2">
                                                {renderStars(expert.rating || 0)}
                                                <span className="text-xs text-gray-500 ml-1">
                                                    ({(expert.rating || 0).toFixed(1)})
                                                </span>
                                            </div>

                                            {/* Experience & Consultations */}
                                            <div className="flex items-center justify-center gap-3 mt-3 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Briefcase className="h-3 w-3" />
                                                    <span>{expert.experience_years || 0} বছর</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    <span>{expert.total_consultations || 0}+</span>
                                                </div>
                                            </div>

                                            {/* View Profile Button */}
                                            <Button
                                                size="sm"
                                                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white text-xs h-9"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/consultation/expert/${expert.expert_id || expert.id}`);
                                                }}
                                            >
                                                <GraduationCap className="h-3.5 w-3.5 mr-1" />
                                                বিস্তারিত দেখুন
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Floating TTS */}
            <div className="fixed bottom-24 right-4 z-20">
                <TTSButton
                    text="এখানে আপনি কৃষি বিশেষজ্ঞদের তালিকা দেখতে পাচ্ছেন। যেকোনো বিশেষজ্ঞের উপর ক্লিক করে তার প্রোফাইল দেখতে পারেন এবং পরামর্শের জন্য সময় বুক করতে পারেন।"
                    className="bg-green-600 hover:bg-green-700 h-14 w-14 rounded-full shadow-lg"
                />
            </div>
        </div>
    );
};

export default ExpertListPage;
