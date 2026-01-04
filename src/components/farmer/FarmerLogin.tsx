import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Phone, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAssetPath } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { API_URL } from '@/services/api';

type LoginStep = 'phone' | 'otp';

interface FarmerLoginProps {
    onBackToMainLogin: () => void;
}

// API Base URL
const API_BASE = API_URL;

// Clear old session data
const clearOldSession = () => {
    console.log('Clearing old session data...');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    sessionStorage.clear();
};

const FarmerLogin = ({ onBackToMainLogin }: FarmerLoginProps) => {
    const [currentStep, setCurrentStep] = useState<LoginStep>('phone');
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const { login, setAuthUser } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Clear old session on component mount
    useEffect(() => {
        clearOldSession();
    }, []);

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone) {
            toast({
                title: "ত্রুটি",
                description: "মোবাইল নম্বর দিন",
                variant: "destructive",
            });
            return;
        }

        // For prototype - accept any phone number
        // if (phone.length < 11) {
        //     toast({
        //         title: "ত্রুটি",
        //         description: "সঠিক মোবাইল নম্বর দিন",
        //         variant: "destructive",
        //     });
        //     return;
        // }

        setIsLoading(true);

        try {
            // Real API call to send OTP
            const response = await fetch(`${API_BASE}/farmer/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone }),
            });
            let data: { success?: boolean; data?: { otp_code?: string }; message?: string };
            try {
                data = await response.json();
            } catch {
                throw new Error('Invalid server response');
            }

            if (response.ok && data?.success) {
                // Store the generated OTP for demo purposes
                if (data.data.otp_code) {
                    setGeneratedOtp(data.data.otp_code);
                    console.log('Generated OTP:', data.data.otp_code); // For testing
                }

                toast({
                    title: "OTP পাঠানো হয়েছে",
                    description: `আপনার ${phone} নম্বরে OTP পাঠানো হয়েছে`,
                });

                setOtpSent(true);
                setCurrentStep('otp');
            } else {
                const backendMsg = data?.message;
                // Specific not-found handling
                if (response.status === 404 && backendMsg?.includes('No farmer account')) {
                    toast({
                        title: 'কৃষকের অ্যাকাউন্ট পাওয়া যায়নি',
                        description: 'এই নম্বরে কোনো কৃষক নিবন্ধিত নেই। আগে নিবন্ধন করুন অথবা সঠিক নম্বর দিন।',
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
                        title: 'OTP পাঠাতে সমস্যা',
                        description: backendMsg || 'সার্ভার থেকে OTP পাঠানো যায়নি। পরে চেষ্টা করুন।',
                        variant: 'destructive'
                    });
                }
                return; // stop further state changes
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: (error as Error).message || "OTP পাঠাতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp) {
            toast({
                title: "ত্রুটি",
                description: "OTP কোড দিন",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Real API call to verify OTP
            const response = await fetch(`${API_BASE}/farmer/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone,
                    otp_code: otp
                }),
            });
            let data: { success?: boolean; data?: { token?: string; user?: unknown }; message?: string };
            try { data = await response.json(); } catch { throw new Error('Invalid server response'); }

            if (response.ok && data?.success) {
                // Check verification status
                const backendUser = data.data.user as any;
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
                if (data.data.token) {
                    localStorage.setItem('auth_token', data.data.token);
                    localStorage.setItem('user_data', JSON.stringify(data.data.user));

                    // Set user in AuthContext with actual backend data
                    setAuthUser({
                        id: backendUser.user_id?.toString() || '',
                        user_id: backendUser.user_id,
                        name: backendUser.profile?.full_name || backendUser.full_name || 'কৃষক',
                        type: 'farmer',
                        email: backendUser.email || '',
                        phone: backendUser.phone || phone,
                        profilePhoto: backendUser.profile?.profile_photo_url_full,
                        nidNumber: backendUser.profile?.nid_number,
                        location: backendUser.profile?.address,
                        location_info: backendUser.location_info || undefined,
                        verificationStatus: verificationStatus
                    }, data.data.token);
                }

                toast({
                    title: "সফল",
                    description: "সফলভাবে লগইন হয়েছে",
                });

                // Redirect to farmer dashboard
                navigate('/farmer-dashboard');
            } else {
                const backendMsg = data?.message;
                if (response.status === 400) {
                    toast({
                        title: 'ভুল OTP',
                        description: backendMsg || 'আপনার দেওয়া OTP সঠিক নয়। আবার চেষ্টা করুন।',
                        variant: 'destructive'
                    });
                } else if (response.status === 404) {
                    toast({
                        title: 'ব্যবহারকারী পাওয়া যায়নি',
                        description: backendMsg || 'এই নম্বরের কোনো ব্যবহারকারী নেই।',
                        variant: 'destructive'
                    });
                } else {
                    toast({
                        title: 'যাচাই ব্যর্থ',
                        description: backendMsg || 'OTP যাচাই সম্পন্ন করা যায়নি।',
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



    const handleResendOtp = async () => {
        setIsLoading(true);

        try {
            // Real API call to resend OTP
            const response = await fetch(`${API_BASE}/farmer/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone }),
            });

            const data = await response.json();

            if (data.success) {
                // Store the new generated OTP for demo purposes
                if (data.data.otp_code) {
                    setGeneratedOtp(data.data.otp_code);
                    console.log('New OTP:', data.data.otp_code); // For testing
                }

                toast({
                    title: "নতুন OTP পাঠানো হয়েছে",
                    description: `আপনার ${phone} নম্বরে নতুন OTP পাঠানো হয়েছে`,
                });
            } else {
                throw new Error(data.message || 'OTP পাঠাতে সমস্যা হয়েছে');
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "OTP পাঠাতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderPhoneForm = () => (
        <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
                <Phone className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                    কৃষক লগইনের জন্য আপনার মোবাইল নম্বর দিন
                    <br />
                    {/* <span className="text-orange-600 font-medium">প্রোটোটাইপ মোড: যেকোনো নম্বর দিলেই হবে</span> */}
                </AlertDescription>
            </Alert>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">মোবাইল নম্বর *</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="01700000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="text-lg"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                    size="lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            OTP পাঠানো হচ্ছে...
                        </>
                    ) : (
                        <>
                            <Phone className="mr-2 h-4 w-4" />
                            OTP পাঠান
                        </>
                    )}
                </Button>
            </form>
        </div>
    );

    const renderOtpForm = () => (
        <div className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                    আপনার {phone} নম্বরে একটি ৬ ডিজিটের OTP কোড পাঠানো হয়েছে
                </AlertDescription>
            </Alert>

            {/* OTP Display for Demo/Testing - Shows OTP on screen */}
            {generatedOtp && (
                <Alert className="border-orange-300 bg-orange-50">
                    <AlertDescription className="text-orange-800 text-center">
                        <span className="font-medium">🔐 ডেমো OTP কোড:</span>
                        <br />
                        <span className="text-2xl font-bold tracking-widest text-orange-600">{generatedOtp}</span>
                        <br />
                        <span className="text-xs text-gray-500">(মোবাইল টেস্টিং এর জন্য)</span>
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="otp">OTP কোড *</Label>
                    <Input
                        id="otp"
                        type="text"
                        placeholder="৬ ডিজিট OTP কোড"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                        className="text-center text-2xl tracking-widest"
                    />
                    <div className="text-sm text-gray-600 text-center space-x-2">
                        <span>OTP পাননি?</span>
                        <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto"
                            onClick={handleResendOtp}
                            disabled={isLoading}
                        >
                            আবার পাঠান
                        </Button>
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
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            লগইন করুন
                        </>
                    )}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep('phone')}
                    className="w-full"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    নম্বর পরিবর্তন করুন
                </Button>
            </form>
        </div>
    );

    return (
        <Card className="w-full max-w-md backdrop-blur-md bg-white/80 border border-white/50 shadow-xl">
            <CardHeader className="text-center">
                <div className="flex justify-start mb-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBackToMainLogin}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ফিরে যান
                    </Button>
                </div>
                <div className="flex flex-col items-center justify-center mb-4">
                    <img src={getAssetPath("/img/Asset 3.png")} alt="logo" className="h-16 w-16 mb-2" />
                    <h1 className="text-2xl font-bold text-primary mb-2">লাঙল</h1>
                    <p className="text-sm text-gray-700 font-medium px-3 py-1 bg-green-50 rounded-md border-l-4 border-green-500">
                        কৃষকের ডিজিটাল হাতিয়ার
                    </p>
                </div>
                <CardTitle className="text-xl text-green-600">কৃষক লগইন</CardTitle>
                <CardDescription>
                    {currentStep === 'phone'
                        ? 'মোবাইল নম্বর দিয়ে লগইন করুন'
                        : 'OTP যাচাই করুন'
                    }
                </CardDescription>
            </CardHeader>

            <CardContent>
                {currentStep === 'phone' && renderPhoneForm()}
                {currentStep === 'otp' && renderOtpForm()}
            </CardContent>
        </Card>
    );
};

export default FarmerLogin;
