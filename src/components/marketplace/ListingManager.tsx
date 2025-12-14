import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Edit2,
    Trash2,
    Search,
    Eye,
    Phone,
    MapPin,
    Clock,
    BarChart3,
    AlertCircle,
    Bookmark,
    Package,
    TrendingUp,
    Heart,
    X,
    Save,
    Tag,
    RefreshCw,
    ShoppingCart,
    Settings,
    ChevronDown,
    Image as ImageIcon,
    Upload,
    Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MarketplaceListing, LISTING_CATEGORIES } from "@/types/marketplace";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { marketplaceService } from "@/services/marketplaceService";
import { englishToBangla } from "@/lib/banglaUtils";
import LocationSelector from "@/components/farmer/LocationSelector";

// Location data type for LocationSelector
interface EditLocationData {
    division: string;
    division_bn: string;
    district: string;
    district_bn: string;
    upazila: string;
    upazila_bn: string;
    post_office: string;
    post_office_bn: string;
    postal_code: number;
    village: string;
}

interface ListingManagerProps {
    onClose?: () => void;
}

// API Base URL
const API_BASE = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env?.VITE_API_BASE?.replace(/\/$/, '') || 'http://localhost:8000/api';

interface Category {
    id: number;
    name: string;
    name_bn: string;
    slug: string;
}

// Bengali relative time helper
const getBanglaRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
        if (diffMins < 1) return "এইমাত্র";
        if (diffMins < 60) return `${englishToBangla(diffMins)} মিনিট আগে`;
        return `${englishToBangla(diffHours)} ঘণ্টা আগে`;
    }
    if (isYesterday) return "গতকাল";
    if (diffDays < 7) return `${englishToBangla(diffDays)} দিন আগে`;
    if (diffDays < 30) return `${englishToBangla(Math.floor(diffDays / 7))} সপ্তাহ আগে`;
    return `${englishToBangla(Math.floor(diffDays / 30))} মাস আগে`;
};

export const ListingManager = ({ onClose }: ListingManagerProps) => {
    const { user } = useAuth();
    const { toast } = useToast();

    // State management
    const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);
    const [savedListings, setSavedListings] = useState<MarketplaceListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("my-listings");

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    // Categories from API
    const [categories, setCategories] = useState<Category[]>([]);

    // Fallback categories if API doesn't return any
    const displayCategories = useMemo(() => {
        if (categories.length > 0) {
            return categories.map(cat => ({
                id: cat.id,
                slug: cat.slug,
                name_bn: cat.name_bn
            }));
        }
        // Use LISTING_CATEGORIES as fallback
        return LISTING_CATEGORIES.map((cat, idx) => ({
            id: idx + 1,
            slug: cat.id,
            name_bn: cat.label
        }));
    }, [categories]);

    // Edit dialog state
    const [editingListing, setEditingListing] = useState<MarketplaceListing | null>(null);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        type: "",
        status: "",
        phone: ""
    });

    // Edit location states
    const [editLocationMode, setEditLocationMode] = useState<'current' | 'custom'>('current');
    const [editCurrentLocation, setEditCurrentLocation] = useState("");
    const [editCustomLocationData, setEditCustomLocationData] = useState<EditLocationData | null>(null);
    const [editCustomAddress, setEditCustomAddress] = useState("");
    const [editPostalCode, setEditPostalCode] = useState<number | null>(null);
    const [editVillage, setEditVillage] = useState<string>("");

    // Edit image states
    const [editExistingImages, setEditExistingImages] = useState<string[]>([]);
    const [editNewImages, setEditNewImages] = useState<File[]>([]);
    const [editIsUploading, setEditIsUploading] = useState(false);

    // Delete dialog
    const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);

    // Load user's listings and saved listings
    const loadData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Load user's own listings
            const userListings = await marketplaceService.getUserListings(user.user_id || user.name);
            console.log('My listings:', userListings);
            setMyListings(userListings);

            // Load saved listings
            const saved = await marketplaceService.getSavedListings(user.user_id || user.name);
            console.log('Saved listings:', saved);
            console.log('First saved location:', saved[0]?.location);
            setSavedListings(saved);
        } catch (error) {
            console.error('Error loading listings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load categories from API
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch(`${API_BASE}/marketplace/categories`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setCategories(data.data || []);
                    }
                }
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };
        loadCategories();
    }, []);

    // Load data on mount
    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Filter listings
    const filteredMyListings = useMemo(() => {
        let filtered = myListings;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(l =>
                l.title.toLowerCase().includes(query) ||
                l.description.toLowerCase().includes(query)
            );
        }

        if (filterCategory !== "all") {
            filtered = filtered.filter(l => l.category === filterCategory);
        }

        if (filterType !== "all") {
            filtered = filtered.filter(l => l.type === filterType);
        }

        if (filterStatus !== "all") {
            filtered = filtered.filter(l => l.status === filterStatus);
        }

        return filtered;
    }, [myListings, searchQuery, filterCategory, filterType, filterStatus]);

    const filteredSavedListings = useMemo(() => {
        let filtered = savedListings;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(l =>
                l.title.toLowerCase().includes(query) ||
                l.description.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [savedListings, searchQuery]);

    // Statistics
    const stats = useMemo(() => {
        const totalViews = myListings.reduce((sum, l) => sum + (l.views || 0), 0);
        const totalContacts = myListings.reduce((sum, l) => sum + (l.contacts || 0), 0);
        const totalSaves = myListings.reduce((sum, l) => sum + (l.saves || 0), 0);

        return {
            totalListings: myListings.length,
            activeListings: myListings.filter(l => l.status === "active").length,
            soldListings: myListings.filter(l => l.status === "sold").length,
            totalViews,
            totalContacts,
            totalSaves,
            savedItems: savedListings.length
        };
    }, [myListings, savedListings]);

    // Handle edit
    const handleEditClick = (listing: MarketplaceListing) => {
        setEditingListing(listing);
        setEditForm({
            title: listing.title,
            description: listing.description,
            price: listing.price.toString(),
            category: listing.category,
            type: listing.type,
            status: listing.status,
            phone: listing.contactInfo?.phone || ""
        });
        // Set location
        setEditCurrentLocation(listing.location || "");
        setEditLocationMode('current');
        setEditCustomLocationData(null);
        setEditCustomAddress("");
        setEditPostalCode(null);
        setEditVillage("");
        // Set images
        setEditExistingImages(listing.images || []);
        setEditNewImages([]);
    };

    const handleSaveEdit = async () => {
        if (!editingListing) return;

        setEditIsUploading(true);

        try {
            // Upload new images if any
            let uploadedImagePaths: string[] = [];
            if (editNewImages.length > 0) {
                try {
                    const formData = new FormData();
                    editNewImages.forEach(image => {
                        formData.append('images[]', image);
                    });

                    const token = localStorage.getItem('auth_token');
                    const response = await fetch(`${API_BASE}/images/marketplace`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: formData,
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success && result.data) {
                            uploadedImagePaths = result.data.map((img: { path: string }) => img.path);
                        }
                    }
                } catch (error) {
                    console.error('Error uploading images:', error);
                }
            }

            // Combine existing and new images
            const allImages = [...editExistingImages, ...uploadedImagePaths];

            // Determine final location
            const finalLocation = editLocationMode === 'current'
                ? editCurrentLocation
                : editCustomAddress;

            // Get postal_code and village based on location mode
            // When location mode is 'current', preserve original listing's postal_code and village
            let postalCode: number | null = null;
            let village: string | null = null;

            if (editLocationMode === 'custom' && editCustomLocationData) {
                postalCode = editCustomLocationData.postal_code || null;
                village = editCustomLocationData.village || null;
            } else if (editLocationMode === 'current' && editingListing) {
                // Preserve original location data when not changing location
                postalCode = editingListing.postal_code || null;
                village = editingListing.village || null;
            }

            const updatedListing = await marketplaceService.updateListing(
                editingListing.id,
                {
                    title: editForm.title,
                    description: editForm.description,
                    price: parseFloat(editForm.price),
                    category: editForm.category as MarketplaceListing["category"],
                    type: editForm.type as MarketplaceListing["type"],
                    status: editForm.status as MarketplaceListing["status"],
                    location: finalLocation,
                    contactInfo: { phone: editForm.phone },
                    images: allImages
                },
                user?.name || "",
                postalCode,
                village
            );

            if (updatedListing) {
                setMyListings(prev => prev.map(l => l.id === editingListing.id ? updatedListing : l));
                setEditingListing(null);
                toast({
                    title: "সফল",
                    description: "বিজ্ঞাপন আপডেট করা হয়েছে",
                });
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "আপডেট করতে সমস্যা হয়েছে",
                variant: "destructive"
            });
        } finally {
            setEditIsUploading(false);
        }
    };

    // Handle delete
    const handleDelete = async (listingId: string) => {
        try {
            const success = await marketplaceService.deleteListing(listingId, user?.name || "");
            if (success) {
                setMyListings(prev => prev.filter(l => l.id !== listingId));
                setShowDeleteDialog(null);
                toast({
                    title: "সফল",
                    description: "বিজ্ঞাপন মুছে ফেলা হয়েছে",
                });
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "মুছতে সমস্যা হয়েছে",
                variant: "destructive"
            });
        }
    };

    // Handle boost (repost listing to top)
    const handleBoost = async (listingId: string) => {
        if (!user?.user_id) return;
        try {
            const result = await marketplaceService.boostListing(listingId, user.user_id);
            if (result.success) {
                toast({
                    title: "বুস্ট সফল! 🚀",
                    description: "আপনার বিজ্ঞাপনটি এখন সবার উপরে দেখাবে",
                });
                // Refresh listings
                loadData();
            } else {
                toast({
                    title: "ত্রুটি",
                    description: "বুস্ট করতে সমস্যা হয়েছে",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "বুস্ট করতে সমস্যা হয়েছে",
                variant: "destructive"
            });
        }
    };

    // Handle unsave
    const handleUnsave = async (listing: MarketplaceListing) => {
        if (!user?.user_id) {
            toast({
                title: "ত্রুটি",
                description: "লগইন করুন",
                variant: "destructive"
            });
            return;
        }
        try {
            await marketplaceService.toggleSave(listing.id, user.user_id);
            setSavedListings(prev => prev.filter(l => l.id !== listing.id));
            toast({
                title: "সরানো হয়েছে",
                description: "সেভ তালিকা থেকে সরানো হয়েছে",
            });
        } catch (error) {
            console.error('Error unsaving:', error);
        }
    };

    // Clear filters
    const clearFilters = () => {
        setSearchQuery("");
        setFilterCategory("all");
        setFilterType("all");
        setFilterStatus("all");
    };

    const hasActiveFilters = searchQuery || filterCategory !== "all" || filterType !== "all" || filterStatus !== "all";

    // Type icons
    const typeIcons: Record<string, JSX.Element> = {
        sell: <Tag className="h-3 w-3" />,
        rent: <RefreshCw className="h-3 w-3" />,
        buy: <ShoppingCart className="h-3 w-3" />,
        service: <Settings className="h-3 w-3" />
    };

    const typeLabels: Record<string, string> = {
        sell: "বিক্রয়",
        rent: "ভাড়া",
        buy: "কিনতে চাই",
        service: "সেবা"
    };

    const statusLabels: Record<string, string> = {
        active: "সক্রিয়",
        sold: "বিক্রিত",
        expired: "মেয়াদোত্তীর্ণ",
        draft: "খসড়া"
    };

    const statusColors: Record<string, string> = {
        active: "bg-green-100 text-green-700",
        sold: "bg-blue-100 text-blue-700",
        expired: "bg-red-100 text-red-700",
        draft: "bg-gray-100 text-gray-700"
    };

    // Listing card component
    const ListingCard = ({ listing, showEditDelete = false, showUnsave = false }: {
        listing: MarketplaceListing;
        showEditDelete?: boolean;
        showUnsave?: boolean;
    }) => {
        const handleContactClick = () => {
            const phone = listing.contactInfo?.phone || listing.author?.name || "০১৭১২-৩৪৫৬৭৮";
            toast({
                title: "📞 যোগাযোগ",
                description: `${listing.author?.name || 'বিক্রেতা'}: ${phone}`,
            });
        };

        return (
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex">
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-muted">
                        {listing.images && listing.images.length > 0 ? (
                            <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                    <Badge className={cn("text-xs", statusColors[listing.status])}>
                                        {statusLabels[listing.status]}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                                        {typeIcons[listing.type]}
                                        {listing.listingTypeBn || typeLabels[listing.type]}
                                    </Badge>
                                </div>
                                <h3 className="font-medium text-sm truncate">{listing.title}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-1">{listing.description}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                                {showEditDelete && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                                            onClick={() => handleBoost(listing.id)}
                                            title="বুস্ট করুন"
                                        >
                                            <Rocket className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handleEditClick(listing)}
                                        >
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-destructive hover:text-destructive"
                                            onClick={() => setShowDeleteDialog(listing.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </>
                                )}
                                {showUnsave && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                                            onClick={handleContactClick}
                                            title="যোগাযোগ"
                                        >
                                            <Phone className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handleUnsave(listing)}
                                            title="সেভ সরান"
                                        >
                                            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Footer info */}
                        <div className="flex items-center justify-between mt-2 text-xs">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <span className="font-semibold text-primary text-sm">
                                    ৳{englishToBangla(listing.price.toLocaleString())}
                                </span>
                                {(listing.location || listing.author?.location) && (
                                    <span className="flex items-center gap-0.5">
                                        <MapPin className="h-3 w-3" />
                                        {listing.location || listing.author?.location || 'অজানা'}
                                    </span>
                                )}
                            </div>
                            <span className="flex items-center gap-0.5 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {getBanglaRelativeTime(listing.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">আমার বিজ্ঞাপন</h1>
                    <p className="text-sm text-muted-foreground">
                        আপনার সকল বিজ্ঞাপন পরিচালনা করুন
                    </p>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
                <Card className="p-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-full">
                            <Package className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-lg font-bold">{englishToBangla(stats.totalListings)}</p>
                            <p className="text-xs text-muted-foreground">মোট</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-red-100 rounded-full">
                            <Bookmark className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                            <p className="text-lg font-bold">{englishToBangla(savedListings.length)}</p>
                            <p className="text-xs text-muted-foreground">সেভ</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="my-listings" className="flex items-center gap-1.5">
                        <Package className="h-4 w-4" />
                        আমার বিজ্ঞাপন
                    </TabsTrigger>
                    <TabsTrigger value="saved" className="flex items-center gap-1.5">
                        <Bookmark className="h-4 w-4" />
                        সেভ করা
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="flex items-center gap-1.5">
                        <BarChart3 className="h-4 w-4" />
                        পরিসংখ্যান
                    </TabsTrigger>
                </TabsList>

                {/* My Listings Tab */}
                <TabsContent value="my-listings" className="space-y-3">
                    {/* Search & Filter Bar */}
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="বিজ্ঞাপন খুঁজুন..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9"
                                />
                            </div>
                            <Button
                                variant={showFilters ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className="h-9"
                            >
                                <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
                                ফিল্টার
                            </Button>
                            {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
                                    <X className="h-4 w-4 mr-1" />
                                    রিসেট
                                </Button>
                            )}
                        </div>

                        {/* Expanded Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-3 gap-2 p-3 bg-muted/50 rounded-lg">
                                <div>
                                    <Label className="text-xs mb-1 block">ক্যাটাগরি</Label>
                                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="সব ক্যাটাগরি" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
                                            {LISTING_CATEGORIES.map((cat) => (
                                                <SelectItem key={`filter-cat-${cat.id}`} value={cat.id}>
                                                    {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-xs mb-1 block">ধরন</Label>
                                    <Select value={filterType} onValueChange={setFilterType}>
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="সব ধরন" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">সব ধরন</SelectItem>
                                            <SelectItem value="sell">বিক্রয়</SelectItem>
                                            <SelectItem value="rent">ভাড়া</SelectItem>
                                            <SelectItem value="buy">কিনতে চাই</SelectItem>
                                            <SelectItem value="service">সেবা</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-xs mb-1 block">অবস্থা</Label>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="সব অবস্থা" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">সব অবস্থা</SelectItem>
                                            <SelectItem value="active">সক্রিয়</SelectItem>
                                            <SelectItem value="sold">বিক্রিত</SelectItem>
                                            <SelectItem value="expired">মেয়াদোত্তীর্ণ</SelectItem>
                                            <SelectItem value="draft">খসড়া</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Listings */}
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <Card key={i} className="h-24 animate-pulse bg-muted" />
                            ))}
                        </div>
                    ) : filteredMyListings.length === 0 ? (
                        <Card className="p-8 text-center">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <h3 className="font-medium mb-1">কোন বিজ্ঞাপন নেই</h3>
                            <p className="text-sm text-muted-foreground">
                                {hasActiveFilters
                                    ? "ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন"
                                    : "নতুন বিজ্ঞাপন দিন"
                                }
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-2">
                            {filteredMyListings.map(listing => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    showEditDelete
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Saved Tab */}
                <TabsContent value="saved" className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="সেভ করা বিজ্ঞাপন খুঁজুন..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </div>

                    {filteredSavedListings.length === 0 ? (
                        <Card className="p-8 text-center">
                            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <h3 className="font-medium mb-1">কোন সেভ করা বিজ্ঞাপন নেই</h3>
                            <p className="text-sm text-muted-foreground">
                                পছন্দের বিজ্ঞাপনে ❤️ চাপুন সেভ করতে
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-2">
                            {filteredSavedListings.map(listing => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    showUnsave
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats" className="space-y-4">
                    {/* Category breakdown */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">ক্যাটাগরি অনুযায়ী</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {LISTING_CATEGORIES.map((cat, index) => {
                                    const count = myListings.filter(l => l.category === cat.id).length;
                                    const percent = stats.totalListings > 0 ? Math.round((count / stats.totalListings) * 100) : 0;

                                    // Different colors for each category
                                    const colors = [
                                        'bg-green-500',    // ফসল ও শাকসবজি
                                        'bg-blue-500',     // যন্ত্রপাতি
                                        'bg-purple-500',   // সার ও কীটনাশক
                                        'bg-orange-500',   // বীজ ও চারা
                                        'bg-pink-500',     // গবাদি পশু
                                        'bg-cyan-500',     // হাতিয়ার
                                        'bg-gray-500'      // অন্যান্য
                                    ];
                                    const barColor = colors[index] || 'bg-primary';

                                    return (
                                        <div key={cat.id} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${barColor}`} />
                                                    <span>{cat.label}</span>
                                                </div>
                                                <span className="text-muted-foreground">{englishToBangla(count)} ({englishToBangla(percent)}%)</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${barColor} rounded-full transition-all duration-300`}
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status breakdown */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">স্ট্যাটাস অনুযায়ী</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { id: 'active', label: 'সক্রিয়', color: 'bg-green-500' },
                                    { id: 'sold', label: 'বিক্রিত', color: 'bg-blue-500' },
                                    { id: 'draft', label: 'খসড়া', color: 'bg-gray-400' }
                                ].map(status => {
                                    const count = myListings.filter(l => l.status === status.id).length;
                                    const percent = stats.totalListings > 0 ? Math.round((count / stats.totalListings) * 100) : 0;

                                    return (
                                        <div key={status.id} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${status.color}`} />
                                                    <span>{status.label}</span>
                                                </div>
                                                <span className="text-muted-foreground">{englishToBangla(count)} ({englishToBangla(percent)}%)</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${status.color} rounded-full transition-all duration-300`}
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Dialog */}
            <Dialog open={!!editingListing} onOpenChange={() => setEditingListing(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>বিজ্ঞাপন সম্পাদনা</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>শিরোনাম</Label>
                            <Input
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>বিবরণ</Label>
                            <Textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>দাম (৳)</Label>
                                <Input
                                    type="number"
                                    value={editForm.price}
                                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>অবস্থা</Label>
                                <Select value={editForm.status || undefined} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="অবস্থা নির্বাচন" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="z-[9999]">
                                        <SelectItem value="active">সক্রিয়</SelectItem>
                                        <SelectItem value="sold">বিক্রিত</SelectItem>
                                        <SelectItem value="draft">খসড়া</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>ক্যাটাগরি</Label>
                                <Select value={editForm.category || undefined} onValueChange={(v) => setEditForm({ ...editForm, category: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="ক্যাটাগরি নির্বাচন" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="z-[9999]">
                                        {LISTING_CATEGORIES.map((cat) => (
                                            <SelectItem key={`edit-cat-${cat.id}`} value={cat.id}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>ধরন</Label>
                                <Select value={editForm.type || undefined} onValueChange={(v) => setEditForm({ ...editForm, type: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="ধরন নির্বাচন" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="z-[9999]">
                                        <SelectItem value="sell">বিক্রয়</SelectItem>
                                        <SelectItem value="rent">ভাড়া</SelectItem>
                                        <SelectItem value="buy">কিনতে চাই</SelectItem>
                                        <SelectItem value="service">সেবা</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <Label>
                                <Phone className="h-4 w-4 inline mr-1" />
                                যোগাযোগ নম্বর
                            </Label>
                            <Input
                                placeholder="01712-345678"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                        </div>

                        {/* Location Selection */}
                        <div className="space-y-3">
                            <Label>
                                <MapPin className="h-4 w-4 inline mr-1" />
                                স্থান নির্বাচন করুন
                            </Label>

                            <RadioGroup
                                value={editLocationMode}
                                onValueChange={(value: 'current' | 'custom') => setEditLocationMode(value)}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="current" id="edit-current-location" />
                                    <Label htmlFor="edit-current-location" className="font-normal cursor-pointer">
                                        বর্তমান ঠিকানা রাখুন
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="custom" id="edit-custom-location" />
                                    <Label htmlFor="edit-custom-location" className="font-normal cursor-pointer">
                                        নতুন ঠিকানা নির্বাচন করুন
                                    </Label>
                                </div>
                            </RadioGroup>

                            {editLocationMode === 'current' ? (
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">বর্তমান ঠিকানা:</p>
                                    <p className="text-sm font-medium">
                                        {editCurrentLocation || "ঠিকানা পাওয়া যায়নি"}
                                    </p>
                                </div>
                            ) : (
                                <div className="border rounded-lg p-4 space-y-4">
                                    <LocationSelector
                                        value={editCustomLocationData}
                                        onChange={(locationData) => setEditCustomLocationData(locationData)}
                                        onAddressChange={(address) => setEditCustomAddress(address)}
                                    />
                                    {editCustomAddress && (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-xs text-green-700 mb-1">সম্পূর্ণ ঠিকানা:</p>
                                            <p className="text-sm font-medium text-green-900">{editCustomAddress}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-3">
                            <Label>
                                <Upload className="h-4 w-4 inline mr-1" />
                                ছবি
                            </Label>

                            {/* Existing Images */}
                            {editExistingImages.length > 0 && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2">বর্তমান ছবি:</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {editExistingImages.map((img, index) => (
                                            <div key={`existing-${index}`} className="relative group">
                                                <img
                                                    src={img.startsWith('http') ? img : `${API_BASE.replace('/api', '')}${img}`}
                                                    alt={`Image ${index + 1}`}
                                                    className="w-full h-16 object-cover rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setEditExistingImages(prev => prev.filter((_, i) => i !== index))}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Images */}
                            {editNewImages.length > 0 && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2">নতুন ছবি:</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {editNewImages.map((image, index) => (
                                            <div key={`new-${index}`} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`New ${index + 1}`}
                                                    className="w-full h-16 object-cover rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setEditNewImages(prev => prev.filter((_, i) => i !== index))}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload Input */}
                            <Input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        const newImages = Array.from(e.target.files);
                                        setEditNewImages(prev => [...prev, ...newImages]);
                                    }
                                }}
                                className="text-sm"
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleSaveEdit} className="flex-1" disabled={editIsUploading}>
                                {editIsUploading ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        আপলোড হচ্ছে...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        সংরক্ষণ
                                    </>
                                )}
                            </Button>
                            <Button variant="outline" onClick={() => setEditingListing(null)}>
                                বাতিল
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>বিজ্ঞাপন মুছুন</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <p className="text-sm">এই বিজ্ঞাপন স্থায়ীভাবে মুছে যাবে।</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="destructive"
                                onClick={() => showDeleteDialog && handleDelete(showDeleteDialog)}
                                className="flex-1"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                মুছে ফেলুন
                            </Button>
                            <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
                                বাতিল
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
