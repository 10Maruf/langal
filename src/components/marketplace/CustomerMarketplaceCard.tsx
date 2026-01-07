import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TTSButton } from "@/components/ui/tts-button";
import { MapPin, Heart, MessageCircle, Star, ShoppingCart } from "lucide-react";
import { cn, getAzureImageUrl } from "@/lib/utils";

export interface CustomerMarketplaceItem {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    category: "machinery" | "crops" | "seeds" | "fertilizer" | "vegetables" | "fish" | "dairy" | "meat" | "equipment";
    type: "sell" | "rent" | "buy";
    location: string;
    seller: {
        name: string;
        rating: number;
        verified: boolean;
    };
    images: string[];
    postedAt: string;
    featured?: boolean;
    saved?: boolean;
}

interface CustomerMarketplaceCardProps {
    item: CustomerMarketplaceItem;
    onContact?: (item: CustomerMarketplaceItem) => void;
    onSave?: (item: CustomerMarketplaceItem) => void;
    onClick?: (item: CustomerMarketplaceItem) => void;
}

export const CustomerMarketplaceCard = ({ item, onContact, onSave, onClick }: CustomerMarketplaceCardProps) => {
    const categoryColors = {
        machinery: "bg-blue-50 text-blue-700 border-blue-200",
        crops: "bg-green-50 text-green-700 border-green-200",
        seeds: "bg-yellow-50 text-yellow-700 border-yellow-200",
        fertilizer: "bg-purple-50 text-purple-700 border-purple-200",
        vegetables: "bg-emerald-50 text-emerald-700 border-emerald-200",
        fish: "bg-cyan-50 text-cyan-700 border-cyan-200",
        dairy: "bg-orange-50 text-orange-700 border-orange-200",
        meat: "bg-red-50 text-red-700 border-red-200",
        equipment: "bg-gray-50 text-gray-700 border-gray-200"
    };

    const categoryLabels = {
        machinery: "যন্ত্রপাতি",
        crops: "ফসল",
        seeds: "বীজ",
        fertilizer: "সার",
        vegetables: "সবজি",
        fish: "মাছ",
        dairy: "দুগ্ধ",
        meat: "মাংস",
        equipment: "যন্ত্র"
    };

    const typeLabels = {
        sell: "বিক্রয়",
        rent: "ভাড়া",
        buy: "ক্রয়"
    };

    const typeColors = {
        sell: "bg-green-50 text-green-700 border-green-200",
        rent: "bg-blue-50 text-blue-700 border-blue-200",
        buy: "bg-orange-50 text-orange-700 border-orange-200"
    };

    const handleCardClick = () => {
        if (onClick) {
            onClick(item);
        }
    };

    const handleContact = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onContact) {
            onContact(item);
        }
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onSave) {
            onSave(item);
        }
    };

    return (
        <Card
            className={cn(
                "overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer",
                item.featured && "ring-2 ring-accent/50"
            )}
            onClick={handleCardClick}
        >
            <CardHeader className="p-3 pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className={categoryColors[item.category]}>
                            {categoryLabels[item.category]}
                        </Badge>
                        <Badge variant="secondary" className={typeColors[item.type]}>
                            {typeLabels[item.type]}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                        <TTSButton
                            text={`${item.title}। ${item.description}। দাম ${item.price} টাকা। স্থান ${item.location}। বিক্রেতা ${item.seller.name}`}
                            authorName={item.seller.name}
                            size="icon"
                            variant="ghost"
                        />
                        {onSave && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSave}
                                className="h-8 w-8 p-0"
                            >
                                <Heart className={cn(
                                    "h-4 w-4",
                                    item.saved && "fill-red-500 text-red-500"
                                )} />
                            </Button>
                        )}
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
                            <span className="text-2xl">
                                {item.type === "buy" ? "🛒" : "🏷️"}
                            </span>
                        </div>
                    )}
                </div>

                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-bold text-primary">
                        ৳{item.price.toLocaleString('bn-BD')}
                        {item.type === "rent" && <span className="text-xs text-muted-foreground">/দিন</span>}
                        {item.type === "buy" && <span className="text-xs text-muted-foreground">/কেজি</span>}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{item.location}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{item.seller.name}</span>
                        {item.seller.verified && <span className="text-green-600">✓</span>}
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{item.seller.rating}</span>
                    </div>
                </div>
            </CardContent>

            {onContact && (
                <CardFooter className="p-3 pt-0">
                    <Button
                        onClick={handleContact}
                        className="w-full h-8 text-xs"
                        size="sm"
                    >
                        {item.type === "buy" ? (
                            <>
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                বিক্রেতার সাথে যোগাযোগ
                            </>
                        ) : (
                            <>
                                <MessageCircle className="h-3 w-3 mr-1" />
                                যোগাযোগ করুন
                            </>
                        )}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};
