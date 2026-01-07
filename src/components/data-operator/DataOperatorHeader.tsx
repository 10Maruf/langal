import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getProfilePhotoUrl } from "@/lib/utils";
import {
    UserCheck,
    Bell,
    User,
    LogOut
} from "lucide-react";
import DataOperatorProfile from "@/components/data-operator/DataOperatorProfile";

const DataOperatorHeader = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showProfile, setShowProfile] = useState(false);
    const [notifications] = useState([
        { id: 1, message: "৫টি নতুন প্রোফাইল যাচাইয়ের অপেক্ষায়", time: "৫ মিনিট আগে", unread: true },
        { id: 2, message: "২টি ফসল যাচাই সম্পন্ন হয়েছে", time: "১ ঘণ্টা আগে", unread: true },
        { id: 3, message: "৩টি নতুন সোশ্যাল ফিড রিপোর্ট", time: "২ ঘণ্টা আগে", unread: false },
    ]);

    const handleLogout = () => {
        logout();
        navigate('/data-operator');
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <>
            {/* Header */}
            <div className="bg-white shadow-md border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo and Title */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/data-operator-dashboard')}>
                            <div className="relative">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-xl">🌾</span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                                    <UserCheck className="h-3 w-3 text-white" strokeWidth={3} />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">ডাটা অপারেটর ড্যাশবোর্ড</h1>
                                <p className="text-sm text-gray-600">কৃষি তথ্য ব্যবস্থাপনা কেন্দ্র</p>
                            </div>
                        </div>

                        {/* Right side - Notifications and Profile */}
                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Bell className="h-5 w-5 text-gray-600" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <DropdownMenuLabel className="font-semibold">নোটিফিকেশন</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {notifications.map((notification) => (
                                        <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                                            <div className="flex items-start justify-between w-full">
                                                <p className={`text-sm ${notification.unread ? 'font-semibold' : 'font-normal'}`}>
                                                    {notification.message}
                                                </p>
                                                {notification.unread && (
                                                    <span className="h-2 w-2 bg-blue-600 rounded-full mt-1"></span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1">{notification.time}</span>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-center text-blue-600 font-medium cursor-pointer">
                                        সব দেখুন
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Profile Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                                        <Avatar className="h-9 w-9 border-2 border-orange-200">
                                            <AvatarImage src={getProfilePhotoUrl(user?.profilePhoto)} alt={user?.name} />
                                            <AvatarFallback className="bg-orange-100 text-orange-800">
                                                {user?.name?.charAt(0) || 'D'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="text-left hidden md:block">
                                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-600">ডাটা অপারেটর</p>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>আমার অ্যাকাউন্ট</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setShowProfile(true)} className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>প্রোফাইল দেখুন</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>লগ আউট</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Dialog */}
            {showProfile && (
                <DataOperatorProfile
                    open={showProfile}
                    onOpenChange={setShowProfile}
                />
            )}
        </>
    );
};

export default DataOperatorHeader;
