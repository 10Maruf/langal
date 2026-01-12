import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
// Import from the correct path (Farmer component)
import LocationSelector, { LocationData as SelectorLocationData } from "@/components/farmer/LocationSelector";

// Interface for the parent component to consume (keeps it simple)
export interface LocationData {
    division?: string;
    division_bn?: string;
    district?: string;
    district_bn?: string;
    upazila?: string;
    upazila_bn?: string;
    post_office?: string;
    post_office_bn?: string;
    postal_code?: string;
}

interface LocationFilterPanelProps {
    onLocationChange: (location: LocationData | null) => void;
    isLoading?: boolean;
}

const LocationFilterPanel = ({ onLocationChange, isLoading = false }: LocationFilterPanelProps) => {
    const [isOpen, setIsOpen] = useState(true);
    
    // State to hold the full object required by LocationSelector
    const [selectorValue, setSelectorValue] = useState<SelectorLocationData | null>(null);

    // Handle updates from LocationSelector
    const handleSelectorChange = (newLocation: SelectorLocationData) => {
        setSelectorValue(newLocation);

        // Convert to the simpler format expected by the Statistics page
        // Include both English and Bangla names
        const simplifiedLocation: LocationData = {
            division: newLocation.division,
            division_bn: newLocation.division_bn,
            district: newLocation.district,
            district_bn: newLocation.district_bn,
            upazila: newLocation.upazila,
            upazila_bn: newLocation.upazila_bn,
            post_office: newLocation.post_office,
            post_office_bn: newLocation.post_office_bn,
            postal_code: newLocation.postal_code?.toString()
        };

        // Notify parent
        if (newLocation.division_bn) {
            onLocationChange(simplifiedLocation);
        } else {
            onLocationChange(null);
        }
    };

    const toggleOpen = () => setIsOpen(!isOpen);

    const formatLocationString = () => {
        if (!selectorValue) return "কোন এলাকা নির্বাচিত হয়নি";
        const parts = [
            selectorValue.division_bn,
            selectorValue.district_bn,
            selectorValue.upazila_bn,
            selectorValue.post_office_bn
        ].filter(Boolean);
        return parts.join(" > ");
    };

    return (
        <Card className="mb-6 border-l-4 border-l-green-500 shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={toggleOpen}>
                    <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-2 rounded-full">
                            <MapPin className="h-5 w-5 text-green-700" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">এলাকা নির্বাচন</h3>
                            <p className="text-xs text-gray-500">
                                {selectorValue ? formatLocationString() : "পরিসংখ্যান দেখতে এলাকা নির্বাচন করুন"}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </div>

                {isOpen && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            {/* Using the existing LocationSelector from farmer components */}
                            <LocationSelector 
                                value={selectorValue}
                                onChange={handleSelectorChange}
                            />
                        </div>

                        {selectorValue && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {selectorValue.division_bn && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        বিভাগ: {selectorValue.division_bn}
                                    </Badge>
                                )}
                                {selectorValue.district_bn && (
                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                        জেলা: {selectorValue.district_bn}
                                    </Badge>
                                )}
                                {selectorValue.upazila_bn && (
                                    <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                                        উপজেলা: {selectorValue.upazila_bn}
                                    </Badge>
                                )}
                                {selectorValue.post_office_bn && (
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                        ডাকঘর: {selectorValue.post_office_bn}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LocationFilterPanel;
