import { useState } from "react";
import { cn } from "@/lib/utils";
import { Home, ShoppingCart, TrendingUp, CloudSun } from "lucide-react";

interface CustomerBottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const CustomerBottomNav = ({ activeTab, onTabChange }: CustomerBottomNavProps) => {
    const tabs = [
        { id: "social", label: "ফিড", icon: Home, labelEn: "Feed" },
        { id: "marketplace", label: "বাজার", icon: ShoppingCart, labelEn: "Market" },
        { id: "news", label: "বাজার দর", icon: TrendingUp, labelEn: "Prices" },
        { id: "weather", label: "আবহাওয়া", icon: CloudSun, labelEn: "Weather" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="grid grid-cols-4">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors",
                                isActive
                                    ? "text-primary bg-primary/5"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn(
                                "h-5 w-5 mb-1",
                                isActive && "text-primary"
                            )} />
                            <span className="text-[10px] leading-tight">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
