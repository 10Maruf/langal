import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { UserType, useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Users, User, UserCheck, Upload, Camera, FileText, MapPin, Phone, Mail, IdCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAssetPath } from "@/lib/utils";
import FarmerRegistration from "@/components/farmer/FarmerRegistration";
import ExpertRegistration from "@/components/expert/ExpertRegistration";
import CustomerRegistration from "@/components/customer/CustomerRegistration";

interface RegisterData {
    // Common fields
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    nidNumber: string;
    nidPhoto: File | null;
    profilePhoto: File | null;
    address: string;

    // Farmer specific
    farmSize?: string;
    farmType?: string;
    experience?: string;

    // Expert specific
    qualification?: string;
    specialization?: string;
    experience_years?: string;
    certification?: File | null;
    institution?: string;
    division?: string;
    district?: string;
    consultationFee?: string;
    availability?: string;
    bio?: string;

    // Customer specific
    businessName?: string;
    businessType?: string;
    tradeLicense?: string;
}

const Register = () => {
    const [activeTab, setActiveTab] = useState<UserType>("farmer");
    const [isLoading, setIsLoading] = useState(false);
    const [showFarmerRegistration, setShowFarmerRegistration] = useState(false);
    const [showExpertRegistration, setShowExpertRegistration] = useState(false);
    const [showCustomerRegistration, setShowCustomerRegistration] = useState(false);
    const [registerData, setRegisterData] = useState<RegisterData>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        nidNumber: "",
        nidPhoto: null,
        profilePhoto: null,
        address: "",
    });

    const navigate = useNavigate();
    const { toast } = useToast();
    const { register: registerUser } = useAuth();
    const nidPhotoRef = useRef<HTMLInputElement>(null);
    const profilePhotoRef = useRef<HTMLInputElement>(null);
    const certificationRef = useRef<HTMLInputElement>(null);

    // Preload background images to prevent flickering
    useEffect(() => {
        const imagesToPreload = [
            getAssetPath('/img/farmer_dashbord_bg.png'),
            getAssetPath('/img/customer_dashboard_bg.png'),
            getAssetPath('/img/expert_dashboard_bg.png')
        ];

        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    const handleInputChange = (field: keyof RegisterData, value: string) => {
        setRegisterData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (field: keyof RegisterData, file: File | null) => {
        setRegisterData(prev => ({ ...prev, [field]: file }));
    };

    const validateForm = (): boolean => {
        // Common validation
        if (!registerData.fullName || !registerData.email || !registerData.password ||
            !registerData.confirmPassword || !registerData.phone || !registerData.nidNumber ||
            !registerData.nidPhoto || !registerData.profilePhoto || !registerData.address) {
            toast({
                title: "ত্রুটি",
                description: "অনুগ্রহ করে সব আবশ্যক ক্ষেত্র পূরণ করুন",
                variant: "destructive",
            });
            return false;
        }

        if (registerData.password !== registerData.confirmPassword) {
            toast({
                title: "ত্রুটি",
                description: "পাসওয়ার্ড মিলছে না",
                variant: "destructive",
            });
            return false;
        }

        if (registerData.password.length < 6) {
            toast({
                title: "ত্রুটি",
                description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
                variant: "destructive",
            });
            return false;
        }

        if (registerData.nidNumber.length < 10) {
            toast({
                title: "ত্রুটি",
                description: "সঠিক জাতীয় পরিচয়পত্র নম্বর দিন",
                variant: "destructive",
            });
            return false;
        }

        // Type-specific validation
        if (activeTab === 'farmer') {
            if (!registerData.farmSize || !registerData.farmType || !registerData.experience) {
                toast({
                    title: "ত্রুটি",
                    description: "কৃষকের সব তথ্য পূরণ করুন",
                    variant: "destructive",
                });
                return false;
            }
        }

        if (activeTab === 'expert') {
            if (!registerData.qualification || !registerData.specialization || !registerData.experience_years ||
                !registerData.certification || !registerData.institution || !registerData.division || !registerData.district) {
                toast({
                    title: "ত্রুটি",
                    description: "বিশেষজ্ঞের সব প্রয়োজনীয় তথ্য ও সার্টিফিকেট পূরণ করুন",
                    variant: "destructive",
                });
                return false;
            }
        }

        return true;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Call the register function from AuthContext
            const success = await registerUser(registerData, activeTab);

            if (success) {
                toast({
                    title: "সফল!",
                    description: "সফলভাবে নিবন্ধন সম্পন্ন হয়েছে। অনুমোদনের জন্য অপেক্ষা করুন।",
                });

                // Navigate to login page
                navigate('/login');
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "নিবন্ধনে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getUserTypeIcon = (type: UserType) => {
        switch (type) {
            case 'farmer':
                return <User className="h-5 w-5" />;
            case 'expert':
                return <UserCheck className="h-5 w-5" />;
            case 'customer':
                return <Users className="h-5 w-5" />;
            default:
                return <User className="h-5 w-5" />;
        }
    };

    const getUserTypeLabel = (type: UserType) => {
        switch (type) {
            case 'farmer':
                return 'কৃষক';
            case 'expert':
                return 'কৃষি বিশেষজ্ঞ';
            case 'customer':
                return 'ক্রেতা';
            default:
                return '';
        }
    };

    // Get background image based on active tab
    const getBackgroundStyle = () => {
        switch (activeTab) {
            case 'farmer':
                return {
                    backgroundImage: `url(${getAssetPath('/img/farmer_dashbord_bg.png')})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                };
            case 'customer':
                return {
                    backgroundImage: `url(${getAssetPath('/img/customer_dashboard_bg.png')})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                };
            case 'expert':
                return {
                    backgroundImage: `url(${getAssetPath('/img/expert_dashboard_bg.png')})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                };
            default:
                return {};
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 transition-all duration-500"
            style={getBackgroundStyle()}
        >
            {/* Show Farmer Registration Component if farmer is selected and farmer registration is enabled */}
            {activeTab === 'farmer' && showFarmerRegistration ? (
                <FarmerRegistration onBack={() => setShowFarmerRegistration(false)} />
            ) : activeTab === 'expert' && showExpertRegistration ? (
                <ExpertRegistration onBackToMainRegister={() => setShowExpertRegistration(false)} />
            ) : activeTab === 'customer' && showCustomerRegistration ? (
                <CustomerRegistration onBack={() => setShowCustomerRegistration(false)} />
            ) : (
                <Card className="w-full max-w-2xl backdrop-blur-md bg-white/80 border border-white/50 shadow-xl">
                    <CardHeader className="text-center">
                        <div className="flex flex-col items-center justify-center mb-4">
                            <img src={getAssetPath("/img/Asset 3.png")} alt="logo" className="h-16 w-16 mb-2" />
                            <h1 className="text-2xl font-bold text-primary mb-2">লাঙল</h1>
                            <p className="text-sm text-gray-700 font-medium px-3 py-1 bg-green-50 rounded-md border-l-4 border-green-500">
                                কৃষকের ডিজিটাল হাতিয়ার
                            </p>
                        </div>
                        <CardTitle className="text-xl">নতুন অ্যাকাউন্ট তৈরি করুন</CardTitle>
                        <CardDescription>
                            আপনার ধরণ অনুযায়ী নিবন্ধন করুন
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UserType)}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger
                                    value="farmer"
                                    className={`flex items-center gap-1 ${activeTab === 'farmer'
                                        ? 'data-[state=active]:bg-green-100 data-[state=active]:text-green-800 data-[state=active]:border-green-500'
                                        : ''
                                        }`}
                                >
                                    {getUserTypeIcon('farmer')}
                                    <span className="hidden sm:inline">কৃষক</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="expert"
                                    className={`flex items-center gap-1 ${activeTab === 'expert'
                                        ? 'data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 data-[state=active]:border-blue-500'
                                        : ''
                                        }`}
                                >
                                    {getUserTypeIcon('expert')}
                                    <span className="hidden sm:inline">বিশেষজ্ঞ</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="customer"
                                    className={`flex items-center gap-1 ${activeTab === 'customer'
                                        ? 'data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 data-[state=active]:border-purple-500'
                                        : ''
                                        }`}
                                >
                                    {getUserTypeIcon('customer')}
                                    <span className="hidden sm:inline">ক্রেতা</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Farmer Registration Button */}
                            <TabsContent value="farmer" className="space-y-4 mt-6">
                                <Alert className="border-green-200 bg-green-50">
                                    <User className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        কৃষক নিবন্ধনের জন্য একটি বিশেষ প্রক্রিয়া রয়েছে। আপনার মোবাইল নম্বর, পরিচয়পত্র এবং OTP যাচাইয়ের মাধ্যমে নিবন্ধন সম্পন্ন করুন।
                                    </AlertDescription>
                                </Alert>

                                <div className="text-center">
                                    <Button
                                        onClick={() => setShowFarmerRegistration(true)}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        size="lg"
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        কৃষক নিবন্ধন শুরু করুন
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Expert Registration Button */}
                            <TabsContent value="expert" className="space-y-4 mt-6">
                                <Alert className="border-blue-200 bg-blue-50">
                                    <UserCheck className="h-4 w-4 text-blue-600" />
                                    <AlertDescription className="text-blue-800">
                                        বিশেষজ্ঞ নিবন্ধনের জন্য মোবাইল নম্বর এবং OTP যাচাইয়ের মাধ্যমে নিবন্ধন সম্পন্ন করুন।
                                    </AlertDescription>
                                </Alert>

                                <div className="text-center">
                                    <Button
                                        onClick={() => setShowExpertRegistration(true)}
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        size="lg"
                                    >
                                        <UserCheck className="mr-2 h-4 w-4" />
                                        বিশেষজ্ঞ নিবন্ধন শুরু করুন
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Customer forms remain the same */}


                            {/* Customer Registration Button */}
                            <TabsContent value="customer" className="space-y-4 mt-6">
                                <Alert className="border-purple-200 bg-purple-50">
                                    <Users className="h-4 w-4 text-purple-600" />
                                    <AlertDescription className="text-purple-800">
                                        ক্রেতা/ব্যবসায়ী হিসেবে নিবন্ধনের জন্য আপনার ব্যক্তিগত তথ্য, ব্যবসার তথ্য এবং OTP যাচাইয়ের মাধ্যমে নিবন্ধন সম্পন্ন করুন।
                                    </AlertDescription>
                                </Alert>

                                <div className="text-center">
                                    <Button
                                        onClick={() => setShowCustomerRegistration(true)}
                                        className="w-full bg-purple-600 hover:bg-purple-700"
                                        size="lg"
                                    >
                                        <Users className="mr-2 h-4 w-4" />
                                        ক্রেতা/ব্যবসায়ী নিবন্ধন শুরু করুন
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-center text-sm text-gray-600">
                            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                            <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
                                লগইন করুন
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default Register;
