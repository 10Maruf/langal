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
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        try {
            const response = await api.get('/notifications');
            if (response.data.success) {
                const mappedNotifications = response.data.data.data.map((n: any) => ({
                    id: n.id.toString(),
                    type: n.notification_type,
                    title: n.title,
                    message: n.message,
                    time: new Date(n.created_at).toLocaleString('bn-BD'),
                    read: n.is_read === 1 || n.is_read === true,
                    relatedEntityId: n.related_entity_id
                }));
                setNotifications(mappedNotifications);

                // Update unread count
                const unread = mappedNotifications.filter((n: NotificationItem) => !n.read).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
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

            await api.post(`/notifications/${id}/read`);
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

            await api.post('/notifications/mark-all-read');
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
