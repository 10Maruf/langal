import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserCheck, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DataOperatorRegistration from "@/components/data-operator/DataOperatorRegistration";
import DataOperatorLogin from "@/components/data-operator/DataOperatorLogin";
import { getAssetPath } from "@/lib/utils";

const DataOperatorAuth = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");

    // If already logged in as data operator, redirect to dashboard
    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.type === 'data_operator') {
            console.log('DataOperatorAuth - Already logged in, redirecting to dashboard');
            navigate('/data-operator-dashboard', { replace: true });
        }
    }, [isAuthenticated, user, isLoading, navigate]);

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-6 shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/")}
                                className="text-white hover:bg-orange-700"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
                                    <UserCheck className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">ডাটা অপারেটর</h1>
                                    <p className="text-orange-100 text-sm">Data Operator</p>
                                </div>
                            </div>
                        </div>
                        <UserCheck className="h-12 w-12 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    <Card className="shadow-xl border-orange-200">
                        <CardHeader className="text-center border-b bg-gradient-to-r from-orange-50 to-orange-100">
                            <CardTitle className="text-3xl text-orange-800 flex items-center justify-center gap-2">
                                <UserCheck className="h-8 w-8" />
                                ডাটা অপারেটর সিস্টেম
                            </CardTitle>
                            <CardDescription className="text-lg text-orange-700">
                                কৃষি ডাটা পরিচালনা ও যাচাইকরণ সিস্টেম
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger
                                        value="login"
                                        className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        লগইন
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="register"
                                        className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        নিবন্ধন
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="login" className="mt-0">
                                    <DataOperatorLogin onBackToMainLogin={() => navigate("/login")} />
                                </TabsContent>

                                <TabsContent value="register" className="mt-0">
                                    <DataOperatorRegistration />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Info Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-orange-800">
                                    <UserCheck className="h-5 w-5" />
                                    ডাটা অপারেটর হিসেবে আপনার ভূমিকা
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 mt-1">•</span>
                                        <span>কৃষকদের প্রোফাইল যাচাই ও অনুমোদন</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 mt-1">•</span>
                                        <span>ফসলের তথ্য যাচাইকরণ</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 mt-1">•</span>
                                        <span>মাঠ পর্যায়ের ডাটা সংগ্রহ ও এন্ট্রি</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 mt-1">•</span>
                                        <span>রিপোর্ট তৈরি ও বিশ্লেষণ</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-orange-800">
                                    <UserPlus className="h-5 w-5" />
                                    নিবন্ধনের জন্য প্রয়োজনীয় তথ্য
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 mt-1">•</span>
                                        <span>সম্পূর্ণ নাম (বাংলায়)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 mt-1">•</span>
                                        <span>জাতীয় পরিচয়পত্র নম্বর</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 mt-1">•</span>
                                        <span>জন্ম তারিখ ও পিতা-মাতার নাম</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 mt-1">•</span>
                                        <span>বর্তমান ঠিকানা ও মোবাইল নম্বর</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-orange-600 mt-1">•</span>
                                        <span>প্রোফাইল ছবি</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataOperatorAuth;
