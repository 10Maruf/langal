// Central Marketplace Types - Enhanced for listing management

export type ListingType = "sell" | "rent" | "buy" | "service";
export type ListingCategory = "crops" | "machinery" | "fertilizer" | "seeds" | "livestock" | "tools" | "other";
export type ListingStatus = "active" | "sold" | "expired" | "draft";

export interface ListingAuthor {
    name: string;
    avatar?: string;
    location: string;
    verified?: boolean;
    rating?: number;
    userType: "farmer" | "customer" | "expert";
}

export interface MarketplaceListing {
    id: string;
    author: ListingAuthor;
    title: string;
    description: string;
    price: number;
    currency: string;
    category: ListingCategory;
    categoryNameBn?: string;  // Bangla category name from backend
    type: ListingType;
    listingTypeBn?: string;   // Bangla listing type from backend
    status: ListingStatus;
    images: string[];
    tags: string[];
    location: string;
    postal_code?: number;     // Location postal code for edit preservation
    village?: string;         // Village name for edit preservation
    contactInfo?: {
        phone?: string;
        email?: string;
    };
    createdAt: string;
    updatedAt: string;
    featured?: boolean;
    views: number;
    saves: number;
    contacts: number;
    isOwnListing?: boolean;
    isSaved?: boolean;
}

export interface ListingComment {
    id: string;
    author: {
        name: string;
        avatar?: string;
        userType: "farmer" | "customer" | "expert";
    };
    content: string;
    createdAt: string;
    likes: number;
    liked?: boolean;
}

export interface ListingFilter {
    search: string;
    category: string;
    categoryId: number | null;
    type: string;
    division: string;
    district: string;
    upazila: string;
    priceRange: [number, number];
    sortBy: string;
    status?: string;
}

// Category options (icon names for Lucide React)
export const LISTING_CATEGORIES = [
    { id: "crops", label: "ফসল ও শাকসবজি", icon: "Wheat" },
    { id: "machinery", label: "যন্ত্রপাতি", icon: "Tractor" },
    { id: "fertilizer", label: "সার ও কীটনাশক", icon: "FlaskConical" },
    { id: "seeds", label: "বীজ ও চারা", icon: "Sprout" },
    { id: "livestock", label: "গবাদি পশু", icon: "PawPrint" },
    { id: "tools", label: "হাতিয়ার", icon: "Wrench" },
    { id: "other", label: "অন্যান্য", icon: "Package" }
];

// Type options
export const LISTING_TYPES = [
    { id: "sell", label: "বিক্রি", color: "green", icon: "Tag" },
    { id: "rent", label: "ভাড়া", color: "blue", icon: "RefreshCw" },
    { id: "buy", label: "কিনতে চাই", color: "purple", icon: "ShoppingCart" },
    { id: "service", label: "সেবা", color: "orange", icon: "Settings" }
];

// Location options (major districts in Bangladesh)
export const LOCATIONS = [
    "ঢাকা", "চট্টগ্রাম", "সিলেট", "খুলনা", "বরিশাল", "রাজশাহী", "রংপুর", "ময়মনসিংহ",
    "কুমিল্লা", "গাজীপুর", "নারায়ণগঞ্জ", "সাভার", "টাঙ্গাইল", "কিশোরগঞ্জ", "নেত্রকোণা",
    "জামালপুর", "শেরপুর", "বগুড়া", "জয়পুরহাট", "পাবনা", "সিরাজগঞ্জ", "নাটোর",
    "নওগাঁ", "চাঁপাইনবাবগঞ্জ", "কুষ্টিয়া", "মাগুরা", "নড়াইল", "যশোর", "সাতক্ষীরা",
    "বাগেরহাট", "পিরোজপুর", "ঝালকাঠি", "ভোলা", "পটুয়াখালী", "বরগুনা", "হবিগঞ্জ",
    "মৌলভীবাজার", "সুনামগঞ্জ", "ব্রাহ্মণবাড়িয়া", "চাঁদপুর", "লক্ষ্মীপুর", "নোয়াখালী",
    "ফেনী", "খাগড়াছড়ি", "রাঙ্গামাটি", "বান্দরবান", "পঞ্চগড়", "ঠাকুরগাঁও", "দিনাজপুর",
    "নীলফামারী", "লালমনিরহাট", "কুড়িগ্রাম", "গাইবান্ধা"
];