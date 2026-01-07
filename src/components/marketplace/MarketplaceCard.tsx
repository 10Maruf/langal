import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TTSButton } from "@/components/ui/tts-button";
import { MapPin, Heart, MessageCircle, Star, Clock } from "lucide-react";
import { cn, getAzureImageUrl } from "@/lib/utils";
import { englishToBangla } from "@/lib/banglaUtils";

// Helper function to get Bengali relative time
const getBanglaRelativeTime = (dateString: string): string => {
  if (!dateString) return "সম্প্রতি";
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return "সম্প্রতি";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // If date is in the future or very recent
  if (diffMs < 0) return "এইমাত্র";
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Check if same day
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (diffSecs < 60) return "এইমাত্র";
  if (diffMins < 60) return `${englishToBangla(diffMins)} মিনিট আগে`;
  if (isToday) return `${englishToBangla(diffHours)} ঘণ্টা আগে`;
  if (isYesterday) return "গতকাল";
  if (diffDays < 7) return `${englishToBangla(diffDays)} দিন আগে`;
  if (diffDays < 30) return `${englishToBangla(diffWeeks)} সপ্তাহ আগে`;
  if (diffMonths < 12) return `${englishToBangla(diffMonths || 1)} মাস আগে`;
  return `${englishToBangla(diffYears || 1)} বছর আগে`;
};

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: "machinery" | "crops" | "seeds" | "fertilizer" | "livestock" | "tools" | "other";
  category_name_bn?: string;
  type: "sell" | "rent" | "buy" | "service";
  listing_type_bn?: string;
  location: string;
  seller: {
    name: string;
    avatar?: string;
    rating: number;
    verified: boolean;
  };
  images: string[];
  postedAt: string;
  featured?: boolean;
  saved?: boolean;
}

interface MarketplaceCardProps {
  item: MarketplaceItem;
  onContact: (item: MarketplaceItem) => void;
  onSave: (item: MarketplaceItem) => void;
}

export const MarketplaceCard = ({ item, onContact, onSave }: MarketplaceCardProps) => {
  // Vibrant category colors
  const categoryColors = {
    machinery: "bg-blue-100 text-blue-800 border-blue-300 font-medium",
    crops: "bg-emerald-100 text-emerald-800 border-emerald-300 font-medium",
    seeds: "bg-amber-100 text-amber-800 border-amber-300 font-medium",
    fertilizer: "bg-violet-100 text-violet-800 border-violet-300 font-medium",
    livestock: "bg-orange-100 text-orange-800 border-orange-300 font-medium",
    tools: "bg-cyan-100 text-cyan-800 border-cyan-300 font-medium",
    other: "bg-slate-100 text-slate-700 border-slate-300 font-medium"
  };

  // Type badge colors
  const typeColors = {
    sell: "bg-green-500 text-white hover:bg-green-600",
    rent: "bg-blue-500 text-white hover:bg-blue-600",
    buy: "bg-rose-500 text-white hover:bg-rose-600",
    service: "bg-purple-500 text-white hover:bg-purple-600"
  };

  const categoryLabels = {
    machinery: "যন্ত্রপাতি",
    crops: "ফসল",
    seeds: "বীজ",
    fertilizer: "সার",
    livestock: "গবাদি পশু",
    tools: "হাতিয়ার",
    other: "অন্যান্য"
  };

  const typeLabels = {
    sell: "বিক্রয়",
    rent: "ভাড়া",
    buy: "কিনতে চাই",
    service: "সেবা"
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-md",
      item.featured && "ring-2 ring-accent/50"
    )}>
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={categoryColors[item.category]}>
              {item.category_name_bn || categoryLabels[item.category]}
            </Badge>
            <Badge className={typeColors[item.type]}>
              {item.listing_type_bn || typeLabels[item.type]}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <TTSButton
              text={`${item.title}। ${item.description}। দাম ${item.price} টাকা। স্থান ${item.location}। বিক্রেতা ${item.seller.name}`}
              authorName={item.seller.name}
              size="icon"
              variant="ghost"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave(item)}
              className="h-8 w-8 p-0"
            >
              <Heart className={cn(
                "h-4 w-4",
                item.saved && "fill-red-500 text-red-500"
              )} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
          {item.images.length > 0 ? (
            <img
              src={getAzureImageUrl(item.images[0]) || item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-muted-foreground"><span class="text-2xl">🏷️</span></div>';
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <span className="text-2xl">🏷️</span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-bold text-primary">
            ৳{englishToBangla(item.price.toLocaleString('en-US'))}
            {item.type === "rent" && <span className="text-xs text-muted-foreground">/দিন</span>}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{item.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={getAzureImageUrl(item.seller.avatar)} />
              <AvatarFallback className="text-xs">{item.seller.name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{item.seller.name}</span>
            {item.seller.verified && <span className="text-green-600">✓</span>}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{item.seller.rating}</span>
          </div>
        </div>

        {/* Posted time in Bengali */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 pt-2 border-t">
          <Clock className="h-3 w-3" />
          <span>{getBanglaRelativeTime(item.postedAt)}</span>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0">
        <Button
          onClick={() => onContact(item)}
          className="w-full h-8 text-xs"
          size="sm"
        >
          <MessageCircle className="h-3 w-3 mr-1" />
          যোগাযোগ করুন
        </Button>
      </CardFooter>
    </Card>
  );
};