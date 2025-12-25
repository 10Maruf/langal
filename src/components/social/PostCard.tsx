import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TTSButton } from "@/components/ui/tts-button";
import { Heart, MessageCircle, MoreHorizontal, MapPin, ExternalLink, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SocialPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
    location: string;
    verified?: boolean;
    isExpert?: boolean;
  };
  content: string;
  images: string[];
  type: "general" | "marketplace" | "question" | "advice" | "expert_advice";
  marketplaceLink?: {
    title: string;
    price: number;
    category: string;
  };
  likes: number;
  comments: number;
  postedAt: string;
  liked?: boolean;
}

interface PostCardProps {
  post: SocialPost;
  onLike: (post: SocialPost) => void;
  onComment: (post: SocialPost) => void;
  onMarketplaceClick?: (post: SocialPost) => void;
}

export const PostCard = ({
  post,
  onLike,
  onComment,
  onMarketplaceClick
}: PostCardProps) => {
  const typeColors = {
    general: "bg-blue-50 text-blue-700 border-blue-200",
    marketplace: "bg-green-50 text-green-700 border-green-200",
    question: "bg-yellow-50 text-yellow-700 border-yellow-200",
    advice: "bg-purple-50 text-purple-700 border-purple-200",
    expert_advice: "bg-indigo-50 text-indigo-700 border-indigo-200"
  };

  const typeLabels = {
    general: "সাধারণ",
    marketplace: "বাজার",
    question: "প্রশ্ন",
    advice: "পরামর্শ",
    expert_advice: "বিশেষজ্ঞ পরামর্শ"
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "এখনই";
    if (diffHours < 24) return `${diffHours} ঘন্টা আগে`;
    if (diffDays < 7) return `${diffDays} দিন আগে`;
    return date.toLocaleDateString('bn-BD');
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>
                {post.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{post.author.name}</span>
                {post.author.verified && (
                  <span className="text-green-600 text-xs">✓</span>
                )}
                {post.author.isExpert && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    <UserCheck className="h-3 w-3 mr-1" />
                    বিশেষজ্ঞ
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{post.author.location}</span>
                <span>•</span>
                <span>{formatTime(post.postedAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={typeColors[post.type]}>
              {typeLabels[post.type]}
            </Badge>
            <TTSButton
              text={post.content}
              authorName={post.author.name}
              size="icon"
              variant="ghost"
            />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed">{post.content}</p>



        {/* Images */}
        {post.images.length > 0 && (
          <div className={cn(
            "grid gap-2 rounded-lg overflow-hidden",
            post.images.length === 1 && "grid-cols-1",
            post.images.length === 2 && "grid-cols-2",
            post.images.length >= 3 && "grid-cols-2"
          )}>
            {post.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={cn(
                  "relative bg-muted aspect-square overflow-hidden",
                  post.images.length === 3 && index === 0 && "row-span-2"
                )}
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {post.images.length > 4 && index === 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium">
                    +{post.images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Marketplace Link */}
        {post.marketplaceLink && (
          <Card className="border-2 border-accent/20 bg-accent/5">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">{post.marketplaceLink.title}</h4>
                  <p className="text-lg font-bold text-primary">
                    ৳{post.marketplaceLink.price.toLocaleString('bn-BD')}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {post.marketplaceLink.category}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMarketplaceClick?.(post)}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  দেখুন
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post)}
              className={cn(
                "h-8 px-2",
                post.liked && "text-red-500"
              )}
            >
              <Heart className={cn(
                "h-4 w-4 mr-1",
                post.liked && "fill-current"
              )} />
              <span className="text-xs">{post.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment(post)}
              className="h-8 px-2"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{post.comments}</span>
            </Button>


          </div>
        </div>
      </CardFooter>
    </Card>
  );
};