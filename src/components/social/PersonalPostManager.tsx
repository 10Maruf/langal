import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from '@/services/api';
import {
    Edit2,
    Trash2,
    Search,
    Filter,
    Eye,
    Heart,
    MessageCircle,
    TrendingUp,
    Users,
    Zap,
    UserCheck,
    Plus,
    Calendar,
    BarChart3,
    Flag
} from "lucide-react";
import { cn, getAzureImageUrl } from "@/lib/utils";
import { SocialPost } from "@/types/social";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { socialFeedService } from "@/services/socialFeedService";
import { EnhancedPostCard } from "./EnhancedPostCard";

interface PersonalPostManagerProps {
    onClose?: () => void;
}

export const PersonalPostManager = ({ onClose }: PersonalPostManagerProps) => {
    const { user } = useAuth();
    const { toast } = useToast();

    // State management
    const [myPosts, setMyPosts] = useState<SocialPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<SocialPost[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
    const [editedContent, setEditedContent] = useState("");
    const [editedType, setEditedType] = useState("general");
    const [editedImages, setEditedImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [isUploadingEdit, setIsUploadingEdit] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
    const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
    const [activeTab, setActiveTab] = useState("posts");

    // Load user's posts
    useEffect(() => {
        const loadUserPosts = async () => {
            if (user) {
                const userId = user.user_id || parseInt(user.id);
                const userPosts = await socialFeedService.getUserPosts(user.id, userId);
                setMyPosts(userPosts);
                setFilteredPosts(userPosts);
            }
        };
        loadUserPosts();
    }, [user]);

    // Filter posts based on search and type
    useEffect(() => {
        let filtered = myPosts;

        // Filter by type
        if (filterType !== "all") {
            filtered = filtered.filter(post => post.type === filterType);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(post =>
                post.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredPosts(filtered);
    }, [myPosts, filterType, searchQuery]);

    // Handle post edit
    const handleEditPost = (post: SocialPost) => {
        setEditingPost(post);
        setEditedContent(post.content);
        setEditedType(post.type);
        setEditedImages(post.images || []);
        setNewImages([]);
    };

    // Handle image upload for edit
    const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewImages([...newImages, ...Array.from(e.target.files)]);
        }
    };

    // Remove existing image from edit
    const removeExistingImage = (index: number) => {
        setEditedImages(editedImages.filter((_, i) => i !== index));
    };

    // Remove new image from edit
    const removeNewImage = (index: number) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    // Save edited post
    const handleSaveEdit = async () => {
        if (editingPost) {
            setIsUploadingEdit(true);
            try {
                let finalImages = [...editedImages];

                // Upload new images if any
                if (newImages.length > 0) {
                    const formData = new FormData();
                    newImages.forEach((img) => {
                        formData.append('images[]', img);
                    });

                    const response = await fetch(`${API_URL}/social/upload-images`, {
                        method: 'POST',
                        body: formData,
                    });

                    const data = await response.json();
                    if (data.success) {
                        finalImages = [...finalImages, ...data.urls];
                    }
                }

                const updatedPost = await socialFeedService.updatePost(
                    editingPost.id,
                    {
                        content: editedContent,
                        type: editedType as any,
                        images: finalImages
                    }
                );

                if (updatedPost) {
                    setMyPosts(myPosts.map(p =>
                        p.id === editingPost.id ? updatedPost : p
                    ));
                    setEditingPost(null);
                    setEditedContent("");
                    setNewImages([]);

                    toast({
                        title: "পোস্ট আপডেট হয়েছে",
                        description: "আপনার পোস্ট সফলভাবে আপডেট করা হয়েছে।",
                    });
                }
            } catch (error) {
                console.error('Error updating post:', error);
                toast({
                    title: "ত্রুটি",
                    description: "পোস্ট আপডেট করতে সমস্যা হয়েছে।",
                    variant: "destructive"
                });
            } finally {
                setIsUploadingEdit(false);
            }
        }
    };

    // Handle post delete
    const handleDeletePost = async (postId: string) => {
        const success = await socialFeedService.deletePost(postId);

        if (success) {
            setMyPosts(myPosts.filter(p => p.id !== postId));
            setShowDeleteDialog(null);

            toast({
                title: "পোস্ট মুছে ফেলা হয়েছে",
                description: "আপনার পোস্ট সফলভাবে মুছে ফেলা হয়েছে।",
            });
        }
    };

    // Handle post like
    const handleLike = async (post: SocialPost) => {
        if (!user) return;

        const newLikedState = !post.liked;
        const newLikesCount = post.likes + (newLikedState ? 1 : -1);

        // Optimistic update
        const updatePosts = (posts: SocialPost[]) =>
            posts.map(p => p.id === post.id
                ? { ...p, liked: newLikedState, likes: newLikesCount }
                : p
            );

        setMyPosts(updatePosts(myPosts));
        setFilteredPosts(updatePosts(filteredPosts));
        if (selectedPost && selectedPost.id === post.id) {
            setSelectedPost({ ...selectedPost, liked: newLikedState, likes: newLikesCount });
        }

        // API call
        const userId = user.user_id || parseInt(user.id);
        const result = await socialFeedService.toggleLike(post.id, userId);

        if (!result.success) {
            // Revert if failed
            const revertPosts = (posts: SocialPost[]) =>
                posts.map(p => p.id === post.id
                    ? { ...p, liked: !newLikedState, likes: post.likes }
                    : p
                );
            setMyPosts(revertPosts(myPosts));
            setFilteredPosts(revertPosts(filteredPosts));
            if (selectedPost && selectedPost.id === post.id) {
                setSelectedPost({ ...selectedPost, liked: !newLikedState, likes: post.likes });
            }
        } else {
            // Ensure state matches backend
            if (result.liked !== newLikedState) {
                const syncPosts = (posts: SocialPost[]) =>
                    posts.map(p => p.id === post.id
                        ? { ...p, liked: result.liked, likes: post.likes + (result.liked ? 1 : -1) } // Approximate count adjustment
                        : p
                    );
                setMyPosts(syncPosts(myPosts));
                setFilteredPosts(syncPosts(filteredPosts));
                if (selectedPost && selectedPost.id === post.id) {
                    setSelectedPost({ ...selectedPost, liked: result.liked, likes: post.likes + (result.liked ? 1 : -1) });
                }
            }
        }
    };

    // Handle post update from EnhancedPostCard
    const handleUpdatePost = (postId: string, updates: Partial<SocialPost>) => {
        const updatePosts = (posts: SocialPost[]) =>
            posts.map(p => p.id === postId ? { ...p, ...updates } : p);

        setMyPosts(updatePosts(myPosts));
        setFilteredPosts(updatePosts(filteredPosts));
        if (selectedPost && selectedPost.id === postId) {
            setSelectedPost({ ...selectedPost, ...updates });
        }
    };

    // Get post statistics
    const getPostStats = () => {
        const totalReports = myPosts.reduce((sum, post) => sum + (post.reports || 0), 0);

        // জনপ্রিয় পোস্ট = সবচেয়ে বেশি engagement (likes + comments)
        const mostPopularPost = myPosts.length > 0
            ? myPosts.reduce((max, post) => {
                const maxEngagement = max.likes + max.comments;
                const postEngagement = post.likes + post.comments;
                return postEngagement > maxEngagement ? post : max;
            }, myPosts[0])
            : null;

        return {
            totalPosts: myPosts.length,
            totalReports,
            mostPopularPost,
            postsByType: {
                general: myPosts.filter(p => p.type === "general").length,
                marketplace: myPosts.filter(p => p.type === "marketplace").length,
                question: myPosts.filter(p => p.type === "question").length,
                advice: myPosts.filter(p => p.type === "advice").length,
                expert_advice: myPosts.filter(p => p.type === "expert_advice").length,
            }
        };
    };

    const stats = getPostStats();

    const typeLabels = {
        general: "সাধারণ",
        marketplace: "বাজার",
        question: "প্রশ্ন",
        advice: "পরামর্শ",
        expert_advice: "বিশেষজ্ঞ পরামর্শ"
    };

    const typeColors = {
        general: "bg-blue-50 text-blue-700 border-blue-200",
        marketplace: "bg-green-50 text-green-700 border-green-200",
        question: "bg-yellow-50 text-yellow-700 border-yellow-200",
        advice: "bg-purple-50 text-purple-700 border-purple-200",
        expert_advice: "bg-indigo-50 text-indigo-700 border-indigo-200"
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "আজ";
        if (diffDays === 1) return "গতকাল";
        if (diffDays < 7) return `${diffDays} দিন আগে`;
        return date.toLocaleDateString('bn-BD');
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">আমার পোস্ট ম্যানেজার</h1>
                    <p className="text-muted-foreground">
                        আপনার সকল পোস্ট দেখুন, সম্পাদনা করুন এবং পরিচালনা করুন
                    </p>
                </div>
                {onClose && (
                    <Button variant="outline" onClick={onClose}>
                        বন্ধ করুন
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="posts">পোস্ট তালিকা</TabsTrigger>
                    <TabsTrigger value="analytics">পরিসংখ্যান</TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="space-y-4">
                    {/* Search and Filter */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="পোস্ট খুঁজুন..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger className="w-[180px]">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">সব ধরণের</SelectItem>
                                        <SelectItem value="general">সাধারণ</SelectItem>
                                        <SelectItem value="marketplace">বাজার</SelectItem>
                                        <SelectItem value="question">প্রশ্ন</SelectItem>
                                        <SelectItem value="advice">পরামর্শ</SelectItem>
                                        <SelectItem value="expert_advice">বিশেষজ্ঞ পরামর্শ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Posts List */}
                    <div className="space-y-4">
                        {filteredPosts.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <div className="text-4xl mb-4">📝</div>
                                    <h3 className="text-lg font-medium mb-2">কোন পোস্ট নেই</h3>
                                    <p className="text-muted-foreground">
                                        {searchQuery || filterType !== "all"
                                            ? "আপনার অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন কোন পোস্ট খুঁজে পাওয়া যায়নি।"
                                            : "আপনি এখনো কোন পোস্ট করেননি। প্রথম পোস্ট করুন!"
                                        }
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredPosts.map((post) => (
                                <Card key={post.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className={typeColors[post.type]}>
                                                    {typeLabels[post.type]}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {formatTime(post.postedAt)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedPost(post)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditPost(post)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShowDeleteDialog(post.id)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p className="text-sm">
                                            {post.content.length > 150
                                                ? post.content.substring(0, 150) + "..."
                                                : post.content
                                            }
                                        </p>

                                        {/* Post Images */}
                                        {post.images && post.images.length > 0 && (
                                            <div className={`grid gap-2 ${post.images.length === 1 ? 'grid-cols-1' :
                                                post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                                                }`}>
                                                {post.images.slice(0, 3).map((image, index) => (
                                                    <div key={index} className="relative aspect-square">
                                                        <img
                                                            src={getAzureImageUrl(image) || image}
                                                            alt=""
                                                            className="w-full h-full object-cover rounded-lg"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                        {post.images.length > 3 && index === 2 && (
                                                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                                                <span className="text-white font-bold text-lg">
                                                                    +{post.images.length - 3}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Heart className="h-4 w-4" />
                                                <span>{post.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="h-4 w-4" />
                                                <span>{post.comments}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-full mr-4">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">মোট পোস্ট</p>
                                        <p className="text-2xl font-bold">{stats.totalPosts}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-orange-100 rounded-full mr-4">
                                        <Flag className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">মোট রিপোর্ট</p>
                                        <p className="text-2xl font-bold">{stats.totalReports}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Posts by Type */}
                    <Card>
                        <CardHeader>
                            <CardTitle>পোস্টের ধরন অনুযায়ী</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                <div className="p-4 bg-blue-50 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-blue-700">{stats.postsByType.general}</p>
                                    <p className="text-sm text-blue-600">সাধারণ</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-green-700">{stats.postsByType.marketplace}</p>
                                    <p className="text-sm text-green-600">বাজার</p>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-yellow-700">{stats.postsByType.question}</p>
                                    <p className="text-sm text-yellow-600">প্রশ্ন</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-purple-700">{stats.postsByType.advice}</p>
                                    <p className="text-sm text-purple-600">পরামর্শ</p>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-indigo-700">{stats.postsByType.expert_advice}</p>
                                    <p className="text-sm text-indigo-600">বিশেষজ্ঞ</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Most Popular Post */}
                    {stats.mostPopularPost && (stats.mostPopularPost.likes > 0 || stats.mostPopularPost.comments > 0) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    জনপ্রিয় পোস্ট
                                </CardTitle>
                                <CardDescription>
                                    সবচেয়ে বেশি engagement (লাইক + মন্তব্য) পাওয়া পোস্ট
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                                    <div className="flex items-start justify-between mb-3">
                                        <Badge variant="secondary" className={typeColors[stats.mostPopularPost.type]}>
                                            {typeLabels[stats.mostPopularPost.type]}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {formatTime(stats.mostPopularPost.postedAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm mb-3">
                                        {stats.mostPopularPost.content.length > 200
                                            ? stats.mostPopularPost.content.substring(0, 200) + "..."
                                            : stats.mostPopularPost.content
                                        }
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1 text-red-600">
                                            <Heart className="h-4 w-4 fill-current" />
                                            <span className="font-medium">{stats.mostPopularPost.likes} লাইক</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-blue-600">
                                            <MessageCircle className="h-4 w-4" />
                                            <span className="font-medium">{stats.mostPopularPost.comments} মন্তব্য</span>
                                        </div>
                                        <div className="ml-auto text-green-600 font-semibold">
                                            মোট: {stats.mostPopularPost.likes + stats.mostPopularPost.comments} engagement
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

            </Tabs>

            {/* Edit Post Dialog */}
            <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>পোস্ট সম্পাদনা করুন</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Select value={editedType} onValueChange={setEditedType}>
                            <SelectTrigger>
                                <SelectValue placeholder="পোস্টের ধরন নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">সাধারণ</SelectItem>
                                <SelectItem value="marketplace">বাজার</SelectItem>
                                <SelectItem value="question">প্রশ্ন</SelectItem>
                                <SelectItem value="advice">পরামর্শ</SelectItem>
                                <SelectItem value="expert_advice">বিশেষজ্ঞ পরামর্শ</SelectItem>
                            </SelectContent>
                        </Select>

                        <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            placeholder="আপনার পোস্ট লিখুন..."
                            className="min-h-[100px]"
                        />

                        {/* Existing Images */}
                        {editedImages.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-sm font-medium">বর্তমান ছবি:</span>
                                <div className="grid grid-cols-4 gap-2">
                                    {editedImages.map((img, index) => (
                                        <div key={index} className="relative aspect-square">
                                            <img
                                                src={img}
                                                alt=""
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Images Preview */}
                        {newImages.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-sm font-medium">নতুন ছবি:</span>
                                <div className="grid grid-cols-4 gap-2">
                                    {newImages.map((img, index) => (
                                        <div key={index} className="relative aspect-square">
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt=""
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => removeNewImage(index)}
                                                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add Image Button */}
                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer text-primary hover:underline">
                            <span>+ ছবি যোগ করুন</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleEditImageUpload}
                                className="hidden"
                            />
                        </label>

                        <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} disabled={isUploadingEdit}>
                                {isUploadingEdit ? 'আপলোড হচ্ছে...' : 'সংরক্ষণ করুন'}
                            </Button>
                            <Button variant="outline" onClick={() => setEditingPost(null)} disabled={isUploadingEdit}>
                                বাতিল
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>পোস্ট মুছে ফেলুন</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p>আপনি কি নিশ্চিত যে এই পোস্টটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।</p>
                        <div className="flex gap-2">
                            <Button
                                variant="destructive"
                                onClick={() => showDeleteDialog && handleDeletePost(showDeleteDialog)}
                            >
                                হ্যাঁ, মুছে ফেলুন
                            </Button>
                            <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
                                বাতিল
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Post Preview Dialog */}
            <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>পোস্ট প্রিভিউ</DialogTitle>
                    </DialogHeader>
                    {selectedPost && (
                        <div className="p-4">
                            <EnhancedPostCard
                                post={selectedPost}
                                onLike={handleLike}
                                onDelete={(postId) => {
                                    handleDeletePost(postId);
                                    setSelectedPost(null);
                                }}
                                onUpdate={handleUpdatePost}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};