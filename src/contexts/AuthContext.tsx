import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserType = 'farmer' | 'customer' | 'expert' | 'data_operator';

export interface UserLocationInfo {
    village?: string;
    postal_code?: number;
    post_office_bn?: string;
    upazila_bn?: string;
    district_bn?: string;
    division_bn?: string;
}

export interface User {
    id: string;
    user_id?: number; // Database user_id
    name: string;
    type: UserType;
    email: string;
    nidNumber?: string;
    phone?: string;
    profilePhoto?: string;
    location?: string;
    location_info?: UserLocationInfo;
    verificationStatus?: 'pending' | 'approved' | 'rejected';
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, userType: UserType) => Promise<boolean>;
    register: (userData: any, userType: UserType) => Promise<boolean>;
    logout: () => void;
    setAuthUser: (user: User, token: string) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is stored in localStorage
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('auth_token');
        
        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                console.log('AuthContext - Restoring user from localStorage:', parsedUser);
                console.log('AuthContext - User type:', parsedUser.type);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                // Clear corrupted data
                localStorage.removeItem('user');
                localStorage.removeItem('auth_token');
            }
        }
    }, []);

    const setAuthUser = (user: User, token: string) => {
        console.log('AuthContext - Setting auth user:', user);
        console.log('AuthContext - User type being saved:', user.type);
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('auth_token', token);
    };

    const login = async (email: string, password: string, userType: UserType): Promise<boolean> => {
        // Simulate API call - in real app, this would be an actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock successful login
                const mockUser: User = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: userType === 'farmer' ? 'কৃষক' : userType === 'expert' ? 'কৃষি বিশেষজ্ঞ' : 'ক্রেতা',
                    type: userType,
                    email: email,
                    location: userType === 'farmer' ? 'বাংলাদেশ' : userType === 'expert' ? 'কৃষি বিশ্ববিদ্যালয়' : 'ঢাকা'
                };

                setUser(mockUser);
                setIsAuthenticated(true);
                localStorage.setItem('user', JSON.stringify(mockUser));
                resolve(true);
            }, 1000);
        });
    };

    const register = async (userData: any, userType: UserType): Promise<boolean> => {
        // Simulate API call for registration - in real app, this would be an actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock successful registration
                console.log('Registration data:', userData, 'User type:', userType);
                resolve(true);
            }, 1000);
        });
    };

    const logout = () => {
        console.log('AuthContext - Logging out user');
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        // Clear any other stored data
        sessionStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, setAuthUser, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
