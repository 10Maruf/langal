import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { EnhancedPostCard } from "@/components/social/EnhancedPostCard";
import { CreatePost } from "@/components/social/CreatePost";
import { PersonalPostManager } from "@/components/social/PersonalPostManager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Plus,
    TrendingUp,
    Users,
    Zap,
    MessageSquare,
    UserCheck,
    Filter,
    ArrowLeft,
    Settings,
    User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { socialFeedService } from "@/services/socialFeedService";
import { SocialPost, FEED_FILTERS } from "@/types/social";

interface CentralSocialFeedProps {
    showHeader?: boolean;
}

const CentralSocialFeed = ({ showHeader = true }: CentralSocialFeedProps) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();

    // State management
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [showPostManager, setShowPostManager] = useState(false);
    const [feedFilter, setFeedFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());

    // Initialize service and load posts
    useEffect(() => {
        loadPosts();
    }, [user]); // Reload when user changes

    // Load posts based on filter
    const loadPosts = async () => {
        setIsLoading(true);
        try {
            const userId = user?.user_id || (user?.id ? parseInt(user.id) : undefined);
            const fetchedPosts = await socialFeedService.getPosts(1, 10, userId);
            // Filter locally for now since backend doesn't support filtering yet
            const filtered = feedFilter === "all" 
                ? fetchedPosts 
                : fetchedPosts.filter(p => p.type === feedFilter);
            setPosts(filtered);
        } catch (error) {
            console.error("Failed to load posts", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Reload posts when filter changes
    useEffect(() => {
        loadPosts();
    }, [feedFilter, user?.type]);

    // Handle new post creation
    const handleCreatePost = async (postData: any) => {
        const newPost = await socialFeedService.createPost(postData);
        if (newPost) {
            setPosts([newPost, ...posts]);
            setShowCreatePost(false);
            toast({
                title: "পোস্ট করা হয়েছে",
                description: "আপনার পোস্ট সফলভাবে প্রকাশিত হয়েছে।",
            });
        }
    };

    // Handle post like
    const handleLike = async (post: SocialPost) => {
        const userId = user?.user_id || (user?.id ? parseInt(user.id) : null);
        if (!userId) return;
        
        // Prevent multiple simultaneous like requests for the same post
        if (likingPosts.has(post.id)) return;
        
        // Mark this post as being liked
        setLikingPosts(prev => new Set(prev).add(post.id));
        
        // Optimistic update
        const newLikedState = !post.liked;
        const newLikesCount = post.likes + (newLikedState ? 1 : -1);
        
        setPosts(posts.map(p => {
            if (p.id === post.id) {
                return {
                    ...p,
                    liked: newLikedState,
                    likes: newLikesCount
                };
            }
            return p;
        }));
        
        try {
            const result = await socialFeedService.toggleLike(post.id, userId);
            
            // Sync with server response
            if (result.success) {
                setPosts(prevPosts => prevPosts.map(p => {
                    if (p.id === post.id) {
                        return {
                            ...p,
                            liked: result.liked,
                            likes: result.liked ? newLikesCount : (newLikedState ? newLikesCount - 2 : newLikesCount)
                        };
                    }
                    return p;
                }));
            } else {
                // Revert on failure
                setPosts(prevPosts => prevPosts.map(p => {
                    if (p.id === post.id) {
                        return {
                            ...p,
                            liked: post.liked,
                            likes: post.likes
                        };
                    }
                    return p;
                }));
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert on error
            setPosts(prevPosts => prevPosts.map(p => {
                if (p.id === post.id) {
                    return {
                        ...p,
                        liked: post.liked,
                        likes: post.likes
                    };
                }
                return p;
            }));
        } finally {
            // Remove from liking set
            setLikingPosts(prev => {
                const newSet = new Set(prev);
                newSet.delete(post.id);
                return newSet;
            });
        }
    };



    // Handle marketplace click
    const handleMarketplaceClick = (post: SocialPost) => {
        toast({
            title: "বাজারে যাচ্ছে",
            description: "বাজার পেজে নিয়ে যাওয়া হচ্ছে...",
        });
        navigate("/central-marketplace");
    };

    // Handle post delete
    const handleDeletePost = async (postId: string) => {
        const userId = user?.user_id || (user?.id ? parseInt(user.id) : undefined);
        const success = await socialFeedService.deletePost(postId, userId);
        if (success) {
            setPosts(posts.filter(p => p.id !== postId));
            toast({
                title: "পোস্ট মুছে ফেলা হয়েছে",
                description: "আপনার পোস্ট সফলভাবে মুছে ফেলা হয়েছে।",
            });
        }
    };

    // Handle post update
    const handleUpdatePost = async (postId: string, updates: Partial<SocialPost>) => {
        // If only updating reported/reports, just update locally (API already called)
        if ('reported' in updates && Object.keys(updates).length <= 2) {
            setPosts(posts.map(p => p.id === postId ? { ...p, ...updates } : p));
            return;
        }
        
        const userId = user?.user_id || (user?.id ? parseInt(user.id) : undefined);
        const result = await socialFeedService.updatePost(postId, updates, userId);
        if (result) {
            // Update locally with the changes
            setPosts(posts.map(p => p.id === postId ? { ...p, ...updates } : p));
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
                return "কৃষি ফিড ও পরামর্শ";
            case "customer":
                return "কৃষি সম্প্রদায় ফিড";
            case "farmer":
            default:
                return "কৃষি ফিড";
        }
    };

    // Get create post button text
    const getCreateButtonText = () => {
        switch (user?.type) {
            case "expert":
                return "পরামর্শ দিন";
            case "customer":
                return "প্রশ্ন করুন";
            case "farmer":
            default:
                return "পোস্ট করুন";
        }
    };

    // Filter available filters based on user type
    const availableFilters = FEED_FILTERS.filter(filter =>
        !filter.userTypes || filter.userTypes.includes(user?.type || "farmer")
    );

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
                                <h1 className="text-xl font-bold">{getPageTitle()}</h1>

                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowPostManager(true)}
                            >
                                <User className="h-4 w-4 mr-1" />
                                আমার পোস্ট
                            </Button>
                            <Button size="sm" onClick={() => setShowCreatePost(true)}>
                                <Plus className="h-4 w-4 mr-1" />
                                {getCreateButtonText()}
                            </Button>
                        </div>
                    </div>

                    {/* Feed Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {availableFilters.map((filter) => {
                            const IconComponent = filter.icon === "Users" ? Users :
                                filter.icon === "TrendingUp" ? TrendingUp :
                                    filter.icon === "Zap" ? Zap :
                                        filter.icon === "MessageSquare" ? MessageSquare :
                                            filter.icon === "UserCheck" ? UserCheck : Users;

                            const isExpertAdvice = filter.id === 'expert_advice';
                            const isActive = feedFilter === filter.id;

                            return (
                                <Button
                                    key={filter.id}
                                    variant={isActive ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setFeedFilter(filter.id)}
                                    className={`flex-shrink-0 ${isExpertAdvice && !isActive
                                        ? 'border-blue-300 text-blue-700 hover:bg-blue-50'
                                        : ''
                                        }`}
                                >
                                    <IconComponent className="h-4 w-4 mr-1" />
                                    {filter.label}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4 p-4 max-w-4xl mx-auto">
                    {isLoading ? (
                        <div className="space-y-4 max-w-2xl mx-auto">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="bg-muted h-32 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12 max-w-2xl mx-auto">
                            <div className="text-4xl mb-4">📝</div>
                            <h3 className="text-lg font-medium mb-2">কোন পোস্ট নেই</h3>
                            <p className="text-muted-foreground mb-4">
                                {feedFilter === "all"
                                    ? "প্রথম পোস্ট করুন এবং কমিউনিটির সাথে শেয়ার করুন!"
                                    : "এই ক্যাটেগরিতে কোন পোস্ট নেই। অন্য ক্যাটেগরি দেখুন।"
                                }
                            </p>
                            <Button onClick={() => setShowCreatePost(true)}>
                                <Plus className="h-4 w-4 mr-1" />
                                {getCreateButtonText()}
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {posts.map((post) => (
                                <div key={post.id} className="max-w-2xl mx-auto w-full">
                                    <EnhancedPostCard
                                        post={post}
                                        onLike={handleLike}

                                        onMarketplaceClick={handleMarketplaceClick}
                                        onDelete={handleDeletePost}
                                        onUpdate={handleUpdatePost}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Post Dialog */}
                <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
                        <DialogHeader className="sr-only">
                            <DialogTitle>নতুন পোস্ট তৈরি করুন</DialogTitle>
                        </DialogHeader>
                        <CreatePost
                            onPost={handleCreatePost}
                            onCancel={() => setShowCreatePost(false)}
                        />
                    </DialogContent>
                </Dialog>

                {/* Personal Post Manager Dialog */}
                <Dialog open={showPostManager} onOpenChange={setShowPostManager}>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
                        <DialogHeader className="sr-only">
                            <DialogTitle>আমার পোস্ট ম্যানেজার</DialogTitle>
                        </DialogHeader>
                        <PersonalPostManager onClose={() => setShowPostManager(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default CentralSocialFeed;