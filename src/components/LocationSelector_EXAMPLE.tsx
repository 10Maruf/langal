/**
 * React Component Example for Location Selection with Bangla Support
 * Place this in: src/components/LocationSelector.tsx
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/services/api';

interface Location {
    postal_code: number;
    post_office: string;
    upazila: string;
    district: string;
    division: string;
}

interface LocationOption {
    value: string;
    label: string;
}

interface LocationSelectorProps {
    language?: 'en' | 'bn';
    onLocationChange?: (location: Partial<Location>) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
    language = 'bn',
    onLocationChange
}) => {
    const [divisions, setDivisions] = useState<LocationOption[]>([]);
    const [districts, setDistricts] = useState<LocationOption[]>([]);
    const [upazilas, setUpazilas] = useState<LocationOption[]>([]);

    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedUpazila, setSelectedUpazila] = useState('');

    const API_BASE = `${API_URL}/locations`;

    // Load divisions on mount
    useEffect(() => {
        loadDivisions();
    }, [language]);

    const loadDivisions = async () => {
        try {
            const response = await axios.get(`${API_BASE}/divisions?lang=${language}`);
            if (response.data.success) {
                const divisionOptions = response.data.data.map((div: string) => ({
                    value: div,
                    label: div
                }));
                setDivisions(divisionOptions);
            }
        } catch (error) {
            console.error('Error loading divisions:', error);
        }
    };

    const loadDistricts = async (division: string) => {
        try {
            const response = await axios.get(
                `${API_BASE}/districts/${division}?lang=${language}`
            );
            if (response.data.success) {
                setDistricts(response.data.data);
            }
        } catch (error) {
            console.error('Error loading districts:', error);
        }
    };

    const loadUpazilas = async (district: string) => {
        try {
            const response = await axios.get(
                `${API_BASE}/upazilas/${district}?lang=${language}`
            );
            if (response.data.success) {
                setUpazilas(response.data.data);
            }
        } catch (error) {
            console.error('Error loading upazilas:', error);
        }
    };

    const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const division = e.target.value;
        setSelectedDivision(division);
        setSelectedDistrict('');
        setSelectedUpazila('');
        setDistricts([]);
        setUpazilas([]);

        if (division) {
            loadDistricts(division);
        }

        onLocationChange?.({ division });
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const district = e.target.value;
        setSelectedDistrict(district);
        setSelectedUpazila('');
        setUpazilas([]);

        if (district) {
            loadUpazilas(district);
        }

        onLocationChange?.({
            division: selectedDivision,
            district
        });
    };

    const handleUpazilaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const upazila = e.target.value;
        setSelectedUpazila(upazila);

        onLocationChange?.({
            division: selectedDivision,
            district: selectedDistrict,
            upazila
        });
    };

    const labels = language === 'bn' ? {
        division: 'বিভাগ',
        district: 'জেলা',
        upazila: 'উপজেলা',
        select: 'নির্বাচন করুন'
    } : {
        division: 'Division',
        district: 'District',
        upazila: 'Upazila',
        select: 'Select'
    };

    return (
        <div className="space-y-4">
            {/* Division Selector */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    {labels.division}
                </label>
                <select
                    value={selectedDivision}
                    onChange={handleDivisionChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                    <option value="">{labels.select} {labels.division}</option>
                    {divisions.map((div) => (
                        <option key={div.value} value={div.value}>
                            {div.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* District Selector */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    {labels.district}
                </label>
                <select
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    disabled={!selectedDivision}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                >
                    <option value="">{labels.select} {labels.district}</option>
                    {districts.map((dist) => (
                        <option key={dist.value} value={dist.value}>
                            {dist.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Upazila Selector */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    {labels.upazila}
                </label>
                <select
                    value={selectedUpazila}
                    onChange={handleUpazilaChange}
                    disabled={!selectedDistrict}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                >
                    <option value="">{labels.select} {labels.upazila}</option>
                    {upazilas.map((upazila) => (
                        <option key={upazila.value} value={upazila.value}>
                            {upazila.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

/**
 * Usage Example:
 * 
 * import { LocationSelector } from '@/components/LocationSelector';
 * 
 * function MyComponent() {
 *   const handleLocationChange = (location) => {
 *     console.log('Selected location:', location);
 *   };
 * 
 *   return (
 *     <LocationSelector 
 *       language="bn"  // or "en"
 *       onLocationChange={handleLocationChange}
 *     />
 *   );
 * }
 */


/**
 * Alternative: Postal Code Search Component
 */

export const PostalCodeSearch: React.FC<{ language?: 'en' | 'bn' }> = ({
    language = 'bn'
}) => {
    const [postalCode, setPostalCode] = useState('');
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState('');

    const searchLocation = async () => {
        if (!postalCode) return;

        try {
            const response = await axios.get(
                `${API_URL}/locations/postal/${postalCode}?lang=${language}`
            );

            if (response.data.success) {
                setLocation(response.data.data);
                setError('');
            }
        } catch (err) {
            setError(language === 'bn' ? 'লোকেশন খুঁজে পাওয়া যায়নি' : 'Location not found');
            setLocation(null);
        }
    };

    const labels = language === 'bn' ? {
        postalCode: 'পোস্টাল কোড',
        search: 'খুঁজুন',
        postOffice: 'পোস্ট অফিস',
        upazila: 'উপজেলা',
        district: 'জেলা',
        division: 'বিভাগ'
    } : {
        postalCode: 'Postal Code',
        search: 'Search',
        postOffice: 'Post Office',
        upazila: 'Upazila',
        district: 'District',
        division: 'Division'
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder={labels.postalCode}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                    onClick={searchLocation}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    {labels.search}
                </button>
            </div>

            {error && (
                <div className="text-red-600 text-sm">{error}</div>
            )}

            {location && (
                <div className="p-4 bg-gray-50 rounded-md space-y-2">
                    <p><strong>{labels.postOffice}:</strong> {location.post_office}</p>
                    <p><strong>{labels.upazila}:</strong> {location.upazila}</p>
                    <p><strong>{labels.district}:</strong> {location.district}</p>
                    <p><strong>{labels.division}:</strong> {location.division}</p>
                </div>
            )}
        </div>
    );
};
