import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, TrendingUp, Calendar, CheckCircle, Clock, AlertCircle, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Link } from "react-router-dom";
import { ExpertNotifications } from "@/components/notifications/ExpertNotifications";

const ExpertDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("feed");
    const [activeConsultations] = useState([
        {
            id: 1,
            farmer: "আবদুল করিম",
            crop: "ধান",
            issue: "পাতা হলুদ হয়ে যাচ্ছে",
            priority: "high",
            time: "২ ঘন্টা আগে",
            status: "pending"
        },
        {
            id: 2,
            farmer: "রহিমা খাতুন",
            crop: "টমেটো",
            issue: "ফল ছোট হচ্ছে",
            priority: "medium",
            time: "৪ ঘন্টা আগে",
            status: "in-progress"
        },
        {
            id: 3,
            farmer: "মোঃ সালাম",
            crop: "আলু",
            issue: "পোকামাকড়ের আক্রমণ",
            priority: "high",
            time: "১ দিন আগে",
            status: "completed"
        }
    ]);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4 text-orange-500" />;
            case 'in-progress':
                return <AlertCircle className="h-4 w-4 text-blue-500" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'অপেক্ষমান';
            case 'in-progress':
                return 'চলমান';
            case 'completed':
                return 'সম্পন্ন';
            default:
                return 'অজানা';
        }
    };

    return (
        <NotificationProvider>
            <div className="min-h-screen bg-background">
                <Header />

                <main className="container mx-auto px-4 py-6 pb-20">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-foreground">
                            স্বাগতম, {user?.name || 'কৃষি বিশেষজ্ঞ'}
                        </h1>
                        <p className="text-muted-foreground">
                            কৃষকদের সহায়তা ও পরামর্শ প্রদানের ড্যাশবোর্ড
                        </p>
                    </div>

                    {/* Stats Cards - Removed as per requirement */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"> ... </div> */}

                    <Tabs defaultValue="consultations" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="consultations">পরামর্শ সেবা</TabsTrigger>
                            <TabsTrigger value="notifications">
                                <div className="flex items-center gap-1">
                                    <Bell className="h-4 w-4" />
                                    নোটিফিকেশন
                                </div>
                            </TabsTrigger>
                            <TabsTrigger value="social">সামাজিক ফিড</TabsTrigger>
                            <TabsTrigger value="profile">প্রোফাইল</TabsTrigger>
                            <TabsTrigger value="analytics">বিশ্লেষণ</TabsTrigger>
                        </TabsList>

                        <TabsContent value="consultations">
                            <Card>
                                <CardHeader>
                                    <CardTitle>কৃষকদের পরামর্শের তালিকা</CardTitle>
                                    <CardDescription>
                                        কৃষকদের সমস্যা ও আপনার পরামর্শ পরিচালনা করুন
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {activeConsultations.map((consultation) => (
                                            <div
                                                key={consultation.id}
                                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold">{consultation.farmer}</h3>
                                                        <Badge variant="outline">{consultation.crop}</Badge>
                                                        <Badge className={getPriorityColor(consultation.priority)}>
                                                            {consultation.priority === 'high' ? 'জরুরি' :
                                                                consultation.priority === 'medium' ? 'মাঝারি' : 'সাধারণ'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        সমস্যা: {consultation.issue}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {consultation.time}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        {getStatusIcon(consultation.status)}
                                                        <span className="text-sm">{getStatusText(consultation.status)}</span>
                                                    </div>
                                                    <Button
                                                        variant={consultation.status === 'completed' ? 'outline' : 'default'}
                                                        size="sm"
                                                    >
                                                        {consultation.status === 'completed' ? 'দেখুন' : 'উত্তর দিন'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notifications">
                            <ExpertNotifications />
                        </TabsContent>

                        <TabsContent value="social">
                            <Card>
                                <CardHeader>
                                    <CardTitle>সামাজিক ফিড</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8">
                                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">
                                            সামাজিক ফিড এখানে প্রদর্শিত হবে
                                        </p>
                                        <Button className="mt-4">
                                            পোস্ট করুন
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle>আমার প্রোফাইল</CardTitle>
                                    <CardDescription>
                                        আপনার প্রোফাইল তথ্য দেখুন ও আপডেট করুন
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <Users className="h-8 w-8 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{user?.name || 'কৃষি বিশেষজ্ঞ'}</h3>
                                                    <p className="text-sm text-muted-foreground">কৃষি বিশেষজ্ঞ</p>
                                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="font-medium">বিশেষত্ব</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="secondary">ফসল উৎপাদন</Badge>
                                                    <Badge variant="secondary">মাটি ব্যবস্থাপনা</Badge>
                                                    <Badge variant="secondary">পোকামাকড় নিয়ন্ত্রণ</Badge>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="font-medium">যোগাযোগ</h4>
                                                <p className="text-sm text-muted-foreground">ফোন: ০১৭১২৩৪৫৬৭৮</p>
                                                <p className="text-sm text-muted-foreground">অভিজ্ঞতা: ১৫ বছর</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-medium">দ্রুত পরিসংখ্যান</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                    <p className="text-2xl font-bold text-blue-600">৩৪২</p>
                                                    <p className="text-sm text-muted-foreground">মোট পরামর্শ</p>
                                                </div>
                                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                                    <p className="text-2xl font-bold text-green-600">৯২%</p>
                                                    <p className="text-sm text-muted-foreground">সফলতার হার</p>
                                                </div>
                                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                                    <p className="text-2xl font-bold text-orange-600">২৭৫</p>
                                                    <p className="text-sm text-muted-foreground">সাহায্যপ্রাপ্ত কৃষক</p>
                                                </div>
                                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                                    <p className="text-2xl font-bold text-purple-600">৪.৮</p>
                                                    <p className="text-sm text-muted-foreground">গড় রেটিং</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-2">
                                        <Button asChild>
                                            <Link to="/expert-profile">বিস্তারিত প্রোফাইল দেখুন</Link>
                                        </Button>
                                        <Button variant="outline">প্রোফাইল সম্পাদনা</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="analytics">
                            <Card>
                                <CardHeader>
                                    <CardTitle>বিশ্লেষণ ও রিপোর্ট</CardTitle>
                                    <CardDescription>
                                        আপনার কার্যক্রমের পরিসংখ্যান ও বিশ্লেষণ
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8">
                                        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">
                                            বিশ্লেষণ ডেটা এখানে প্রদর্শিত হবে
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>

                <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
        </NotificationProvider>
    );
};

export default ExpertDashboard;
