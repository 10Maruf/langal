import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Phone, Lock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/services/api";
import DataOperatorForgotPassword from "./DataOperatorForgotPassword";

interface DataOperatorLoginProps {
    onBackToMainLogin: () => void;
}

const DataOperatorLogin = ({ onBackToMainLogin }: DataOperatorLoginProps) => {
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const { setAuthUser } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!mobileNumber || !password) {
            toast({
                title: "ত্রুটি",
                description: "মোবাইল নম্বর এবং পাসওয়ার্ড দিন",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/data-operator/login', {
                phone: mobileNumber,
                password: password
            });

            if (response.data.success) {
                const { user, token } = response.data.data;

                // Map backend user to frontend user format
                const authUser = {
                    id: user.user_id.toString(),
                    user_id: user.user_id,
                    name: user.profile?.full_name || user.phone,
                    type: 'data_operator' as const,
                    email: user.email || '',
                    phone: user.phone,
                    profilePhoto: user.profile?.profile_photo_url_full,
                    nidNumber: user.profile?.nid_number,
                    location: user.profile?.address,
                    location_info: user.location_info || undefined
                };

                // Set user in context
                setAuthUser(authUser, token);

                toast({
                    title: "সফল",
                    description: "সফলভাবে লগইন হয়েছে",
                });

                // Redirect to data operator dashboard
                navigate('/data-operator-dashboard');
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error: any) {
            console.error('Login Error:', error);

            let errorMessage = "লগইন করতে সমস্যা হয়েছে";

            if (error.response?.status === 404) {
                errorMessage = "এই মোবাইল নম্বরে কোনো ডাটা অপারেটর অ্যাকাউন্ট নেই।";
            } else if (error.response?.status === 401) {
                errorMessage = "পাসওয়ার্ড ভুল হয়েছে।";
            } else if (error.response?.status === 403) {
                errorMessage = "আপনার অ্যাকাউন্ট নিষ্ক্রিয়। সহায়তা নিন।";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast({
                title: "ত্রুটি",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Show forgot password component
    if (showForgotPassword) {
        return <DataOperatorForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">ডাটা অপারেটর লগইন</CardTitle>
                    <CardDescription>
                        মোবাইল নম্বর এবং পাসওয়ার্ড দিয়ে লগইন করুন
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Alert className="border-blue-200 bg-blue-50 mb-6">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                            নিবন্ধনের সময় ব্যবহৃত মোবাইল নম্বর এবং পাসওয়ার্ড দিন
                        </AlertDescription>
                    </Alert>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="mobileNumber">মোবাইল নম্বর *</Label>
                            <Input
                                id="mobileNumber"
                                type="tel"
                                placeholder="01XXXXXXXXX"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                                disabled={isLoading}
                            />
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
                            <Input
                                id="password"
                                type="password"
                                placeholder="আপনার পাসওয়ার্ড"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    লগইন হচ্ছে...
                                </>
                            ) : (
                                <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    লগইন করুন
                                </>
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={onBackToMainLogin}
                            disabled={isLoading}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            ফিরে যান
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default DataOperatorLogin;
