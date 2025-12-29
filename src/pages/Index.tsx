import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import FarmerDashboard from "./FarmerDashboard";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user type
    if (user) {
      console.log('Index.tsx - Current user:', user);
      console.log('Index.tsx - User type:', user.type);
      
      switch (user.type) {
        case 'data_operator':
          navigate('/data-operator-dashboard');
          break;
        case 'expert':
          navigate('/consultant-dashboard');
          break;
        case 'customer':
          navigate('/customer-dashboard');
          break;
        case 'farmer':
          navigate('/farmer-dashboard');
          break;
        default:
          console.warn('Unknown user type:', user.type);
          break;
      }
    }
  }, [user, navigate]);

  // Show loading or nothing while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
      </div>
    </div>
  );
};

export default Index;
