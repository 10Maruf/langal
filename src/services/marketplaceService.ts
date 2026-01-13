// Central Marketplace Service - Similar to socialFeedService

import { MarketplaceListing, ListingAuthor, ListingFilter } from "@/types/marketplace";
import { getAzureImageUrl } from "@/lib/utils";

// Import marketplace images
import powerTillerImg from "@/assets/marketplace/power tiller.png";
import riceSeedImg from "@/assets/marketplace/rice seed.png";
import ureaFertilizerImg from "@/assets/marketplace/urea-fertilizer.png";
import ureaImg from "@/assets/marketplace/Urea.png";
import wheatGrainsImg from "@/assets/marketplace/wheat grains.png";
import harvesterImg from "@/assets/marketplace/harvester.png";
import tractorImg from "@/assets/marketplace/tractor.png";
import pumpImg from "@/assets/marketplace/pump.png";
import compostImg from "@/assets/marketplace/compost.png";
import potatoImg from "@/assets/marketplace/potato.png";

type ApiResponse<T> = { success: boolean; data?: T; message?: string; errors?: unknown };
type Pagination<T> = { data: T[]; current_page: number; per_page: number; total: number } & Record<string, unknown>;
type DbListing = {
    listing_id?: number | string;
    id?: number | string;
    seller_id?: number;
    seller?: { 
        user_id?: number; 
        phone?: string; 
        email?: string; 
        is_verified?: boolean; 
        user_type?: string;
        profile?: {
            full_name?: string;
            profile_photo_url?: string;
            address?: string;
            postal_code?: number;
        }
    };
    // Transformed seller info from backend
    seller_info?: {
        user_id?: number;
        name?: string;
        avatar?: string;
        phone?: string;
        district?: string;
        upazila?: string;
        post_office?: string;
        verified?: boolean;
        user_type?: string;
    };
    category_id?: number;
    category?: string;
    category_slug?: string;
    category_name?: string;
    category_name_bn?: string;
    listing_type_bn?: string;
    title?: string;
    description?: string;
    price?: number | string;
    currency?: string;
    status?: string;
    listing_type?: string;
    type?: string;
    location?: string;
    full_location_bn?: string;
    location_details?: {
        postal_code?: number;
        district?: string;
        upazila?: string;
        division?: string;
        village?: string;
    };
    contact_phone?: string;
    tags?: string[];
    images?: string[];
    created_at?: string;
    updated_at?: string;
    featured?: boolean;
    views_count?: number;
    views?: number;
    saves_count?: number;
    saves?: number;
    contacts_count?: number;
    contacts?: number;
    is_saved?: boolean;
};

import { API_URL } from './api';

class MarketplaceService {
    private listings: MarketplaceListing[] = [];
    private initialized = false;
    private API_BASE: string;

    constructor() {
        this.API_BASE = API_URL;
    }

    private async fetchJSON<T>(path: string, options?: RequestInit): Promise<T | null> {
        try {
            const token = localStorage.getItem('auth_token');
            const headers: HeadersInit = { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            console.log(`[MarketplaceService] Fetching: ${this.API_BASE}${path}`, { 
                method: options?.method || 'GET',
                hasToken: !!token 
            });
            
            const res = await fetch(`${this.API_BASE}${path}`, {
                headers,
                ...options,
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error(`[MarketplaceService] API Error (${res.status}):`, errorText);
                return null;
            }
            
            const jsonData = await res.json();
            console.log(`[MarketplaceService] API Success:`, jsonData);
            return jsonData;
        } catch (e) {
            console.error('[MarketplaceService] Fetch error:', e);
            return null;
        }
    }

    // Map DB listing shape to UI MarketplaceListing
    private mapDbListingToUi(db: DbListing): MarketplaceListing {
        const asCategory = (val: unknown): MarketplaceListing['category'] => {
            const allowed = new Set(['crops','machinery','fertilizer','seeds','livestock','tools','other']);
            const v = String(val || '').toLowerCase();
            return (allowed.has(v) ? (v as MarketplaceListing['category']) : 'other');
        };
        const asType = (val: unknown): MarketplaceListing['type'] => {
            const allowed = new Set(['sell','rent','buy','service']);
            const v = String(val || '').toLowerCase();
            return (allowed.has(v) ? (v as MarketplaceListing['type']) : 'sell');
        };
        const asStatus = (val: unknown): MarketplaceListing['status'] => {
            const allowed = new Set(['active','sold','expired','draft']);
            const v = String(val || '').toLowerCase();
            return (allowed.has(v) ? (v as MarketplaceListing['status']) : 'active');
        };
        return {
            id: String(db.listing_id ?? db.id ?? Date.now()),
            author: {
                // Use seller_info from backend transformation first, then fallback to seller.profile
                name: db.seller_info?.name || db.seller?.profile?.full_name || db.seller?.phone || `ব্যবহারকারী #${db.seller_id ?? 'N/A'}`,
                avatar: db.seller_info?.avatar || db.seller?.profile?.profile_photo_url || '/placeholder.svg',
                location: db.location || db.seller_info?.district || db.seller?.profile?.address || 'অজানা',
                verified: db.seller_info?.verified ?? db.seller?.is_verified ?? false,
                rating: undefined,
                userType: (db.seller_info?.user_type || db.seller?.user_type) as 'farmer' | 'customer' | 'expert' || 'farmer',
            },
            title: db.title ?? 'Untitled',
            description: db.description ?? '',
            price: Number(db.price ?? 0),
            currency: db.currency || 'BDT',
            // Use category_name_bn from backend or fallback
            category: asCategory(db.category_slug || db.category || 'other'),
            categoryNameBn: db.category_name_bn,
            type: asType(db.listing_type || db.type || 'sell'),
            listingTypeBn: db.listing_type_bn,
            status: asStatus(db.status || 'active'),
            images: Array.isArray(db.images) 
                ? db.images.map(img => {
                    // Use getAzureImageUrl to convert any localhost/relative URLs to Azure URLs
                    const azureUrl = getAzureImageUrl(img);
                    if (azureUrl) return azureUrl;
                    
                    // Fallback: if image is already a full URL, return as-is
                    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) {
                        return img;
                    }
                    // Otherwise, construct the Azure URL
                    return `https://langal.blob.core.windows.net/public/${img}`;
                  })
                : [],
            tags: Array.isArray(db.tags) ? db.tags : [],
            location: db.location || db.full_location_bn || 
                (db.location_details ? `${db.location_details.upazila || ''}, ${db.location_details.district || ''}`.replace(/^, |, $/g, '') : '') ||
                (db.seller_info ? `${db.seller_info.upazila || ''}, ${db.seller_info.district || ''}`.replace(/^, |, $/g, '') : '') ||
                '',
            contactInfo: db.contact_phone ? { phone: db.contact_phone } : undefined,
            createdAt: db.created_at || new Date().toISOString(),
            updatedAt: db.updated_at || new Date().toISOString(),
            featured: Boolean(db.featured),
            views: Number(db.views_count ?? db.views ?? 0),
            saves: Number(db.saves_count ?? db.saves ?? 0),
            contacts: Number(db.contacts_count ?? db.contacts ?? 0),
            isOwnListing: false,
            isSaved: Boolean(db.is_saved),
            // Preserve location details for edit functionality
            postal_code: db.location_details?.postal_code,
            village: db.location_details?.village,
        };
    }

    initializeDummyData() {
        if (this.initialized) return;

        this.listings = [
            {
                id: "1",
                author: {
                    name: "করিম মিয়া",
                    avatar: "/placeholder.svg",
                    location: "নোয়াখালী",
                    verified: true,
                    rating: 4.8,
                    userType: "farmer"
                },
                title: "পাওয়ার টিলার (ভাল অবস্থায়)",
                description: "৮ হর্স পাওয়ার পাওয়ার টিলার। চলমান অবস্থায় আছে। খুব কম ব্যবহার হয়েছে। যেকোনো ধরনের চাষাবাদের জন্য উপযুক্ত।",
                price: 1500,
                currency: "BDT",
                category: "machinery",
                type: "rent",
                status: "active",
                images: [powerTillerImg],
                tags: ["পাওয়ার টিলার", "ভাড়া", "চাষাবাদ"],
                location: "নোয়াখালী",
                contactInfo: {
                    phone: "01712-345678"
                },
                createdAt: "2024-01-15T10:00:00Z",
                updatedAt: "2024-01-15T10:00:00Z",
                featured: true,
                views: 45,
                saves: 12,
                contacts: 8
            },
            {
                id: "2",
                author: {
                    name: "রহিম উদ্দিন",
                    avatar: "/placeholder.svg",
                    location: "কুমিল্লা",
                    verified: false,
                    rating: 4.5,
                    userType: "farmer"
                },
                title: "তাজা ধান বিক্রয়",
                description: "এই বছরের নতুন ধান। ভাল মানের BRRI-28 জাত। প্রতি কেজি ২৮ টাকা।",
                price: 28,
                currency: "BDT",
                category: "crops",
                type: "sell",
                status: "active",
                images: [riceSeedImg],
                tags: ["ধান", "BRRI-28", "নতুন"],
                location: "কুমিল্লা",
                contactInfo: {
                    phone: "01812-567890"
                },
                createdAt: "2024-01-14T14:30:00Z",
                updatedAt: "2024-01-14T14:30:00Z",
                views: 32,
                saves: 7,
                contacts: 15
            },
            {
                id: "3",
                author: {
                    name: "আবদুল কাদের",
                    avatar: "/placeholder.svg",
                    location: "ফেনী",
                    verified: true,
                    rating: 4.9,
                    userType: "farmer"
                },
                title: "ইউরিয়া সার (৫০ কেজি)",
                description: "সরকারি দোকান থেকে কেনা ইউরিয়া সার। অতিরিক্ত পড়ে গেছে তাই বিক্রি করছি।",
                price: 950,
                currency: "BDT",
                category: "fertilizer",
                type: "sell",
                status: "active",
                images: [ureaFertilizerImg],
                tags: ["ইউরিয়া", "সার", "৫০কেজি"],
                location: "ফেনী",
                contactInfo: {
                    phone: "01912-345678"
                },
                createdAt: "2024-01-13T09:15:00Z",
                updatedAt: "2024-01-13T09:15:00Z",
                views: 28,
                saves: 5,
                contacts: 12
            },
            {
                id: "4",
                author: {
                    name: "নুরুল ইসলাম",
                    avatar: "/placeholder.svg",
                    location: "রাজশাহী",
                    verified: true,
                    rating: 4.7,
                    userType: "farmer"
                },
                title: "গমের বীজ (উন্নত জাত)",
                description: "BARI গম-৩০ জাত। অংকুরোদগম হার ৯৫%+। সম্পূর্ণ বিশুদ্ধ বীজ।",
                price: 45,
                currency: "BDT",
                category: "seeds",
                type: "sell",
                status: "active",
                images: [wheatGrainsImg],
                tags: ["গম", "বীজ", "BARI-30"],
                location: "রাজশাহী",
                contactInfo: {
                    phone: "01712-987654"
                },
                createdAt: "2024-01-12T16:45:00Z",
                updatedAt: "2024-01-12T16:45:00Z",
                views: 38,
                saves: 9,
                contacts: 6
            },
            {
                id: "5",
                author: {
                    name: "আকবর আলী",
                    avatar: "/placeholder.svg",
                    location: "বগুড়া",
                    verified: true,
                    rating: 4.6,
                    userType: "farmer"
                },
                title: "হার্ভেস্টার মেশিন ভাড়া",
                description: "দ্রুত ধান কাটার জন্য হার্ভেস্টার মেশিন। অভিজ্ঞ অপারেটর সহ।",
                price: 3500,
                currency: "BDT",
                category: "machinery",
                type: "rent",
                status: "active",
                images: [harvesterImg],
                tags: ["হার্ভেস্টার", "ধান কাটা", "ভাড়া"],
                location: "বগুড়া",
                contactInfo: {
                    phone: "01612-345678"
                },
                createdAt: "2024-01-11T11:20:00Z",
                updatedAt: "2024-01-11T11:20:00Z",
                views: 52,
                saves: 18,
                contacts: 22
            },
            {
                id: "6",
                author: {
                    name: "শফিক উল্লাহ",
                    avatar: "/placeholder.svg",
                    location: "যশোর",
                    verified: true,
                    rating: 4.9,
                    userType: "farmer"
                },
                title: "ট্রাক্টর ভাড়া (৭৫ এইচপি)",
                description: "মাহিন্দ্রা ট্রাক্টর ৭৫ এইচপি। চাষাবাদ, পরিবহন সব কাজের জন্য উপযুক্ত। অভিজ্ঞ চালক সহ।",
                price: 2800,
                currency: "BDT",
                category: "machinery",
                type: "rent",
                status: "active",
                images: [tractorImg],
                tags: ["ট্রাক্টর", "৭৫এইচপি", "ভাড়া", "চাষাবাদ"],
                location: "যশোর",
                contactInfo: {
                    phone: "01715-456789"
                },
                createdAt: "2024-01-10T08:30:00Z",
                updatedAt: "2024-01-10T08:30:00Z",
                views: 67,
                saves: 23,
                contacts: 31
            },
            {
                id: "7",
                author: {
                    name: "রফিকুল ইসলাম",
                    avatar: "/placeholder.svg",
                    location: "রংপুর",
                    verified: false,
                    rating: 4.4,
                    userType: "farmer"
                },
                title: "সাবমার্সিবল পাম্প বিক্রয়",
                description: "৩ ইঞ্চি সাবমার্সিবল পাম্প। ১ বছরের ওয়ারেন্টি সহ। ১০০ ফুট পর্যন্ত পানি তুলতে পারে।",
                price: 8500,
                currency: "BDT",
                category: "machinery",
                type: "sell",
                status: "active",
                images: [pumpImg],
                tags: ["পাম্প", "সাবমার্সিবল", "সেচ"],
                location: "রংপুর",
                contactInfo: {
                    phone: "01818-765432"
                },
                createdAt: "2024-01-09T15:45:00Z",
                updatedAt: "2024-01-09T15:45:00Z",
                views: 34,
                saves: 11,
                contacts: 9
            },
            {
                id: "8",
                author: {
                    name: "হাবিবুর রহমান",
                    avatar: "/placeholder.svg",
                    location: "সিলেট",
                    verified: true,
                    rating: 4.7,
                    userType: "farmer"
                },
                title: "জৈব কম্পোস্ট সার",
                description: "গোবর ও খড় দিয়ে তৈরি জৈব কম্পোস্ট। সম্পূর্ণ প্রাকৃতিক। মাটির উর্বরতা বৃদ্ধি করে।",
                price: 15,
                currency: "BDT",
                category: "fertilizer",
                type: "sell",
                status: "active",
                images: [compostImg],
                tags: ["কম্পোস্ট", "জৈব সার", "প্রাকৃতিক"],
                location: "সিলেট",
                contactInfo: {
                    phone: "01912-654321"
                },
                createdAt: "2024-01-08T12:15:00Z",
                updatedAt: "2024-01-08T12:15:00Z",
                views: 29,
                saves: 8,
                contacts: 14
            },
            {
                id: "9",
                author: {
                    name: "আলমগীর হোসেন",
                    avatar: "/placeholder.svg",
                    location: "বরিশাল",
                    verified: true,
                    rating: 4.6,
                    userType: "farmer"
                },
                title: "তাজা আলু বিক্রয়",
                description: "দেশী জাতের আলু। এই সপ্তাহে তোলা। প্রতি কেজি ২৫ টাকা। পাইকারি দরেও পাওয়া যাবে।",
                price: 25,
                currency: "BDT",
                category: "crops",
                type: "sell",
                status: "active",
                images: [potatoImg],
                tags: ["আলু", "তাজা", "দেশী"],
                location: "বরিশাল",
                contactInfo: {
                    phone: "01612-987654"
                },
                createdAt: "2024-01-07T10:00:00Z",
                updatedAt: "2024-01-07T10:00:00Z",
                views: 41,
                saves: 16,
                contacts: 28
            },
            {
                id: "10",
                author: {
                    name: "মোস্তফা কামাল",
                    avatar: "/placeholder.svg",
                    location: "কুষ্টিয়া",
                    verified: false,
                    rating: 4.5,
                    userType: "farmer"
                },
                title: "ইউরিয়া সার (২৫ কেজি ব্যাগ)",
                description: "ব্র্যান্ডেড ইউরিয়া সার। নতুন স্টক। ফসলের জন্য অত্যন্ত কার্যকর। ছোট চাষিদের জন্য সুবিধাজনক প্যাকেট।",
                price: 480,
                currency: "BDT",
                category: "fertilizer",
                type: "sell",
                status: "active",
                images: [ureaImg],
                tags: ["ইউরিয়া", "সার", "২৫কেজি", "ব্র্যান্ডেড"],
                location: "কুষ্টিয়া",
                contactInfo: {
                    phone: "01715-123456"
                },
                createdAt: "2024-01-06T14:20:00Z",
                updatedAt: "2024-01-06T14:20:00Z",
                views: 33,
                saves: 7,
                contacts: 11
            }
        ];

        this.initialized = true;
    }

    // Get listings with optional filtering
    async getListings(filter?: Partial<ListingFilter>, userType?: string, userLocation?: { village?: string; postal_code?: number; upazila_bn?: string; district_bn?: string; division_bn?: string }, userId?: number): Promise<MarketplaceListing[]> {
        // Try backend first
        const params = new URLSearchParams();
        if (filter?.search) params.set('search', filter.search);
        if (filter?.categoryId) params.set('category_id', String(filter.categoryId));
        if (filter?.type && filter.type !== 'all') params.set('type', filter.type);
        if (filter?.division && filter.division !== 'all') params.set('division', filter.division);
        if (filter?.district && filter.district !== 'all') params.set('district', filter.district);
        if (filter?.upazila && filter.upazila !== 'all') params.set('upazila', filter.upazila);
        if (filter?.status && filter.status !== 'all') params.set('status', filter.status);
        if (filter?.sortBy) params.set('sortBy', filter.sortBy);
        // Pass user_id for is_saved check
        if (userId) params.set('user_id', String(userId));
        // Pass user's full location for proximity-based priority sorting
        if (userLocation?.village) params.set('user_village', userLocation.village);
        if (userLocation?.postal_code) params.set('user_postal_code', String(userLocation.postal_code));
        if (userLocation?.upazila_bn) params.set('user_upazila', userLocation.upazila_bn);
        if (userLocation?.district_bn) params.set('user_district', userLocation.district_bn);
        if (userLocation?.division_bn) params.set('user_division', userLocation.division_bn);

        const apiRes = await this.fetchJSON<ApiResponse<Pagination<DbListing> | DbListing[]>>(`/marketplace?${params.toString()}`);
        if (apiRes && apiRes.success && apiRes.data) {
            const payload = apiRes.data as Pagination<DbListing> | DbListing[];
            const items = Array.isArray((payload as Pagination<DbListing>).data)
                ? (payload as Pagination<DbListing>).data
                : (payload as DbListing[]);
            // Return API data - even if empty, don't fallback to dummy
            return items.map((db) => this.mapDbListingToUi(db));
        }

        // Only fallback to local dummy if API completely fails (network error, etc.)
        console.log('API failed, using dummy data fallback');
        if (!this.initialized) this.initializeDummyData();
        let filtered = [...this.listings];
        if (filter) {
            if (filter.search) {
                filtered = filtered.filter(listing =>
                    listing.title.toLowerCase().includes(filter.search!.toLowerCase()) ||
                    listing.description.toLowerCase().includes(filter.search!.toLowerCase()) ||
                    listing.tags.some(tag => tag.toLowerCase().includes(filter.search!.toLowerCase()))
                );
            }
            if (filter.category && filter.category !== 'all') {
                filtered = filtered.filter(listing => listing.category === filter.category);
            }
            if (filter.type && filter.type !== 'all') {
                filtered = filtered.filter(listing => listing.type === filter.type);
            }
            // Location filtering - check division, district, upazila
            if (filter.division && filter.division !== 'all') {
                filtered = filtered.filter(listing => 
                    listing.location.includes(filter.division!) || 
                    listing.author.location.includes(filter.division!)
                );
            }
            if (filter.district && filter.district !== 'all') {
                filtered = filtered.filter(listing => 
                    listing.location.includes(filter.district!) || 
                    listing.author.location.includes(filter.district!)
                );
            }
            if (filter.upazila && filter.upazila !== 'all') {
                filtered = filtered.filter(listing => 
                    listing.location.includes(filter.upazila!) || 
                    listing.author.location.includes(filter.upazila!)
                );
            }
            if (filter.status && filter.status !== 'all') {
                filtered = filtered.filter(listing => listing.status === filter.status);
            }
            if (filter.sortBy) {
                switch (filter.sortBy) {
                    case 'newest':
                        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                        break;
                    case 'oldest':
                        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                        break;
                    case 'price_low':
                        filtered.sort((a, b) => a.price - b.price);
                        break;
                    case 'price_high':
                        filtered.sort((a, b) => b.price - a.price);
                        break;
                    case 'popular':
                        filtered.sort((a, b) => b.views - a.views);
                        break;
                }
            }
        }
        return filtered;
    }

    // Get user's listings
    async getUserListings(userIdOrName: string | number): Promise<MarketplaceListing[]> {
        // Try backend my-listings endpoint (includes approval status)
        if (typeof userIdOrName === 'number' || /^\d+$/.test(String(userIdOrName))) {
            try {
                const res = await this.fetchJSON<ApiResponse<DbListing[]>>(`/marketplace/my-listings/${userIdOrName}`);
                if (res && res.success && Array.isArray(res.data)) {
                    return res.data.map((db) => ({ 
                        ...this.mapDbListingToUi(db), 
                        isOwnListing: true,
                        approvalStatus: (db as any).approval_status,
                        approvedAt: (db as any).approved_at
                    }));
                }
            } catch (error) {
                console.error('[MarketplaceService] Error fetching my listings:', error);
                return [];
            }
        }
        // Fallback to local by author name
        if (!this.initialized) this.initializeDummyData();
        return this.listings
            .filter(listing => listing.author.name === userIdOrName)
            .map(listing => ({ ...listing, isOwnListing: true }));
    }

    // Create new listing
    async createListing(listingData: Partial<MarketplaceListing> & { category_id?: number; listing_type?: string; postal_code?: number; village?: string }, author: ListingAuthor & { userId?: number }): Promise<MarketplaceListing> {
        // Note: seller_id is NOT sent - backend uses authenticated user from token
        const payload: Record<string, unknown> = {
            title: listingData.title,
            description: listingData.description,
            price: listingData.price,
            currency: listingData.currency || 'BDT',
            category_id: listingData.category_id || this.getCategoryId(listingData.category),
            listing_type: listingData.listing_type || listingData.type || 'sell',
            location: listingData.location || author.location || 'বাংলাদেশ',
            postal_code: listingData.postal_code || null,
            village: listingData.village || null,
            contact_phone: listingData.contactInfo?.phone,
            tags: listingData.tags || [],
            images: listingData.images || [],
        };

        console.log('[MarketplaceService] Creating listing with payload:', payload);
        console.log('[MarketplaceService] Auth token:', localStorage.getItem('auth_token') ? 'Present' : 'Missing');

        const res = await this.fetchJSON<ApiResponse<DbListing>>('/marketplace', { method: 'POST', body: JSON.stringify(payload) });
        console.log('[MarketplaceService] API Response:', res);
        
        if (res && res.success && res.data) {
            console.log('[MarketplaceService] Listing created successfully in DB:', res.data);
            const mapped = { ...this.mapDbListingToUi(res.data), isOwnListing: true };
            return mapped;
        }
        
        console.warn('[MarketplaceService] API call failed or returned null, falling back to local storage');

        // Fallback local
        if (!this.initialized) this.initializeDummyData();
        const newListing: MarketplaceListing = {
            id: Date.now().toString(),
            author,
            title: listingData.title,
            description: listingData.description,
            price: listingData.price,
            currency: listingData.currency || 'BDT',
            category: listingData.category,
            type: listingData.type,
            status: 'active',
            images: listingData.images || [],
            tags: listingData.tags || [],
            location: listingData.location || author.location,
            contactInfo: listingData.contactInfo,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            featured: false,
            views: 0,
            saves: 0,
            contacts: 0,
            isOwnListing: true,
        };
        this.listings.unshift(newListing);
        return newListing;
    }

    // Update listing
    async updateListing(listingId: string, updates: Partial<MarketplaceListing>, userName?: string, postalCode?: number | null, village?: string | null): Promise<MarketplaceListing | null> {
        const payload: Record<string, unknown> = {
            title: updates.title,
            description: updates.description,
            price: updates.price,
            currency: updates.currency,
            listing_type: updates.type,
            location: updates.location,
            contact_phone: updates.contactInfo?.phone,
            tags: updates.tags,
            images: updates.images,
            status: updates.status,
        };

        // Only include postal_code and village if they have actual values
        // This prevents overwriting existing values with null
        if (postalCode !== null && postalCode !== undefined) {
            payload.postal_code = postalCode;
        }
        if (village !== null && village !== undefined && village !== '') {
            payload.village = village;
        }

        const res = await this.fetchJSON<ApiResponse<DbListing>>(`/marketplace/${listingId}`, { method: 'PUT', body: JSON.stringify(payload) });
        if (res && res.success && res.data) {
            return this.mapDbListingToUi(res.data);
        }

        // Fallback local
        const listingIndex = this.listings.findIndex(l => l.id === listingId);
        if (listingIndex === -1) return null;
        const listing = this.listings[listingIndex];
        if (userName && listing.author.name !== userName) return null;
        const updatedListing = { ...listing, ...updates, updatedAt: new Date().toISOString() } as MarketplaceListing;
        this.listings[listingIndex] = updatedListing;
        return updatedListing;
    }

    // Delete listing
    async deleteListing(listingId: string, userName?: string): Promise<boolean> {
    const res = await this.fetchJSON<ApiResponse<unknown>>(`/marketplace/${listingId}`, { method: 'DELETE' });
        if (res && res.success) return true;
        const idx = this.listings.findIndex(l => l.id === listingId);
        if (idx === -1) return false;
        if (userName && this.listings[idx].author.name !== userName) return false;
        this.listings.splice(idx, 1);
        return true;
    }

    // Contact seller (increment contact count)
    async contactSeller(listingId: string): Promise<MarketplaceListing | null> {
        const res = await this.fetchJSON<ApiResponse<unknown>>(`/marketplace/${listingId}/contact`, { method: 'POST' });
        if (res && res.success) {
            const refreshed = await this.getListing(listingId);
            return refreshed;
        }
        const listing = this.listings.find(l => l.id === listingId);
        if (!listing) return null;
        listing.contacts += 1;
        return listing;
    }

    // Save/unsave listing
    async toggleSave(listingId: string, userId: number = 1): Promise<{ listing: MarketplaceListing | null; saved: boolean }> {
        const res = await this.fetchJSON<ApiResponse<{ saved: boolean }>>(`/marketplace/${listingId}/save`, { method: 'POST', body: JSON.stringify({ user_id: userId }) });
        if (res && res.success) {
            // Get the current listing and update isSaved directly instead of refetching
            const refreshed = await this.getListing(listingId);
            const saved = res.data?.saved ?? false;
            if (refreshed) {
                refreshed.isSaved = saved;
                // Update saves count based on saved state
                if (saved) {
                    refreshed.saves += 1;
                } else {
                    refreshed.saves = Math.max(0, refreshed.saves - 1);
                }
            }
            return { listing: refreshed, saved };
        }
        const listing = this.listings.find(l => l.id === listingId);
        if (!listing) return { listing: null, saved: false };
        return { listing, saved: false };
    }

    // Boost listing (repost to top)
    async boostListing(listingId: string, userId: number = 1): Promise<{ success: boolean; listing: MarketplaceListing | null }> {
        const res = await this.fetchJSON<ApiResponse<MarketplaceListing>>(`/marketplace/${listingId}/boost`, { 
            method: 'POST', 
            body: JSON.stringify({ user_id: userId }) 
        });
        if (res && res.success && res.data) {
            return { success: true, listing: res.data };
        }
        return { success: false, listing: null };
    }

    // Increment view count
    async incrementViews(listingId: string): Promise<void> {
        const res = await this.fetchJSON<ApiResponse<unknown>>(`/marketplace/${listingId}/view`, { method: 'POST' });
        if (!res || !res.success) {
            const listing = this.listings.find(l => l.id === listingId);
            if (listing) listing.views += 1;
        }
    }

    private getCategoryId(category?: string): number | undefined {
        // Map category slugs to database IDs
        // You'll need to populate marketplace_categories table first
        const categoryMap: Record<string, number> = {
            'crops': 1,
            'machinery': 2,
            'fertilizer': 3,
            'seeds': 4,
            'livestock': 5,
            'tools': 6,
            'other': 7,
        };
        return category ? categoryMap[category] : undefined;
    }

    // Get single listing
    async getListing(listingId: string): Promise<MarketplaceListing | null> {
        const res = await this.fetchJSON<ApiResponse<DbListing>>(`/marketplace/${listingId}`);
        if (res && res.success && res.data) return this.mapDbListingToUi(res.data);
        return this.listings.find(l => l.id === listingId) || null;
    }

    // Get user's saved listings
    async getSavedListings(userIdOrName: string | number): Promise<MarketplaceListing[]> {
        // Try backend
        if (typeof userIdOrName === 'number' || /^\d+$/.test(String(userIdOrName))) {
            const res = await this.fetchJSON<ApiResponse<DbListing[]>>(`/marketplace/saved/${userIdOrName}`);
            if (res && res.success && Array.isArray(res.data)) {
                return res.data.map((db) => this.mapDbListingToUi(db));
            }
        }
        // Fallback to local saved listings
        if (!this.initialized) this.initializeDummyData();
        return this.listings.filter(listing => listing.saved === true);
    }

    // Get user's own active marketplace listings (for social feed sharing)
    async getActiveUserListings(userId: number): Promise<MarketplaceListing[]> {
        try {
            console.log(`[MarketplaceService] Fetching active user listings for user_id: ${userId}`);
            const res = await this.fetchJSON<ApiResponse<Pagination<DbListing>>>(`/marketplace/user/${userId}?status=active`);
            
            if (res && res.success && res.data) {
                const listings = Array.isArray(res.data) ? res.data : res.data.data || [];
                return listings
                    .map((db) => this.mapDbListingToUi(db))
                    .filter(listing => listing.status === 'active')
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }
            
            console.log('[MarketplaceService] No active user listings found from API');
            return [];
        } catch (error) {
            console.error('[MarketplaceService] Error fetching active user listings:', error);
            return [];
        }
    }

    // Get user's all listings (including pending, approved, rejected)
    async getMyListings(userId: number): Promise<MarketplaceListing[]> {
        try {
            const res = await this.fetchJSON<ApiResponse<DbListing[]>>(`/marketplace/my-listings/${userId}`);
            if (res && res.success && Array.isArray(res.data)) {
                return res.data.map((db) => ({
                    ...this.mapDbListingToUi(db),
                    approvalStatus: (db as any).approval_status,
                    approvedAt: (db as any).approved_at
                }));
            }
            return [];
        } catch (error) {
            console.error('[MarketplaceService] Error fetching my listings:', error);
            return [];
        }
    }

    // Data Operator: Get pending marketplace listings
    async getPendingListings(page = 1, limit = 10, status: 'pending' | 'approved' | 'rejected' = 'pending'): Promise<{ listings: MarketplaceListing[], total: number }> {
        try {
            const res = await this.fetchJSON<any>(`/data-operator/marketplace/pending?page=${page}&limit=${limit}&status=${status}`);
            if (res && res.success) {
                return {
                    listings: (res.data || []).map((db: DbListing) => ({
                        ...this.mapDbListingToUi(db),
                        approvalStatus: (db as any).approval_status,
                        createdAt: (db as any).created_at,
                        updatedAt: (db as any).updated_at
                    })),
                    total: res.total || 0
                };
            }
            return { listings: [], total: 0 };
        } catch (error) {
            console.error('[MarketplaceService] Error fetching pending listings:', error);
            return { listings: [], total: 0 };
        }
    }

    // Data Operator: Approve listing
    async approveListing(listingId: string | number, userId: number): Promise<boolean> {
        try {
            const res = await this.fetchJSON<ApiResponse<any>>(`/data-operator/marketplace/${listingId}/approve`, {
                method: 'POST',
                body: JSON.stringify({ user_id: userId })
            });
            return res?.success || false;
        } catch (error) {
            console.error('[MarketplaceService] Error approving listing:', error);
            return false;
        }
    }

    // Data Operator: Reject listing
    async rejectListing(listingId: string | number, userId: number): Promise<boolean> {
        try {
            const res = await this.fetchJSON<ApiResponse<any>>(`/data-operator/marketplace/${listingId}/reject`, {
                method: 'POST',
                body: JSON.stringify({ user_id: userId })
            });
            return res?.success || false;
        } catch (error) {
            console.error('[MarketplaceService] Error rejecting listing:', error);
            return false;
        }
    }
}

export const marketplaceService = new MarketplaceService();