import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  X,
  ChevronDown,
  ChevronUp,
  Store,
  Wheat,
  Tractor,
  FlaskConical,
  Sprout,
  PawPrint,
  Wrench,
  Package,
  Tag,
  RefreshCw,
  ShoppingCart,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ListingFilter } from "@/types/marketplace";

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
  'crops': <Wheat className="h-4 w-4" />,
  'machinery': <Tractor className="h-4 w-4" />,
  'fertilizer': <FlaskConical className="h-4 w-4" />,
  'seeds': <Sprout className="h-4 w-4" />,
  'livestock': <PawPrint className="h-4 w-4" />,
  'tools': <Wrench className="h-4 w-4" />,
  'other': <Package className="h-4 w-4" />,
};

interface Category {
  category_id: number;
  category_name: string;
  category_name_bn: string;
  icon_url: string;
}

interface LocationOption {
  value: string;
  label: string;
}

interface MarketplaceFiltersProps {
  filters: ListingFilter;
  onFiltersChange: (filters: Partial<ListingFilter>) => void;
  onClearFilters: () => void;
}

// API Base URL
const API_BASE = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env?.VITE_API_BASE?.replace(/\/$/, '') || 'http://localhost:8000/api';

export const MarketplaceFilters = ({
  filters,
  onFiltersChange,
  onClearFilters
}: MarketplaceFiltersProps) => {
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [divisions, setDivisions] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [upazilas, setUpazilas] = useState<LocationOption[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // Types - সব ধরন (with Lucide icons)
  const types = [
    { value: "all", label: "সব ধরন", icon: null },
    { value: "sell", label: "বিক্রয়", icon: <Tag className="h-3.5 w-3.5" /> },
    { value: "rent", label: "ভাড়া", icon: <RefreshCw className="h-3.5 w-3.5" /> },
    { value: "buy", label: "কিনতে চাই", icon: <ShoppingCart className="h-3.5 w-3.5" /> },
    { value: "service", label: "সেবা", icon: <Settings className="h-3.5 w-3.5" /> }
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "নতুন প্রথমে" },
    { value: "price_low", label: "কম দাম প্রথমে" },
    { value: "price_high", label: "বেশি দাম প্রথমে" }
  ];

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/marketplace/categories`);
        const data = await response.json();
        if (data.success && data.data) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch divisions on mount
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await fetch(`${API_BASE}/locations/divisions`);
        const data = await response.json();
        if (data.success && data.data) {
          setDivisions(data.data.map((d: { division_bn: string }) => ({
            value: d.division_bn,
            label: d.division_bn
          })));
        }
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    };
    fetchDivisions();
  }, []);

  // Fetch districts when division changes
  useEffect(() => {
    if (!filters.division || filters.division === 'all') {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await fetch(`${API_BASE}/locations/districts?division_bn=${encodeURIComponent(filters.division)}`);
        const data = await response.json();
        if (data.success && data.data) {
          setDistricts(data.data.map((d: { district_bn: string }) => ({
            value: d.district_bn,
            label: d.district_bn
          })));
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchDistricts();
  }, [filters.division]);

  // Fetch upazilas when district changes
  useEffect(() => {
    if (!filters.district || filters.district === 'all') {
      setUpazilas([]);
      return;
    }

    const fetchUpazilas = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await fetch(`${API_BASE}/locations/upazilas?district_bn=${encodeURIComponent(filters.district)}`);
        const data = await response.json();
        if (data.success && data.data) {
          setUpazilas(data.data.map((u: { upazila_bn: string }) => ({
            value: u.upazila_bn,
            label: u.upazila_bn
          })));
        }
      } catch (error) {
        console.error('Error fetching upazilas:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchUpazilas();
  }, [filters.district]);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ category: 'all', categoryId: null });
    } else {
      const cat = categories.find(c => c.category_name === value);
      onFiltersChange({
        category: value,
        categoryId: cat?.category_id || null
      });
    }
  };

  // Check if filters are active
  const hasActiveFilters = filters.search ||
    (filters.category && filters.category !== "all") ||
    (filters.type && filters.type !== "all") ||
    (filters.division && filters.division !== "all") ||
    (filters.district && filters.district !== "all") ||
    (filters.upazila && filters.upazila !== "all");

  // Get active location text
  const getLocationText = () => {
    if (filters.upazila && filters.upazila !== 'all') return filters.upazila;
    if (filters.district && filters.district !== 'all') return filters.district;
    if (filters.division && filters.division !== 'all') return filters.division;
    return "এলাকা বাছুন";
  };

  return (
    <div className="bg-card border-b">
      {/* Search Bar - সর্বদা দেখাবে */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="খুঁজুন... (ধান, ট্রাক্টর, সার...)"
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="pl-10 h-11 text-base rounded-full bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ search: "" })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Filters Row - একটাই সারিতে সব */}
      <div className="p-3 flex gap-2 overflow-x-auto">
        {/* Category Select */}
        <Select
          value={filters.category || "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="min-w-[120px] h-9 rounded-full bg-muted/30 border-muted">
            <SelectValue placeholder="ক্যাটেগরি" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <span className="flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                সব ক্যাটেগরি
              </span>
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.category_id} value={cat.category_name}>
                <span className="flex items-center gap-2">
                  <span className="text-primary">{categoryIcons[cat.category_name] || <Package className="h-4 w-4" />}</span>
                  {cat.category_name_bn}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type Select */}
        <Select
          value={filters.type || "all"}
          onValueChange={(value) => onFiltersChange({ type: value })}
        >
          <SelectTrigger className="min-w-[100px] h-9 rounded-full bg-muted/30 border-muted">
            <SelectValue placeholder="ধরন" />
          </SelectTrigger>
          <SelectContent>
            {types.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <span className="flex items-center gap-2">
                  {type.icon && <span className="text-primary">{type.icon}</span>}
                  {type.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location Button - Toggle location filters */}
        <Button
          variant={showLocationFilter ? "default" : "outline"}
          size="sm"
          onClick={() => setShowLocationFilter(!showLocationFilter)}
          className={cn(
            "rounded-full h-9 gap-1",
            (filters.division !== 'all' || filters.district !== 'all' || filters.upazila !== 'all') && "bg-primary/10 border-primary text-primary"
          )}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span className="max-w-[80px] truncate">{getLocationText()}</span>
          {showLocationFilter ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>

        {/* Sort Select */}
        <Select
          value={filters.sortBy || "newest"}
          onValueChange={(value) => onFiltersChange({ sortBy: value })}
        >
          <SelectTrigger className="min-w-[110px] h-9 rounded-full bg-muted/30 border-muted">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((sort) => (
              <SelectItem key={sort.value} value={sort.value}>
                {sort.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="rounded-full h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4 mr-1" />
            মুছুন
          </Button>
        )}
      </div>

      {/* Location Filters - Expandable */}
      {showLocationFilter && (
        <div className="px-3 pb-3 space-y-2 border-t pt-3 bg-muted/20">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> এলাকা অনুযায়ী ফিল্টার করুন
          </p>

          <div className="flex gap-2 flex-wrap">
            {/* Division */}
            <Select
              value={filters.division || "all"}
              onValueChange={(value) => {
                onFiltersChange({
                  division: value,
                  district: 'all',
                  upazila: 'all'
                });
              }}
            >
              <SelectTrigger className="w-[140px] h-9 rounded-lg">
                <SelectValue placeholder="বিভাগ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব বিভাগ</SelectItem>
                {divisions.map((div) => (
                  <SelectItem key={div.value} value={div.value}>
                    {div.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* District - Show only if division selected */}
            {filters.division && filters.division !== 'all' && (
              <Select
                value={filters.district || "all"}
                onValueChange={(value) => {
                  onFiltersChange({ district: value, upazila: 'all' });
                }}
                disabled={isLoadingLocations}
              >
                <SelectTrigger className="w-[140px] h-9 rounded-lg">
                  <SelectValue placeholder={isLoadingLocations ? "লোড হচ্ছে..." : "জেলা"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব জেলা</SelectItem>
                  {districts.map((dist) => (
                    <SelectItem key={dist.value} value={dist.value}>
                      {dist.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Upazila - Show only if district selected */}
            {filters.district && filters.district !== 'all' && (
              <Select
                value={filters.upazila || "all"}
                onValueChange={(value) => onFiltersChange({ upazila: value })}
                disabled={isLoadingLocations}
              >
                <SelectTrigger className="w-[140px] h-9 rounded-lg">
                  <SelectValue placeholder={isLoadingLocations ? "লোড হচ্ছে..." : "উপজেলা"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব উপজেলা</SelectItem>
                  {upazilas.map((upz) => (
                    <SelectItem key={upz.value} value={upz.value}>
                      {upz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Badges */}
      {hasActiveFilters && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {filters.search && (
            <Badge variant="secondary" className="text-xs rounded-full pl-2 pr-1 py-0.5">
              "{filters.search}"
              <button
                onClick={() => onFiltersChange({ search: "" })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.category && filters.category !== "all" && (
            <Badge variant="secondary" className="text-xs rounded-full pl-2 pr-1 py-0.5">
              {categories.find(c => c.category_name === filters.category)?.category_name_bn || filters.category}
              <button
                onClick={() => onFiltersChange({ category: "all", categoryId: null })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.type && filters.type !== "all" && (
            <Badge variant="secondary" className="text-xs rounded-full pl-2 pr-1 py-0.5">
              {types.find(t => t.value === filters.type)?.label}
              <button
                onClick={() => onFiltersChange({ type: "all" })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.upazila && filters.upazila !== "all" && (
            <Badge variant="secondary" className="text-xs rounded-full pl-2 pr-1 py-0.5 bg-primary/10 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {filters.upazila}
              <button
                onClick={() => onFiltersChange({ upazila: "all" })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.district && filters.district !== "all" && (!filters.upazila || filters.upazila === "all") && (
            <Badge variant="secondary" className="text-xs rounded-full pl-2 pr-1 py-0.5 bg-primary/10 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {filters.district}
              <button
                onClick={() => onFiltersChange({ district: "all" })}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketplaceFilters;