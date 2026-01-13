import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { DataOperatorNotificationProvider } from "@/contexts/DataOperatorNotificationContext";
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
// Consultation page replaced by ExpertListPage
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
import DataOperatorHome from "./pages/DataOperatorHome";
import DataOperatorAuth from "./pages/DataOperatorAuth";
import DataOperatorProfileVerification from "./pages/DataOperatorProfileVerification";
import DataOperatorCropVerification from "./pages/DataOperatorCropVerification";
import DataOperatorRegisterFarmer from "./pages/DataOperatorRegisterFarmer";
import DataOperatorFieldData from "./pages/DataOperatorFieldData";
import DataOperatorFieldDataCollection from "./pages/DataOperatorFieldDataCollection";
import DataOperatorReports from "./pages/DataOperatorReports";
import DataOperatorStatistics from "./pages/DataOperatorStatisticsNew2";
import FieldDataStatisticsDashboard from "./pages/FieldDataStatisticsDashboard";
import SocialFeedReportMng from "./components/data-operator/SocialFeedReportMng";
// import MarketPrices from "./pages/MarketPrices";
// import AgriculturalNews from "./pages/AgriculturalNews";
import FarmerDashboard from "./pages/FarmerDashboard";
import CentralMarketplace from "./pages/CentralMarketplace";
import TTSDemo from "./pages/TTSDemo";
// Consultation System Pages
import ExpertListPage from "./pages/consultation/ExpertListPage";
import ExpertProfilePage from "./pages/consultation/ExpertProfilePage";
import BookAppointmentPage from "./pages/consultation/BookAppointmentPage";
import MyAppointmentsPage from "./pages/consultation/MyAppointmentsPage";
import AppointmentDetailsPage from "./pages/consultation/AppointmentDetailsPage";
import ChatRoom from "./pages/consultation/ChatRoom";
import VideoCallPage from "./pages/consultation/VideoCallPage";
import FeedbackPage from "./pages/consultation/FeedbackPage";
import PrescriptionPage from "./pages/consultation/PrescriptionPage";
import ViewPrescriptionPage from "./pages/consultation/ViewPrescriptionPage";
import ExpertConsultationDashboard from "./pages/consultation/ExpertConsultationDashboard";
import ExpertAvailabilityPage from "./pages/consultation/ExpertAvailabilityPage";
import { syncOfflineSelections } from "@/services/recommendationService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useExpertHeartbeat } from "@/hooks/useExpertHeartbeat";

const queryClient = new QueryClient();

// Get the base path for GitHub Pages
const basename = "";

const OfflineSyncHandler = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleSync = async () => {
      if (isAuthenticated && navigator.onLine) {
        const syncedCount = await syncOfflineSelections();
        if (syncedCount && syncedCount > 0) {
          toast({
            title: "সিঙ্ক সম্পন্ন",
            description: `${syncedCount}টি অফলাইন ডাটা সার্ভারে সেভ হয়েছে।`,
          });
        }
      }
    };

    handleSync();
    window.addEventListener('online', handleSync);
    return () => window.removeEventListener('online', handleSync);
  }, [isAuthenticated, toast]);

  return null;
};

// Expert heartbeat component - keeps expert online status updated
const ExpertHeartbeatHandler = () => {
  useExpertHeartbeat();
  return null;
};

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
            <DataOperatorNotificationProvider>
              <Toaster />
              <Sonner />
              <OfflineSyncHandler />
              <ExpertHeartbeatHandler />
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
                    element={<Index />}
                  />
                  <Route
                    path="/social-feed"
                    element={
                      <ProtectedRoute allowedTypes={['farmer', 'customer', 'expert']}>
                        <SocialFeed />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/marketplace"
                    element={
                      <ProtectedRoute allowedTypes={['farmer', 'customer']}>
                        <Marketplace />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/central-marketplace"
                    element={
                      <ProtectedRoute allowedTypes={['farmer', 'customer']}>
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
                      <ProtectedRoute allowedTypes={['farmer', 'expert']}>
                        <ExpertListPage />
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
                      <ProtectedRoute allowedTypes={['expert']}>
                        <ExpertDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/expert-profile"
                    element={
                      <ProtectedRoute allowedTypes={['expert']}>
                        <ExpertProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer-dashboard"
                    element={
                      <ProtectedRoute allowedTypes={['customer']}>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer-profile"
                    element={
                      <ProtectedRoute allowedTypes={['customer']}>
                        <CustomerProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultant-dashboard"
                    element={
                      <ProtectedRoute allowedTypes={['expert']}>
                        <ConsultantDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultant-profile"
                    element={
                      <ProtectedRoute allowedTypes={['expert']}>
                        <ConsultantProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/farmer-dashboard"
                    element={
                      <ProtectedRoute allowedTypes={['farmer']}>
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
                    element={
                      <ProtectedRoute allowedTypes={['data_operator']}>
                        <DataOperatorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/data-operator/profile-verification"
                    element={
                      <ProtectedRoute allowedTypes={['data_operator']}>
                        <DataOperatorProfileVerification />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/data-operator/crop-verification"
                    element={
                      <ProtectedRoute allowedTypes={['data_operator']}>
                        <DataOperatorCropVerification />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/data-operator/register-farmer"
                    element={
                      <ProtectedRoute allowedTypes={['data_operator']}>
                        <DataOperatorRegisterFarmer />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/data-operator/field-data"
                    element={
                      <ProtectedRoute allowedTypes={['data_operator']}>
                        <DataOperatorFieldData />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/data-operator/field-data-collection"
                    element={
                      <ProtectedRoute allowedTypes={['data_operator']}>
                        <DataOperatorFieldDataCollection />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/data-operator/reports"
                    element={
                      <ProtectedRoute allowedTypes={['data_operator']}>
                        <DataOperatorReports />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/data-operator/statistics"
                    element={
                      <ProtectedRoute allowedTypes={['data_operator']}>
                        <DataOperatorStatistics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/data-operator/field-data-statistics"
                    element={
                      <ProtectedRoute allowedTypes={['data_operator']}>
                        <FieldDataStatisticsDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/data-operator/social-feed-reports"
                    element={
                      <ProtectedRoute allowedTypes={['data_operator']}>
                        <SocialFeedReportMng />
                      </ProtectedRoute>
                    }
                  />
                  {/* <Route
                    path="/market-prices"
                    element={
                      <ProtectedRoute>
                        <MarketPrices />
                      </ProtectedRoute>
                    }
                  /> */}
                  {/* <Route
                    path="/agricultural-news"
                    element={
                      <ProtectedRoute>
                        <AgriculturalNews />
                      </ProtectedRoute>
                    }
                  /> */}
                  <Route
                    path="/tts-demo"
                    element={
                      <ProtectedRoute>
                        <TTSDemo />
                      </ProtectedRoute>
                    }
                  />
                  {/* Consultation System Routes */}
                  <Route
                    path="/consultation"
                    element={
                      <ProtectedRoute allowedTypes={['farmer', 'expert']}>
                        <ExpertListPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultation/expert/:expertId"
                    element={
                      <ProtectedRoute allowedTypes={['farmer', 'expert']}>
                        <ExpertProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultation/book/:expertId"
                    element={
                      <ProtectedRoute allowedTypes={['farmer', 'expert']}>
                        <BookAppointmentPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultation/appointments"
                    element={
                      <ProtectedRoute allowedTypes={['farmer', 'expert']}>
                        <MyAppointmentsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultation/appointment/:appointmentId"
                    element={
                      <ProtectedRoute allowedTypes={['farmer', 'expert']}>
                        <AppointmentDetailsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultation/chat/:appointmentId"
                    element={
                      <ProtectedRoute allowedTypes={['farmer', 'expert']}>
                        <ChatRoom />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultation/call/:appointmentId"
                    element={
                      <ProtectedRoute allowedTypes={['farmer', 'expert']}>
                        <VideoCallPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultation/feedback/:appointmentId"
                    element={
                      <ProtectedRoute allowedTypes={['farmer', 'expert']}>
                        <FeedbackPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultation/prescription/:appointmentId"
                    element={
                      <ProtectedRoute allowedTypes={['expert']}>
                        <PrescriptionPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultation/prescription/view/:appointmentId"
                    element={
                      <ProtectedRoute allowedTypes={['expert', 'farmer']}>
                        <ViewPrescriptionPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultation/dashboard"
                    element={
                      <ProtectedRoute allowedTypes={['expert']}>
                        <ExpertConsultationDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultation/availability"
                    element={
                      <ProtectedRoute allowedTypes={['expert']}>
                        <ExpertAvailabilityPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </DataOperatorNotificationProvider>
          </NotificationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
