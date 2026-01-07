import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { CreateListing } from "@/components/marketplace/CreateListing";
import { ListingManager } from "@/components/marketplace/ListingManager";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
    Plus,
    ShoppingCart,
    ArrowLeft,
    User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { marketplaceService } from "@/services/marketplaceService";
import { MarketplaceListing, ListingFilter } from "@/types/marketplace";

interface CentralMarketplaceProps {
    showHeader?: boolean;
}

const CentralMarketplace = ({ showHeader = true }: CentralMarketplaceProps) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();

    // State management
    const [listings, setListings] = useState<MarketplaceListing[]>([]);
    const [showCreateListing, setShowCreateListing] = useState(false);
    const [showListingManager, setShowListingManager] = useState(false);
    const [filters, setFilters] = useState<ListingFilter>({
        search: "",
        category: "all",
        categoryId: null,
        type: "all",
        division: "all",
        district: "all",
        upazila: "all",
        priceRange: [0, 100000],
        sortBy: "newest"
    });
    const [isLoading, setIsLoading] = useState(true);

    // Debounce ref for search
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Memoize user location to prevent infinite re-renders
    const userLocation = useMemo(() => {
        if (!user?.location_info) return undefined;
        return {
            village: user.location_info.village,
            postal_code: user.location_info.postal_code,
            upazila_bn: user.location_info.upazila_bn,
            district_bn: user.location_info.district_bn,
            division_bn: user.location_info.division_bn
        };
    }, [user?.location_info]);

    // Async load listings (handles Promise from service)
    const loadListings = useCallback(async (currentFilters: ListingFilter) => {
        setIsLoading(true);
        try {
            const data = await marketplaceService.getListings(currentFilters, user?.type, userLocation, user?.user_id);
            console.log('Loaded listings:', data);
            setListings(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Error loading listings:', e);
            setListings([]);
        } finally {
            setIsLoading(false);
        }
    }, [user?.type, userLocation, user?.user_id]);

    // Debounced filter effect - waits 400ms after last change before calling API
    useEffect(() => {
        // Clear previous timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer
        debounceTimerRef.current = setTimeout(() => {
            loadListings(filters);
        }, 400);

        // Cleanup on unmount
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [filters, loadListings]);

    // Handle new listing creation
    const handleCreateListing = async (listingData: unknown) => {
        const authorInfo = {
            name: user?.name || "ব্যবহারকারী",
            avatar: user?.profilePhoto || "/placeholder.svg",
            location: user?.location || getLocationByUserType(),
            verified: user?.type === "expert",
            rating: 4.5,
            userType: user?.type || "farmer",
            userId: user?.user_id || 1,
        };

        try {
            const newListing = await marketplaceService.createListing(listingData, authorInfo);
            setListings(prev => [newListing, ...prev]);
            setShowCreateListing(false);
            toast({
                title: "বিজ্ঞাপন পোস্ট করা হয়েছে",
                description: "আপনার বিজ্ঞাপন সফলভাবে প্রকাশিত হয়েছে।",
            });
        } catch (e) {
            toast({
                title: "ব্যর্থ",
                description: "বিজ্ঞাপন পোস্ট করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।",
                variant: "destructive",
            });
        }
    };

    // Handle contact seller
    const handleContact = async (listing: MarketplaceListing) => {
        const updatedListing = await marketplaceService.contactSeller(listing.id);
        if (updatedListing) {
            setListings(prev => prev.map(l => l.id === listing.id ? updatedListing : l));
        }
        toast({
            title: "যোগাযোগের তথ্য",
            description: `${listing.author.name} এর সাথে যোগাযোগ করতে কল করুন: ${listing.contactInfo?.phone || "০১৭১২-৩৪৫৬৭৮"}`,
        });
    };

    // Handle save listing
    const handleSave = async (listing: MarketplaceListing) => {
        if (!user?.user_id) {
            toast({
                title: "লগইন করুন",
                description: "সেভ করতে প্রথমে লগইন করুন।",
                variant: "destructive",
            });
            return;
        }
        
        // Optimistic update - immediately toggle the UI before API call
        const wasAlreadySaved = listing.isSaved;
        const newSavedState = !wasAlreadySaved;
        
        // Update UI immediately
        setListings(prev => prev.map(l => 
            l.id === listing.id 
                ? { ...l, isSaved: newSavedState, saves: newSavedState ? l.saves + 1 : Math.max(0, l.saves - 1) } 
                : l
        ));
        
        // Show toast immediately with correct message
        toast({
            title: newSavedState ? "সেভ করা হয়েছে" : "সেভ সরানো হয়েছে",
            description: newSavedState
                ? "আইটেমটি আপনার সেভ লিস্টে যোগ করা হয়েছে।"
                : "আইটেমটি আপনার সেভ লিস্ট থেকে সরানো হয়েছে।",
        });
        
        // Make API call in background
        const result = await marketplaceService.toggleSave(listing.id, user.user_id);
        
        // If API fails, revert the optimistic update
        if (!result.listing) {
            setListings(prev => prev.map(l => 
                l.id === listing.id 
                    ? { ...l, isSaved: wasAlreadySaved, saves: wasAlreadySaved ? l.saves + 1 : Math.max(0, l.saves - 1) } 
                    : l
            ));
            toast({
                title: "ব্যর্থ",
                description: "সেভ করতে সমস্যা হয়েছে।",
                variant: "destructive",
            });
        }
    };

    // Get location based on user type
    const getLocationByUserType = () => {
        switch (user?.type) {
            case "expert":
                return "কৃষি বিশ্ববিদ্যালয়";
            case "customer":
                return "ঢাকা";
            case "farmer":
            default:
                return "বাংলাদেশ";
        }
    };

    // Get page title based on user type
    const getPageTitle = () => {
        switch (user?.type) {
            case "expert":
                return "কৃষি বাজার ও পরামর্শ";
            case "customer":
                return "কৃষি বাজার";
            case "farmer":
            default:
                return "কেন্দ্রীয় বাজার";
        }
    };

    // Get create button text
    const getCreateButtonText = () => {
        switch (user?.type) {
            case "expert":
                return "পরামর্শ দিন";
            case "customer":
                return "বিজ্ঞাপন দিন";
            case "farmer":
            default:
                return "বিজ্ঞাপন দিন";
        }
    };

    // Handle filters change
    const handleFiltersChange = (newFilters: Partial<ListingFilter>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({
            search: "",
            category: "all",
            categoryId: null,
            type: "all",
            division: "all",
            district: "all",
            upazila: "all",
            priceRange: [0, 100000],
            sortBy: "newest"
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {showHeader && <Header />}
            <div className={showHeader ? "pb-20 pt-14" : "pb-20"}>
                {/* Header */}
                <div className="border-b p-4 sticky top-0 z-40 backdrop-blur-md bg-background/95">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(-1)}
                                className="p-2"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5 text-primary" />
                                    {getPageTitle()}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {listings.length} টি পণ্য পাওয়া গেছে
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowListingManager(true)}
                            >
                                <User className="h-4 w-4 mr-1" />
                                আমার বিজ্ঞাপন
                            </Button>
                            <Button size="sm" onClick={() => setShowCreateListing(true)}>
                                <Plus className="h-4 w-4 mr-1" />
                                {getCreateButtonText()}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <MarketplaceFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                />

                {/* Listings Feed */}
                <div className="space-y-4 p-4 max-w-4xl mx-auto">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="bg-muted h-48 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    ) : listings.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">🛒</div>
                            <h3 className="text-lg font-medium mb-2">কোন বিজ্ঞাপন নেই</h3>
                            <p className="text-muted-foreground mb-4">
                                {filters.search || filters.category !== "all" || filters.type !== "all"
                                    ? "আপনার ফিল্টারের সাথে মিলে এমন কোন বিজ্ঞাপন খুঁজে পাওয়া যায়নি।"
                                    : "প্রথম বিজ্ঞাপন দিন এবং কমিউনিটির সাথে শেয়ার করুন!"
                                }
                            </p>
                            <Button onClick={() => setShowCreateListing(true)}>
                                <Plus className="h-4 w-4 mr-1" />
                                {getCreateButtonText()}
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {listings.map((listing) => (
                                <MarketplaceCard
                                    key={listing.id}
                                    item={{
                                        id: listing.id,
                                        title: listing.title,
                                        description: listing.description,
                                        price: listing.price,
                                        currency: listing.currency,
                                        category: listing.category,
                                        category_name_bn: listing.categoryNameBn,
                                        type: listing.type,
                                        listing_type_bn: listing.listingTypeBn,
                                        location: listing.location,
                                        seller: {
                                            name: listing.author.name,
                                            avatar: listing.author.avatar,
                                            rating: listing.author.rating || 0,
                                            verified: listing.author.verified || false
                                        },
                                        images: listing.images,
                                        postedAt: listing.createdAt,
                                        featured: listing.featured,
                                        saved: listing.isSaved
                                    }}
                                    onContact={() => handleContact(listing)}
                                    onSave={() => handleSave(listing)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Listing Dialog */}
                <Dialog open={showCreateListing} onOpenChange={setShowCreateListing}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogTitle className="sr-only">নতুন বিজ্ঞাপন তৈরি করুন</DialogTitle>
                        <CreateListing
                            onListing={handleCreateListing}
                            onCancel={() => setShowCreateListing(false)}
                        />
                    </DialogContent>
                </Dialog>

                {/* Listing Manager Dialog */}
                <Dialog open={showListingManager} onOpenChange={setShowListingManager}>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogTitle className="sr-only">আমার বিজ্ঞাপন পরিচালনা</DialogTitle>
                        <ListingManager onClose={() => setShowListingManager(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default CentralMarketplace;