import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sendExpertHeartbeat } from '@/services/consultationService';

const HEARTBEAT_INTERVAL = 60000; // 1 minute

/**
 * Hook to send periodic heartbeat to server to track expert online status.
 * This should be used in the main App or Layout component for expert users.
 */
export const useExpertHeartbeat = () => {
  const { user, isAuthenticated } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only send heartbeat if user is authenticated and is an expert
    const isExpert = user?.user_type === 'expert';

    if (isAuthenticated && isExpert) {
      // Send initial heartbeat
      sendExpertHeartbeat().catch(console.error);

      // Set up interval for periodic heartbeat
      intervalRef.current = setInterval(() => {
        sendExpertHeartbeat().catch(console.error);
      }, HEARTBEAT_INTERVAL);
    }

    // Cleanup on unmount or when auth state changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, user?.user_type]);

  // Also send heartbeat on visibility change (when user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user?.user_type === 'expert' && isAuthenticated) {
        sendExpertHeartbeat().catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, user?.user_type]);
};

export default useExpertHeartbeat;
