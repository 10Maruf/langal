import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import IntroAnimation from "@/components/IntroAnimation";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SocialFeed from "./pages/SocialFeed";
import Marketplace from "./pages/Marketplace";
import Diagnosis from "./pages/Diagnosis";
import Recommendation from "./pages/Recommendation";
import NewsFeed from "./pages/NewsFeed";
import WeatherPlanning from "./pages/WeatherPlanning";
import WeatherForecast from "./pages/WeatherForecast";
import Consultation from "./pages/Consultation";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExpertDashboard from "./pages/ExpertDashboard";
import ExpertProfile from "./pages/ExpertProfile";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerProfile from "./pages/CustomerProfile";
import ConsultantDashboard from "./pages/ConsultantDashboard";
import ConsultantProfile from "./pages/ConsultantProfile";
import DataOperatorDashboard from "./pages/DataOperatorDashboard";
import DataOperatorDashboardNew from "./pages/DataOperatorDashboardNew";
import DataOperatorHome from "./pages/DataOperatorHome";
import DataOperatorAuth from "./pages/DataOperatorAuth";
import DataOperatorProfileVerification from "./pages/DataOperatorProfileVerification";
import DataOperatorCropVerification from "./pages/DataOperatorCropVerification";
import DataOperatorRegisterFarmer from "./pages/DataOperatorRegisterFarmer";
import DataOperatorFieldData from "./pages/DataOperatorFieldData";
import DataOperatorReports from "./pages/DataOperatorReports";
import DataOperatorStatistics from "./pages/DataOperatorStatistics";
import SocialFeedReportMng from "./components/data-operator/SocialFeedReportMng";
import MarketPrices from "./pages/MarketPrices";
import AgriculturalNews from "./pages/AgriculturalNews";
import FarmerDashboard from "./pages/FarmerDashboard";
import CentralMarketplace from "./pages/CentralMarketplace";
import TTSDemo from "./pages/TTSDemo";

const queryClient = new QueryClient();

// Get the base path for GitHub Pages
const basename = import.meta.env.PROD ? "/langal-prototype" : "";

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [hasShownIntro, setHasShownIntro] = useState(false);

  useEffect(() => {
    // Check if intro has been shown in this session
    const introShown = sessionStorage.getItem('introShown');
    if (introShown) {
      setShowIntro(false);
      setHasShownIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setHasShownIntro(true);
    sessionStorage.setItem('introShown', 'true');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NotificationProvider>
            <Toaster />
            <Sonner />
            {showIntro && !hasShownIntro && (
              <IntroAnimation onComplete={handleIntroComplete} duration={3500} />
            )}
            <BrowserRouter 
              basename={basename}
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <Routes>
                <Route
                  path="/login"
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Login />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Register />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/social-feed"
                  element={
                    <ProtectedRoute>
                      <SocialFeed />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/marketplace"
                  element={
                    <ProtectedRoute>
                      <Marketplace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/central-marketplace"
                  element={
                    <ProtectedRoute>
                      <CentralMarketplace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/diagnosis"
                  element={
                    <ProtectedRoute>
                      <Diagnosis />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recommendation"
                  element={
                    <ProtectedRoute>
                      <Recommendation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/news-feed"
                  element={
                    <ProtectedRoute>
                      <NewsFeed />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/weather-planning"
                  element={
                    <ProtectedRoute>
                      <WeatherPlanning />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/abhaowa-purbabhas"
                  element={
                    <ProtectedRoute>
                      <WeatherForecast />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consultation"
                  element={
                    <ProtectedRoute>
                      <Consultation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/expert-dashboard"
                  element={
                    <ProtectedRoute>
                      <ExpertDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/expert-profile"
                  element={
                    <ProtectedRoute>
                      <ExpertProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer-dashboard"
                  element={
                    <ProtectedRoute>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer-profile"
                  element={
                    <ProtectedRoute>
                      <CustomerProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consultant-dashboard"
                  element={
                    <ProtectedRoute>
                      <ConsultantDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consultant-profile"
                  element={
                    <ProtectedRoute>
                      <ConsultantProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer-dashboard"
                  element={
                    <ProtectedRoute>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/data-operator"
                  element={<DataOperatorAuth />}
                />
                <Route
                  path="/data-operator/home"
                  element={<DataOperatorHome />}
                />
                <Route
                  path="/data-operator-dashboard"
                  element={<DataOperatorDashboardNew />}
                />
                <Route
                  path="/data-operator-dashboard-old"
                  element={<DataOperatorDashboard />}
                />
                <Route
                  path="/data-operator/profile-verification"
                  element={<DataOperatorProfileVerification />}
                />
                <Route
                  path="/data-operator/crop-verification"
                  element={<DataOperatorCropVerification />}
                />
                <Route
                  path="/data-operator/register-farmer"
                  element={<DataOperatorRegisterFarmer />}
                />
                <Route
                  path="/data-operator/field-data"
                  element={<DataOperatorFieldData />}
                />
                <Route
                  path="/data-operator/reports"
                  element={<DataOperatorReports />}
                />
                <Route
                  path="/data-operator/statistics"
                  element={<DataOperatorStatistics />}
                />
                <Route
                  path="/data-operator/social-feed-reports"
                  element={<SocialFeedReportMng />}
                />
                <Route
                  path="/market-prices"
                  element={
                    <ProtectedRoute>
                      <MarketPrices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agricultural-news"
                  element={
                    <ProtectedRoute>
                      <AgriculturalNews />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tts-demo"
                  element={
                    <ProtectedRoute>
                      <TTSDemo />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
