import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Phone, ArrowLeft, Lock, KeyRound, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from '@/services/api';

interface ExpertForgotPasswordProps {
    onBackToLogin: () => void;
}

type Step = 'phone' | 'otp' | 'reset' | 'success';

// API Base URL
const API_BASE = API_URL;

const ExpertForgotPassword = ({ onBackToLogin }: ExpertForgotPasswordProps) => {
    const [currentStep, setCurrentStep] = useState<Step>('phone');
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState("");

    const { toast } = useToast();

    // Step 1: Send OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone || phone.length < 11) {
            toast({
                title: "ত্রুটি",
                description: "সঠিক মোবাইল নম্বর দিন",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/expert/forgot-password/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store OTP for dev mode display
                if (data.data?.otp_code) {
                    setGeneratedOtp(data.data.otp_code);
                }

                toast({
                    title: "সফল",
                    description: "আপনার মোবাইলে OTP পাঠানো হয়েছে",
                });

                setCurrentStep('otp');
            } else {
                toast({
                    title: "ত্রুটি",
                    description: data.message || "OTP পাঠাতে সমস্যা হয়েছে",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "সার্ভারে সংযোগ করতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP and go to reset password
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            toast({
                title: "ত্রুটি",
                description: "৬ সংখ্যার OTP দিন",
                variant: "destructive",
            });
            return;
        }

        setCurrentStep('reset');
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || newPassword.length < 6) {
            toast({
                title: "ত্রুটি",
                description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
                variant: "destructive",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({
                title: "ত্রুটি",
                description: "পাসওয়ার্ড মিলছে না",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/expert/forgot-password/reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone,
                    otp_code: otp,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast({
                    title: "সফল",
                    description: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে",
                });
                setCurrentStep('success');
            } else {
                toast({
                    title: "ত্রুটি",
                    description: data.message || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "সার্ভারে সংযোগ করতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE}/expert/forgot-password/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                if (data.data?.otp_code) {
                    setGeneratedOtp(data.data.otp_code);
                }
                toast({
                    title: "সফল",
                    description: "নতুন OTP পাঠানো হয়েছে",
                });
            } else {
                toast({
                    title: "ত্রুটি",
                    description: data.message || "OTP পাঠাতে সমস্যা হয়েছে",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "সার্ভারে সংযোগ করতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-xl text-blue-600">
                    {currentStep === 'success' ? 'পাসওয়ার্ড পরিবর্তন সফল' : 'পাসওয়ার্ড ভুলে গেছেন?'}
                </CardTitle>
                <CardDescription>
                    {currentStep === 'phone' && 'আপনার নিবন্ধিত মোবাইল নম্বর দিন'}
                    {currentStep === 'otp' && 'মোবাইলে পাঠানো OTP দিন'}
                    {currentStep === 'reset' && 'নতুন পাসওয়ার্ড সেট করুন'}
                    {currentStep === 'success' && 'আপনি এখন লগইন করতে পারবেন'}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Step 1: Phone Input */}
                {currentStep === 'phone' && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
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
                                    className="pl-10 border-blue-200 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    OTP পাঠানো হচ্ছে...
                                </>
                            ) : (
                                'OTP পাঠান'
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBackToLogin}
                            className="w-full"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            লগইনে ফিরে যান
                        </Button>
                    </form>
                )}

                {/* Step 2: OTP Verification */}
                {currentStep === 'otp' && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        {/* Dev mode OTP display */}
                        {generatedOtp && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                <p className="text-sm text-yellow-700">ডেভেলপমেন্ট মোড - OTP: <strong className="text-lg">{generatedOtp}</strong></p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="otp">OTP কোড *</Label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="৬ সংখ্যার OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    maxLength={6}
                                    className="pl-10 text-center text-2xl tracking-widest border-blue-200 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={isLoading || otp.length !== 6}
                        >
                            যাচাই করুন
                        </Button>

                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setCurrentStep('phone')}
                                className="text-gray-600"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                পেছনে যান
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleResendOtp}
                                disabled={isLoading}
                                className="text-blue-600"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                পুনরায় OTP পাঠান
                            </Button>
                        </div>
                    </form>
                )}

                {/* Step 3: Reset Password */}
                {currentStep === 'reset' && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">নতুন পাসওয়ার্ড *</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="কমপক্ষে ৬ অক্ষর"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="pl-10 border-blue-200 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন *</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="পুনরায় পাসওয়ার্ড দিন"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="pl-10 border-blue-200 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    পরিবর্তন হচ্ছে...
                                </>
                            ) : (
                                'পাসওয়ার্ড পরিবর্তন করুন'
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setCurrentStep('otp')}
                            className="w-full text-gray-600"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            পেছনে যান
                        </Button>
                    </form>
                )}

                {/* Step 4: Success */}
                {currentStep === 'success' && (
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <p className="text-gray-600">
                            আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।
                        </p>
                        <Button
                            onClick={onBackToLogin}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            লগইন করুন
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ExpertForgotPassword;
