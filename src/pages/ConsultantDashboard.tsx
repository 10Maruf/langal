import { useState } from "react";
import { ConsultantBottomNav } from "@/components/layout/ConsultantBottomNav";
import { Header } from "@/components/layout/Header";
import ConsultantSocialFeed from "./ConsultantSocialFeed";
import ConsultantCrops from "./ConsultantCrops";
import ConsultantDiagnosis from "./ConsultantDiagnosis";
import ConsultantConsultations from "./ConsultantConsultations";
import ConsultantProfile from "./ConsultantProfile";

const ConsultantDashboard = () => {
    const [activeTab, setActiveTab] = useState("feed");
    const [showProfile, setShowProfile] = useState(false);

    const renderContent = () => {
        if (showProfile) {
            return <ConsultantProfile onBack={handleBackFromProfile} />;
        }

        switch (activeTab) {
            case "feed":
                return <ConsultantSocialFeed />;
            case "crops":
                return <ConsultantCrops />;
            case "diagnosis":
                return <ConsultantDiagnosis />;
            case "consultations":
                return <ConsultantConsultations />;
            default:
                return <ConsultantSocialFeed />;
        }
    };

    const handleProfileClick = () => {
        setShowProfile(true);
    };

    const handleBackFromProfile = () => {
        setShowProfile(false);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <Header />

            {/* Content */}
            <div className="pt-14 pb-16">
                {renderContent()}
            </div>

            {/* Bottom Navigation - Hide when showing profile */}
            {!showProfile && (
                <ConsultantBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            )}
        </div>
    );
};

export default ConsultantDashboard;
