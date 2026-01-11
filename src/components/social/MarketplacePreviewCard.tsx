import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Tag, ExternalLink, ShoppingCart } from "lucide-react";
import { MarketplaceReference } from "@/types/social";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface MarketplacePreviewCardProps {
  marketplaceData: MarketplaceReference;
}

export const MarketplacePreviewCard = ({ marketplaceData }: MarketplacePreviewCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isExpert = user?.type === 'expert';

  const handleViewDetails = () => {
    if (isExpert) return; // Prevent navigation for experts
    navigate(`/central-marketplace?highlight=${marketplaceData.listing_id}`);
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="p-3 bg-primary/10 border-b flex items-center gap-2">
        <ShoppingCart className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-primary">বাজার পণ্য</span>
      </div>
      
      <div className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          {marketplaceData.images && marketplaceData.images.length > 0 && (
            <div className="flex-shrink-0">
              <img
                src={marketplaceData.images[0]}
                alt={marketplaceData.title}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Product Details */}
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="font-bold text-lg line-clamp-2 text-foreground">
              {marketplaceData.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {marketplaceData.description}
            </p>

            {/* Price and Info Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="font-bold text-base px-3 py-1">
                ৳{marketplaceData.price.toLocaleString()}
              </Badge>
              
              {marketplaceData.categoryNameBn && (
                <Badge variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {marketplaceData.categoryNameBn}
                </Badge>
              )}
              
              {marketplaceData.listingTypeBn && (
                <Badge variant="outline" className="text-xs">
                  {marketplaceData.listingTypeBn}
                </Badge>
              )}
            </div>

            {/* Location */}
            {marketplaceData.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{marketplaceData.location}</span>
              </div>
            )}

            {/* View Details Button - Hidden for experts */}
            {!isExpert && (
              <Button
                variant="default"
                size="sm"
                className="mt-2 w-full sm:w-auto"
                onClick={handleViewDetails}
              >
                বিস্তারিত দেখুন
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
