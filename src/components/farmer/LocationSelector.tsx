import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { englishToBangla, banglaToEnglish } from "@/lib/banglaUtils";

export interface LocationData {
    division: string;
    division_bn: string;
    district: string;
    district_bn: string;
    upazila: string;
    upazila_bn: string;
    post_office: string;
    post_office_bn: string;
    postal_code: number;
    village: string; // User input in Bangla
}

export interface LocationSelectorProps {
    value: LocationData | null;
    onChange: (location: LocationData) => void;
    onAddressChange?: (fullAddress: string) => void;
}

interface Division {
    division: string;
    division_bn: string;
}

interface District {
    district: string;
    district_bn: string;
}

interface Upazila {
    upazila: string;
    upazila_bn: string;
}

interface PostOffice {
    postal_code: number;
    post_office: string;
    post_office_bn: string;
}

const LocationSelector = ({ value, onChange, onAddressChange }: LocationSelectorProps) => {
    const [mode, setMode] = useState<'postal' | 'manual'>('postal');
    const [isLoading, setIsLoading] = useState(false);
    const [postalCode, setPostalCode] = useState('');

    // Dropdowns data
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [upazilas, setUpazilas] = useState<Upazila[]>([]);
    const [postOffices, setPostOffices] = useState<PostOffice[]>([]);

    // Selected values
    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedUpazila, setSelectedUpazila] = useState('');
    const [selectedPostOffice, setSelectedPostOffice] = useState('');
    const [village, setVillage] = useState('');

    const { toast } = useToast();

    // Load divisions on component mount
    useEffect(() => {
        loadDivisions();
    }, []);

    // Update full address whenever location changes
    useEffect(() => {
        if (value && onAddressChange) {
            const addressParts = [];
            if (value.village) addressParts.push(value.village);
            if (value.post_office_bn) addressParts.push(value.post_office_bn);
            if (value.upazila_bn) addressParts.push(value.upazila_bn);
            if (value.district_bn) addressParts.push(value.district_bn);

            const fullAddress = addressParts.join(', ');
            onAddressChange(fullAddress);
        }
    }, [value, onAddressChange]);

    const loadDivisions = async () => {
        try {
            const response = await api.get('/locations/divisions');
            if (response.data.success) {
                setDivisions(response.data.data);
            }
        } catch (error) {
            console.error('Error loading divisions:', error);
        }
    };

    const loadDistricts = async (divisionBn: string) => {
        try {
            setIsLoading(true);
            const response = await api.get('/locations/districts', {
                params: { division_bn: divisionBn }
            });
            if (response.data.success) {
                setDistricts(response.data.data);
                setUpazilas([]);
                setPostOffices([]);
            }
        } catch (error) {
            console.error('Error loading districts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadUpazilas = async (districtBn: string) => {
        try {
            setIsLoading(true);
            const response = await api.get('/locations/upazilas', {
                params: { district_bn: districtBn }
            });
            if (response.data.success) {
                setUpazilas(response.data.data);
                setPostOffices([]);
            }
        } catch (error) {
            console.error('Error loading upazilas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadPostOffices = async (upazilaBn: string) => {
        try {
            setIsLoading(true);
            const response = await api.get('/locations/post-offices', {
                params: { upazila_bn: upazilaBn }
            });
            if (response.data.success) {
                setPostOffices(response.data.data);
            }
        } catch (error) {
            console.error('Error loading post offices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostalCodeSearch = async () => {
        if (!postalCode || postalCode.length < 4) {
            toast({
                title: "ত্রুটি",
                description: "সঠিক পোস্টাল কোড দিন",
                variant: "destructive",
            });
            return;
        }

        // Convert Bangla numbers to English if needed
        const englishPostalCode = banglaToEnglish(postalCode);

        setIsLoading(true);
        try {
            const response = await api.get('/locations/postal-code', {
                params: { postal_code: englishPostalCode }
            });

            if (response.data.success) {
                const location = response.data.data;
                onChange({
                    division: location.division,
                    division_bn: location.division_bn,
                    district: location.district,
                    district_bn: location.district_bn,
                    upazila: location.upazila,
                    upazila_bn: location.upazila_bn,
                    post_office: location.post_office,
                    post_office_bn: location.post_office_bn,
                    postal_code: location.postal_code,
                    village: village,
                });

                toast({
                    title: "সফল",
                    description: "ঠিকানা পাওয়া গেছে",
                });
            }
        } catch (error: any) {
            toast({
                title: "ত্রুটি",
                description: error.response?.data?.message || "পোস্টাল কোড পাওয়া যায়নি",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDivisionChange = (divisionBn: string) => {
        setSelectedDivision(divisionBn);
        setSelectedDistrict('');
        setSelectedUpazila('');
        setSelectedPostOffice('');

        const division = divisions.find(d => d.division_bn === divisionBn);
        if (division) {
            loadDistricts(divisionBn);
            onChange({
                ...value!,
                division: division.division,
                division_bn: division.division_bn,
            });
        }
    };

    const handleDistrictChange = (districtBn: string) => {
        setSelectedDistrict(districtBn);
        setSelectedUpazila('');
        setSelectedPostOffice('');

        const district = districts.find(d => d.district_bn === districtBn);
        if (district) {
            loadUpazilas(districtBn);
            onChange({
                ...value!,
                district: district.district,
                district_bn: district.district_bn,
            });
        }
    };

    const handleUpazilaChange = (upazilaBn: string) => {
        setSelectedUpazila(upazilaBn);
        setSelectedPostOffice('');

        const upazila = upazilas.find(u => u.upazila_bn === upazilaBn);
        if (upazila) {
            loadPostOffices(upazilaBn);
            onChange({
                ...value!,
                upazila: upazila.upazila,
                upazila_bn: upazila.upazila_bn,
            });
        }
    };

    const handlePostOfficeChange = (postalCodeStr: string) => {
        setSelectedPostOffice(postalCodeStr);

        const postOffice = postOffices.find(p => p.postal_code.toString() === postalCodeStr);
        if (postOffice) {
            onChange({
                ...value!,
                post_office: postOffice.post_office,
                post_office_bn: postOffice.post_office_bn,
                postal_code: postOffice.postal_code,
                village: village,
            });
        }
    };

    const handleVillageChange = (villageValue: string) => {
        setVillage(villageValue);
        if (value) {
            onChange({
                ...value,
                village: villageValue,
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2 border-b pb-2">
                <Button
                    type="button"
                    variant={mode === 'postal' ? 'default' : 'outline'}
                    onClick={() => setMode('postal')}
                    className="flex-1"
                    size="sm"
                >
                    পোস্টাল কোড দিয়ে
                </Button>
                <Button
                    type="button"
                    variant={mode === 'manual' ? 'default' : 'outline'}
                    onClick={() => setMode('manual')}
                    className="flex-1"
                    size="sm"
                >
                    ম্যানুয়াল নির্বাচন
                </Button>
            </div>

            {mode === 'postal' ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="postalCode">পোস্টাল কোড</Label>
                        <div className="flex gap-2">
                            <Input
                                id="postalCode"
                                type="text"
                                placeholder="যেমন: ১০০০ বা 1000"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                            <Button
                                type="button"
                                onClick={handlePostalCodeSearch}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {value && value.division_bn && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-green-800">ঠিকানা পাওয়া গেছে:</span>
                            </div>
                            <div className="text-sm space-y-1 text-green-700">
                                <p>বিভাগ: {value.division_bn}</p>
                                <p>জেলা: {value.district_bn}</p>
                                <p>উপজেলা: {value.upazila_bn}</p>
                                <p>ডাকঘর: {value.post_office_bn} ({englishToBangla(value.postal_code)})</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="village">গ্রামের নাম (বাংলায়)</Label>
                        <Input
                            id="village"
                            type="text"
                            placeholder="যেমন: রামপুর"
                            value={village}
                            onChange={(e) => handleVillageChange(e.target.value)}
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>বিভাগ *</Label>
                        <Select value={selectedDivision} onValueChange={handleDivisionChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                {divisions.map((division) => (
                                    <SelectItem key={division.division} value={division.division_bn}>
                                        {division.division_bn}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedDivision && (
                        <div className="space-y-2">
                            <Label>জেলা *</Label>
                            <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="জেলা নির্বাচন করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map((district) => (
                                        <SelectItem key={district.district} value={district.district_bn}>
                                            {district.district_bn}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {selectedDistrict && (
                        <div className="space-y-2">
                            <Label>উপজেলা *</Label>
                            <Select value={selectedUpazila} onValueChange={handleUpazilaChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="উপজেলা নির্বাচন করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                    {upazilas.map((upazila) => (
                                        <SelectItem key={upazila.upazila} value={upazila.upazila_bn}>
                                            {upazila.upazila_bn}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {selectedUpazila && (
                        <div className="space-y-2">
                            <Label>ডাকঘর (পোস্ট অফিস) *</Label>
                            <Select value={selectedPostOffice} onValueChange={handlePostOfficeChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="ডাকঘর নির্বাচন করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                    {postOffices.map((po) => (
                                        <SelectItem key={po.postal_code} value={po.postal_code.toString()}>
                                            {po.post_office_bn} ({englishToBangla(po.postal_code)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="villageManual">গ্রামের নাম (বাংলায়)</Label>
                        <Input
                            id="villageManual"
                            type="text"
                            placeholder="যেমন: রামপুর"
                            value={village}
                            onChange={(e) => handleVillageChange(e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationSelector;
