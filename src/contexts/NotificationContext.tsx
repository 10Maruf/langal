import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export interface NotificationItem {
    id: string;
    type: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    relatedEntityId?: string;
}

interface NotificationContextType {
    notifications: NotificationItem[];
    unreadCount: number;
    loading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!isAuthenticated || !user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        setLoading(true);
        try {
            // Add X-User-Id header for debugging/fallback
            const config = {
                headers: {} as any
            };

            // Try to get ID from user object (user_id is DB id, id might be string)
            const userId = user?.user_id || user?.id;
            if (userId) {
                config.headers['X-User-Id'] = userId.toString();
                console.log('Sending X-User-Id header:', userId);
            }

            const response = await api.get('/notifications', config);
            console.log('Notification API Response:', response.data); // Debug log

            if (response.data.success) {
                // Handle both paginated and non-paginated responses
                // Check if data is wrapped in 'data' property (Laravel pagination)
                let rawData = [];
                if (response.data.data && Array.isArray(response.data.data.data)) {
                    rawData = response.data.data.data;
                } else if (Array.isArray(response.data.data)) {
                    rawData = response.data.data;
                } else if (Array.isArray(response.data)) {
                    rawData = response.data;
                }

                console.log('Parsed Raw Data:', rawData);

                if (Array.isArray(rawData)) {
                    const mappedNotifications = rawData.map((n: any) => ({
                        id: (n.notification_id || n.id) ? (n.notification_id || n.id).toString() : Math.random().toString(), // Handle notification_id or id
                        type: n.notification_type || 'system',
                        title: n.title || 'Notification',
                        message: n.message || '',
                        time: n.created_at ? new Date(n.created_at).toLocaleString('bn-BD') : '',
                        read: n.is_read === 1 || n.is_read === true || n.is_read === '1',
                        relatedEntityId: n.related_entity_id
                    }));
                    setNotifications(mappedNotifications);

                    // Update unread count
                    const unread = mappedNotifications.filter((n: NotificationItem) => !n.read).length;
                    setUnreadCount(unread);
                } else {
                    console.error('Unexpected notification data format:', response.data);
                    setNotifications([]);
                }
            }
        } catch (error: any) {
            console.error('Failed to fetch notifications:', error);
            // If 401, token is invalid - clear auth state
            if (error.response?.status === 401) {
                console.log('Token invalid, clearing authentication');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            // Optimistic update
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === id ? { ...notif, read: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

            // Add X-User-Id header for debugging/fallback
            const config = {
                headers: {} as any
            };

            // Try to get ID from user object
            const userId = user?.user_id || user?.id;
            if (userId) {
                config.headers['X-User-Id'] = userId.toString();
            }

            await api.post(`/notifications/${id}/read`, {}, config);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            // Optimistic update
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, read: true }))
            );
            setUnreadCount(0);

            // Add X-User-Id header for debugging/fallback
            const config = {
                headers: {} as any
            };

            // Try to get ID from user object
            const userId = user?.user_id || user?.id;
            if (userId) {
                config.headers['X-User-Id'] = userId.toString();
            }

            await api.post('/notifications/mark-all-read', {}, config);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    // Fetch notifications on mount and when auth changes
    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();

            // Poll every minute
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [isAuthenticated]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            fetchNotifications,
            markAsRead,
            markAllAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
