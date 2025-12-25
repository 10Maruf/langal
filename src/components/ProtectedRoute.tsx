import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    // Wait for auth check to complete before redirecting
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!requireAuth && isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
