import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
    UserCheck,
    CloudSun,
    BarChart3,
    Shield,
    Bell,
    User,
    LogOut,
    TrendingUp,
    AlertCircle,
    FileText,
    CheckCircle2,
    Clock
} from "lucide-react";
import DataOperatorProfile from "@/components/data-operator/DataOperatorProfile";
import DataOperatorHeader from "@/components/data-operator/DataOperatorHeader";
import { getAssetPath } from "@/lib/utils";

const DataOperatorDashboardNew = () => {
    const navigate = useNavigate();
    const { user, logout, isLoading } = useAuth();
    const [showProfile, setShowProfile] = useState(false);

    // Check user type only (ProtectedRoute handles authentication)
    useEffect(() => {
        if (user && user.type !== 'data_operator') {
            console.warn('Non data-operator user trying to access dashboard:', user.type);
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    // Don't render if no user (ProtectedRoute should handle this, but double check)
    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/data-operator');
    };

    // Dashboard features - 4 main cards
    const features = [
        {
            id: "profile-verification",
            title: "প্রোফাইল যাচাই",
            description: "কৃষকদের প্রোফাইল যাচাই ও অনুমোদন করুন",
            icon: UserCheck,
            bgGradient: "from-blue-500 to-blue-600",
            count: 12,
            countLabel: "অপেক্ষমান",
            route: "/data-operator/profile-verification"
        },
        {
            id: "field-data",
            title: "মাটি পরীক্ষা",
            description: "সেন্সর দিয়ে মাটি পরীক্ষা ও বিশ্লেষণ",
            icon: CloudSun,
            bgGradient: "from-green-500 to-green-600",
            count: 8,
            countLabel: "নতুন পরীক্ষা",
            route: "/data-operator/field-data"
        },
        {
            id: "field-collection",
            title: "ফিল্ড ডেটা সংগ্রহ",
            description: "মাঠ থেকে কৃষকের তথ্য সংগ্রহ করুন",
            icon: FileText,
            bgGradient: "from-amber-500 to-amber-600",
            count: 0,
            countLabel: "আজকের সংগ্রহ",
            route: "/data-operator/field-data-collection"
        },
        {
            id: "statistics",
            title: "পরিসংখ্যান",
            description: "সামগ্রিক পরিসংখ্যান ও ট্রেন্ড বিশ্লেষণ",
            icon: BarChart3,
            bgGradient: "from-teal-500 to-teal-600",
            count: 156,
            countLabel: "মোট কৃষক",
            route: "/data-operator/statistics"
        },
        {
            id: "govt-statistics",
            title: "সরকারি প্রতিবেদন",
            description: "সরকারি রিপোর্ট ও PDF জেনারেশন",
            icon: FileText,
            bgGradient: "from-purple-500 to-purple-600",
            count: 0,
            countLabel: "PDF রিপোর্ট",
            route: "/data-operator/field-data-statistics"
        },
        {
            id: "social-feed-report",
            title: "সোশ্যাল ফিড রিপোর্ট",
            description: "পোস্ট ও কমেন্ট রিপোর্ট পরিচালনা করুন",
            icon: Shield,
            bgGradient: "from-red-500 to-red-600",
            count: 3,
            countLabel: "নতুন রিপোর্ট",
            route: "/data-operator/social-feed-reports"
        }
    ];

    // Quick stats
    const quickStats = [
        {
            label: "আজকের যাচাই",
            value: "18",
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            label: "অপেক্ষমান",
            value: "23",
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50"
        },
        {
            label: "মাসিক লক্ষ্য",
            value: "78%",
            icon: TrendingUp,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            label: "জরুরি",
            value: "5",
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <DataOperatorHeader />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {quickStats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Feature Cards - 4 items - Redesigned for Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={feature.id}
                                className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-0"
                                onClick={() => navigate(feature.route)}
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>

                                <CardContent className="relative p-6">
                                    {/* Icon Circle with Animation */}
                                    <div className="flex items-center justify-center mb-4">
                                        <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="h-10 w-10 text-white" strokeWidth={2.5} />

                                            {/* Pulse ring animation */}
                                            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${feature.bgGradient} opacity-30 animate-ping`}></div>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-center text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-center text-sm text-gray-600 mb-4 line-clamp-2 px-2">
                                        {feature.description}
                                    </p>

                                    {/* Count Badge */}
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r ${feature.bgGradient} text-white font-bold text-2xl shadow-md`}>
                                            {feature.count}
                                        </div>
                                        <p className="text-xs font-medium text-gray-500">{feature.countLabel}</p>
                                    </div>

                                    {/* Hover Arrow Indicator */}
                                    <div className="mt-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className={`text-sm font-semibold bg-gradient-to-r ${feature.bgGradient} bg-clip-text text-transparent flex items-center gap-1`}>
                                            দেখুন
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Bottom Accent Line */}
                                <div className={`h-1 bg-gradient-to-r ${feature.bgGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                            </Card>
                        );
                    })}
                </div>

                {/* Recent Activity Section */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-gray-600" />
                            সাম্প্রতিক কার্যক্রম
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { action: "প্রোফাইল অনুমোদন", name: "মোহাম্মদ করিম", time: "১০ মিনিট আগে", type: "success" },
                                { action: "ফসল যাচাই", name: "আব্দুল হাকিম", time: "৩০ মিনিট আগে", type: "info" },
                                { action: "রিপোর্ট প্রত্যাখ্যান", name: "সোশ্যাল পোস্ট #১২৩৪", time: "১ ঘণ্টা আগে", type: "warning" },
                                { action: "মাঠ তথ্য এন্ট্রি", name: "কুমিল্লা সদর", time: "২ ঘণ্টা আগে", type: "info" },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${activity.type === 'success' ? 'bg-green-500' :
                                                activity.type === 'warning' ? 'bg-yellow-500' :
                                                    'bg-blue-500'
                                            }`}></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                            <p className="text-xs text-gray-600">{activity.name}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Profile Dialog */}
            <DataOperatorProfile open={showProfile} onOpenChange={setShowProfile} />
        </div>
    );
};

export default DataOperatorDashboardNew;
