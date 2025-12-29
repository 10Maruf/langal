import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, LogOut, CheckCircle, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAssetPath } from "@/lib/utils";

// API Base URL for images (derive from VITE_API_BASE, strip trailing /api)
const RAW_API = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env?.VITE_API_BASE || 'http://127.0.0.1:8000/api';
const API_BASE_URL = RAW_API.replace(/\/?api\/?$/, '');

// Profile photo URL helper
const getProfilePhotoUrl = (photoPath: string | undefined): string | undefined => {
  if (!photoPath) return undefined;
  // If already a full URL, return as is
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }
  // Otherwise, prepend API base URL
  return `${API_BASE_URL}${photoPath.startsWith('/') ? '' : '/'}${photoPath}`;
};

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  // Get notifications for all authenticated users
  let unreadCount = 0;
  let notifications: any[] = [];
  let markAsRead: ((id: number) => void) | undefined;

  if (isAuthenticated) {
    try {
      const notificationContext = useNotifications();
      unreadCount = notificationContext.unreadCount;
      notifications = notificationContext.notifications;
      markAsRead = notificationContext.markAsRead;
    } catch (error) {
      // NotificationContext not available
      unreadCount = 0;
      notifications = [];
    }
  }

  const handleLogout = () => {
    logout();
  };

  const getProfileLink = () => {
    if (!user) return "/profile";
    switch (user.type) {
      case 'expert':
        return '/expert-profile';
      case 'customer':
        return '/customer-profile';
      case 'farmer':
      default:
        return '/profile';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img src={getAssetPath("/img/Asset 3.png")} alt="logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold text-primary">লাঙল</h1>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {isAuthenticated && (
            <>
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>

              {/* Notification Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>নোটিফিকেশন</span>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {unreadCount} নতুন
                      </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        কোন নোটিফিকেশন নেই
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? 'bg-blue-50 hover:bg-blue-100' : ''
                            }`}
                          onClick={() => markAsRead && markAsRead(notification.id)}
                        >
                          <div className="font-medium text-sm mb-1">{notification.title}</div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {notification.time}
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                  {notifications.length > 10 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-center text-xs text-primary">
                        আরও দেখুন...
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8 rounded-full relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={getProfilePhotoUrl(user?.profilePhoto)}
                      alt={user?.name || 'Profile'}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {user?.verificationStatus === 'approved' && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full p-0.5 ring-2 ring-background">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {user?.verificationStatus === 'pending' && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-yellow-500 rounded-full p-0.5 ring-2 ring-background">
                      <Clock className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {user?.verificationStatus === 'rejected' && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-red-500 rounded-full p-0.5 ring-2 ring-background">
                      <XCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.name}
                  <div className="text-xs text-muted-foreground">
                    {user?.type === 'farmer' ? 'কৃষক' :
                      user?.type === 'expert' ? 'কৃষি বিশেষজ্ঞ' :
                        user?.type === 'customer' ? 'ক্রেতা' : ''}
                  </div>
                  {user?.verificationStatus && (
                    <div className="mt-1">
                      {user.verificationStatus === 'approved' && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          যাচাইকৃত
                        </Badge>
                      )}
                      {user.verificationStatus === 'pending' && (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">
                          <Clock className="mr-1 h-3 w-3" />
                          যাচাই মুলতবি
                        </Badge>
                      )}
                      {user.verificationStatus === 'rejected' && (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">
                          <XCircle className="mr-1 h-3 w-3" />
                          প্রত্যাখ্যাত
                        </Badge>
                      )}
                    </div>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={getProfileLink()}>প্রোফাইল</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  লগআউট
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link to="/login">লগইন</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};