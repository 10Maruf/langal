import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Phone, ArrowLeft, Lock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAssetPath } from "@/lib/utils";
import api from "@/services/api";
import CustomerForgotPassword from "./CustomerForgotPassword";

interface CustomerLoginProps {
    onBackToMainLogin: () => void;
}

const CustomerLogin = ({ onBackToMainLogin }: CustomerLoginProps) => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const { setAuthUser } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone || !password) {
            toast({
                title: "ত্রুটি",
                description: "অনুগ্রহ করে মোবাইল নম্বর ও পাসওয়ার্ড দিন",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/customer/login', {
                phone: phone,
                password: password,
            });

            if (response.data.success) {
                const { user, token } = response.data.data;

                // Check verification status first - BEFORE setting auth user
                const verificationStatus = user.profile?.verification_status || 'pending';

                // Block rejected users from logging in
                if (verificationStatus === 'rejected') {
                    toast({
                        title: "প্রোফাইল প্রত্যাখ্যাত",
                        description: "আপনার প্রোফাইল প্রত্যাখ্যাত হয়েছে। সঠিক তথ্য দিয়ে পুনরায় রেজিস্ট্রেশনের জন্য অনুগ্রহ করে নিকটস্থ কৃষি অফিসে যোগাযোগ করুন।",
                        variant: "destructive",
                    });
                    setIsLoading(false);
                    return;
                }

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
                    verificationStatus: verificationStatus
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

    if (showForgotPassword) {
        return <CustomerForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
    }

    return (
        <Card className="w-full max-w-md backdrop-blur-md bg-white/80 border border-white/50 shadow-xl">
            <CardHeader className="text-center">
                <div className="flex justify-start mb-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBackToMainLogin}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ফিরে যান
                    </Button>
                </div>
                <div className="flex flex-col items-center justify-center mb-4">
                    <img src={getAssetPath("/img/Asset 3.png")} alt="logo" className="h-16 w-16 mb-2" />
                    <h1 className="text-2xl font-bold text-primary mb-2">লাঙল</h1>
                    <p className="text-sm text-gray-700 font-medium px-3 py-1 bg-purple-50 rounded-md border-l-4 border-purple-500">
                        কৃষকের ডিজিটাল হাতিয়ার
                    </p>
                </div>
                <CardTitle className="text-xl text-purple-800">ক্রেতা/ব্যবসায়ী লগইন</CardTitle>
                <CardDescription>
                    মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে লগইন করুন
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
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
                            <Label htmlFor="password">পাসওয়ার্ড</Label>
                            <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto text-sm text-purple-600 hover:text-purple-700"
                                onClick={() => setShowForgotPassword(true)}
                            >
                                পাসওয়ার্ড ভুলে গেছেন?
                            </Button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="আপনার পাসওয়ার্ড দিন"
                                className="pl-10 border-purple-200 focus:border-purple-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
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
                                <Users className="mr-2 h-4 w-4" />
                                ক্রেতা/ব্যবসায়ী হিসেবে লগইন
                            </>
                        )}
                    </Button>

                    <div className="text-center text-sm text-gray-600 pt-2">
                        নতুন ব্যবহারকারী?{" "}
                        <Button
                            type="button"
                            variant="link"
                            className="p-0 text-purple-600 hover:text-purple-700 font-medium"
                            onClick={() => {
                                onBackToMainLogin();
                                // Navigate will happen from parent
                            }}
                        >
                            নিবন্ধন করুন
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CustomerLogin;
