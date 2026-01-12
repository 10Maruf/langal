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
import { useDataOperatorNotifications } from "@/contexts/DataOperatorNotificationContext";
import { getProfilePhotoUrl } from "@/lib/utils";
import {
    UserCheck,
    Bell,
    User,
    LogOut,
    UserPlus,
    AlertTriangle,
    MessageSquareWarning,
    Loader2
} from "lucide-react";
import DataOperatorProfile from "@/components/data-operator/DataOperatorProfile";

const DataOperatorHeader = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useDataOperatorNotifications();
    const [showProfile, setShowProfile] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/data-operator');
    };

    // Get icon based on notification type
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'new_farmer_registration':
            case 'new_expert_registration':
            case 'new_customer_registration':
                return <UserPlus className="h-4 w-4 text-green-600" />;
            case 'post_report':
                return <AlertTriangle className="h-4 w-4 text-red-600" />;
            case 'comment_report':
                return <MessageSquareWarning className="h-4 w-4 text-orange-600" />;
            default:
                return <Bell className="h-4 w-4 text-blue-600" />;
        }
    };

    const handleNotificationClick = async (notification: any) => {
        // Mark as read
        if (!notification.read) {
            await markAsRead(notification.id);
        }

        // Navigate based on type
        if (notification.type === 'new_farmer_registration' ||
            notification.type === 'new_expert_registration' ||
            notification.type === 'new_customer_registration') {
            navigate('/data-operator/profile-verification');
        } else if (notification.type === 'post_report' || notification.type === 'comment_report') {
            navigate('/data-operator/social-feed-reports');
        }
    };

    return (
        <>
            {/* Header */}
            <div className="bg-white shadow-md border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo and Title */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/data-operator-dashboard')}>
                            <div className="relative">
                                <div className="h-12 w-12 rounded-xl overflow-hidden shadow-lg">
                                    <img src="/img/image.png" alt="Data Operator Logo" className="h-full w-full object-cover" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full overflow-hidden shadow-md">
                                    <img src="/img/Asset 3.png" alt="Langol Logo" className="h-full w-full object-cover" />
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
                                        {loading ? (
                                            <Loader2 className="h-5 w-5 text-gray-600 animate-spin" />
                                        ) : (
                                            <Bell className="h-5 w-5 text-gray-600" />
                                        )}
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                                    <div className="flex items-center justify-between px-2">
                                        <DropdownMenuLabel className="font-semibold">নোটিফিকেশন</DropdownMenuLabel>
                                        {unreadCount > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs text-blue-600 h-6"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    markAllAsRead();
                                                }}
                                            >
                                                সব পড়া হয়েছে
                                            </Button>
                                        )}
                                    </div>
                                    <DropdownMenuSeparator />
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            কোনো নোটিফিকেশন নেই
                                        </div>
                                    ) : (
                                        notifications.slice(0, 10).map((notification) => (
                                            <DropdownMenuItem
                                                key={notification.id}
                                                className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50"
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <div className="mt-0.5">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm leading-tight ${!notification.read ? 'font-semibold text-gray-900' : 'font-normal text-gray-700'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <span className="text-xs text-gray-400 mt-1 block">{notification.time}</span>
                                                </div>
                                                {!notification.read && (
                                                    <span className="h-2 w-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                                                )}
                                            </DropdownMenuItem>
                                        ))
                                    )}
                                    {notifications.length > 10 && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-center text-blue-600 font-medium cursor-pointer justify-center"
                                                onClick={() => navigate('/data-operator/notifications')}
                                            >
                                                সব দেখুন ({notifications.length}টি)
                                            </DropdownMenuItem>
                                        </>
                                    )}
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
