import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Phone, ArrowLeft, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExpertForgotPassword from "./ExpertForgotPassword";

interface ExpertLoginProps {
    onBackToMainLogin: () => void;
}

// API Base URL
const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

const ExpertLogin = ({ onBackToMainLogin }: ExpertLoginProps) => {
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
                description: "মোবাইল নম্বর ও পাসওয়ার্ড দিন",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // API call to login
            const response = await fetch(`${API_BASE}/expert/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone,
                    password
                }),
            });

            let data: { success?: boolean; data?: { token?: string; user?: any }; message?: string };
            try {
                data = await response.json();
            } catch {
                throw new Error('Invalid server response');
            }

            if (response.ok && data?.success) {
                // Check verification status first
                const backendUser = data.data.user;
                const verificationStatus = backendUser.profile?.verification_status || 'pending';

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

                // Store authentication data
                if (data.data?.token) {
                    localStorage.setItem('auth_token', data.data.token);
                    localStorage.setItem('user_data', JSON.stringify(data.data.user));

                    // Set user in AuthContext with actual backend data
                    setAuthUser({
                        id: backendUser.user_id?.toString() || '',
                        user_id: backendUser.user_id,
                        name: backendUser.profile?.full_name || backendUser.full_name || 'বিশেষজ্ঞ',
                        type: 'expert',
                        email: backendUser.email || '',
                        phone: backendUser.phone || phone,
                        profilePhoto: backendUser.profile?.profile_photo_url_full,
                        nidNumber: backendUser.profile?.nid_number,
                        location: backendUser.profile?.address,
                        expertProfile: backendUser.expert || undefined,
                        verificationStatus: verificationStatus
                    }, data.data.token);
                }

                toast({
                    title: "সফল",
                    description: "সফলভাবে লগইন হয়েছে",
                });

                // Redirect to expert dashboard
                navigate('/consultant-dashboard');
            } else {
                const backendMsg = data?.message;
                if (response.status === 404) {
                    toast({
                        title: 'অ্যাকাউন্ট পাওয়া যায়নি',
                        description: 'এই নম্বরে কোনো বিশেষজ্ঞ নিবন্ধিত নেই।',
                        variant: 'destructive'
                    });
                } else if (response.status === 401) {
                    toast({
                        title: 'ভুল পাসওয়ার্ড',
                        description: 'আপনার দেওয়া পাসওয়ার্ড সঠিক নয়।',
                        variant: 'destructive'
                    });
                } else if (response.status === 403) {
                    toast({
                        title: 'অ্যাকাউন্ট নিষ্ক্রিয়',
                        description: backendMsg || 'আপনার অ্যাকাউন্ট নিষ্ক্রিয়। সহায়তা নিন।',
                        variant: 'destructive'
                    });
                } else {
                    toast({
                        title: 'লগইন ব্যর্থ',
                        description: backendMsg || 'লগইন করা যায়নি।',
                        variant: 'destructive'
                    });
                }
                return;
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: (error as Error).message || "লগইনে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Show forgot password component
    if (showForgotPassword) {
        return <ExpertForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-xl text-blue-600">বিশেষজ্ঞ লগইন</CardTitle>
                <CardDescription>
                    মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে লগইন করুন
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">মোবাইল নম্বর *</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="০১XXXXXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="password">পাসওয়ার্ড *</Label>
                            <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto text-sm text-blue-600 hover:text-blue-700"
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
                                placeholder="আপনার পাসওয়ার্ড"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                        size="lg"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                লগইন হচ্ছে...
                            </>
                        ) : (
                            'লগইন করুন'
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBackToMainLogin}
                        className="w-full"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        অন্য ধরনের লগইন
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ExpertLogin;
