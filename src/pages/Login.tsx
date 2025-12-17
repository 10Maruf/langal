import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, UserType } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Users, User, UserCheck, Database, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAssetPath } from "@/lib/utils";
import FarmerLogin from "@/components/farmer/FarmerLogin";
import ExpertLogin from "@/components/expert/ExpertLogin";
import CustomerForgotPassword from "@/components/customer/CustomerForgotPassword";
import api from "@/services/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<UserType>("farmer");
    const [showFarmerLogin, setShowFarmerLogin] = useState(false);
    const [showExpertLogin, setShowExpertLogin] = useState(false);
    const [showCustomerForgotPassword, setShowCustomerForgotPassword] = useState(false);
    const { login, setAuthUser } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Expert uses email, Customer uses phone
        if (activeTab === 'expert' && (!email || !password)) {
            toast({
                title: "ত্রুটি",
                description: "অনুগ্রহ করে সব ক্ষেত্র পূরণ করুন",
                variant: "destructive",
            });
            return;
        }

        if (activeTab === 'customer' && (!phone || !password)) {
            toast({
                title: "ত্রুটি",
                description: "অনুগ্রহ করে মোবাইল নম্বর ও পাসওয়ার্ড দিন",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            if (activeTab === 'customer') {
                // Customer login via API
                const response = await api.post('/customer/login', {
                    phone: phone,
                    password: password,
                });

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

                    toast({
                        title: "সফল",
                        description: "সফলভাবে লগইন হয়েছে",
                    });

                    navigate('/customer-dashboard');
                } else {
                    throw new Error(response.data.message);
                }
            } else {
                // Expert login (existing flow)
                const success = await login(email, password, activeTab);
                if (success) {
                    toast({
                        title: "সফল",
                        description: "সফলভাবে লগইন হয়েছে",
                    });

                    // Navigate based on user type
                    switch (activeTab) {
                        case 'farmer':
                            navigate('/');
                            break;
                        case 'expert':
                            navigate('/consultant-dashboard');
                            break;
                        default:
                            navigate('/');
                    }
                }
            }
        } catch (error: any) {
            toast({
                title: "ত্রুটি",
                description: error.response?.data?.message || "লগইনে সমস্যা হয়েছে",
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
                return 'বিশেষজ্ঞ';
            case 'customer':
                return 'ক্রেতা';
            default:
                return '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            {/* Data Operator Access Button */}
            <div className="absolute top-4 right-4">
                <Button
                    onClick={() => navigate('/data-operator')}
                    variant="outline"
                    className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                >
                    <Database className="h-4 w-4" />
                    <span className="hidden sm:inline">ডাটা অপারেটর</span>
                </Button>
            </div>

            {/* Show Farmer Login Component if farmer is selected */}
            {activeTab === 'farmer' && showFarmerLogin ? (
                <FarmerLogin onBackToMainLogin={() => setShowFarmerLogin(false)} />
            ) : activeTab === 'expert' && showExpertLogin ? (
                <ExpertLogin onBackToMainLogin={() => setShowExpertLogin(false)} />
            ) : showCustomerForgotPassword ? (
                <CustomerForgotPassword onBackToLogin={() => setShowCustomerForgotPassword(false)} />
            ) : (
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex flex-col items-center justify-center mb-4">
                            <img src={getAssetPath("/img/Asset 3.png")} alt="logo" className="h-16 w-16 mb-2" />
                            <h1 className="text-2xl font-bold text-primary mb-2">লাঙল</h1>
                            <p className="text-sm text-gray-700 font-medium px-3 py-1 bg-green-50 rounded-md border-l-4 border-green-500">
                                কৃষকের ডিজিটাল হাতিয়ার
                            </p>
                        </div>
                        <CardTitle className="text-xl">লগইন করুন</CardTitle>
                        <CardDescription>
                            আপনার অ্যাকাউন্টে প্রবেশ করতে তথ্য দিন
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

                            <form onSubmit={handleLogin} className="space-y-4 mt-6">
                                <TabsContent value="farmer" className="space-y-4 mt-0">
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <h3 className="font-semibold text-green-800">কৃষক হিসেবে লগইন</h3>
                                        <p className="text-sm text-green-600 mb-3">মোবাইল নম্বর দিয়ে OTP এর মাধ্যমে লগইন করুন</p>
                                        <Button
                                            type="button"
                                            onClick={() => setShowFarmerLogin(true)}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            কৃষক লগইন
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="expert" className="space-y-4 mt-0">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <h3 className="font-semibold text-blue-800">কৃষি বিশেষজ্ঞ হিসেবে লগইন</h3>
                                        <p className="text-sm text-blue-600 mb-3">মোবাইল নম্বর দিয়ে OTP এর মাধ্যমে লগইন করুন</p>
                                        <Button
                                            type="button"
                                            onClick={() => setShowExpertLogin(true)}
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                        >
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            বিশেষজ্ঞ লগইন
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="customer" className="space-y-4 mt-0">
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <h3 className="font-semibold text-purple-800">ক্রেতা/ব্যবসায়ী হিসেবে লগইন</h3>
                                        <p className="text-sm text-purple-600">মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে লগইন করুন</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">মোবাইল নম্বর</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="০১XXXXXXXXX"
                                                className="pl-10 border-purple-200 focus:border-purple-500"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="customerPassword">পাসওয়ার্ড</Label>
                                            <Button
                                                type="button"
                                                variant="link"
                                                className="p-0 h-auto text-sm text-purple-600 hover:text-purple-700"
                                                onClick={() => setShowCustomerForgotPassword(true)}
                                            >
                                                পাসওয়ার্ড ভুলে গেছেন?
                                            </Button>
                                        </div>
                                        <Input
                                            id="customerPassword"
                                            type="password"
                                            placeholder="আপনার পাসওয়ার্ড দিন"
                                            className="border-purple-200 focus:border-purple-500"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </TabsContent>

                                {/* Only show email/password fields for expert - REMOVED, now using OTP */}
                            </form>
                        </Tabs>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        {/* Expert login button - REMOVED, now using OTP flow */}

                        {/* Customer login button - Purple */}
                        {activeTab === 'customer' && (
                            <Button
                                onClick={handleLogin}
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        লগইন হচ্ছে...
                                    </>
                                ) : (
                                    <>
                                        {getUserTypeIcon(activeTab)}
                                        <span className="ml-2">ক্রেতা/ব্যবসায়ী হিসেবে লগইন</span>
                                    </>
                                )}
                            </Button>
                        )}

                        <div className="text-center text-sm text-gray-600">
                            নতুন ব্যবহারকারী?{" "}
                            <Button
                                variant="link"
                                className="p-0 text-green-600 hover:text-green-700 font-medium"
                                onClick={() => navigate('/register')}
                            >
                                নিবন্ধন করুন
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default Login;
