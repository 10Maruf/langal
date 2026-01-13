import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TTSButton } from "@/components/ui/tts-button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { API_URL } from '@/services/api';
import { MarketplacePreviewCard } from './MarketplacePreviewCard';
import {
    Heart,
    MessageCircle,
    MoreHorizontal,
    MapPin,
    ExternalLink,
    UserCheck,
    Flag,
    Edit2,
    Trash2,
    Send,
    ChevronDown,
    ChevronUp,
    Clock,
    CheckCircle,
    XCircle
} from "lucide-react";
import { cn, getAzureImageUrl } from "@/lib/utils";
import { SocialPost, PostComment, POST_REPORT_REASONS, COMMENT_REPORT_REASONS } from "@/types/social";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { socialFeedService } from "@/services/socialFeedService";

interface EnhancedPostCardProps {
    post: SocialPost;
    onLike: (post: SocialPost) => void;
    onMarketplaceClick?: (post: SocialPost) => void;
    onDelete?: (postId: string) => void;
    onUpdate?: (postId: string, updates: Partial<SocialPost>) => void;
}

export const EnhancedPostCard = ({
    post,
    onLike,
    onMarketplaceClick,
    onDelete,
    onUpdate
}: EnhancedPostCardProps) => {
    const { user } = useAuth();
    const { toast } = useToast();

    // State management
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<PostComment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);
    const [editedType, setEditedType] = useState(post.type);
    const [editedImages, setEditedImages] = useState<string[]>(post.images || []);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [isUploadingEdit, setIsUploadingEdit] = useState(false);
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportCommentId, setReportCommentId] = useState<string | null>(null);
    const [showFullContent, setShowFullContent] = useState(false);

    // Load comments when showing comments section
    const loadComments = async () => {
        if (!showComments) {
            try {
                const postComments = await socialFeedService.getComments(post.id);
                setComments(postComments || []);
            } catch (error) {
                console.error('Error loading comments:', error);
                setComments([]);
            }
        }
        setShowComments(!showComments);
    };

    // Handle comment submission
    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        const userId = user?.user_id || (user?.id ? parseInt(user.id) : undefined);

        try {
            const comment = await socialFeedService.addComment(post.id, newComment, userId);
            if (comment) {
                setComments([...comments, comment]);
                setNewComment("");
                toast({
                    title: "মন্তব্য যোগ করা হয়েছে",
                    description: "আপনার মন্তব্য সফলভাবে পোস্ট করা হয়েছে।",
                });
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast({
                title: "ত্রুটি",
                description: "মন্তব্য যোগ করতে সমস্যা হয়েছে।",
                variant: "destructive"
            });
        }
    };

    // Handle post edit
    const handleEditSave = async () => {
        if (onUpdate) {
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

                onUpdate(post.id, { content: editedContent, images: finalImages, type: editedType });
                setIsEditing(false);
                setNewImages([]);
                toast({
                    title: "পোস্ট আপডেট হয়েছে",
                    description: "আপনার পোস্ট সফলভাবে আপডেট করা হয়েছে।",
                });
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

    // Handle edit image upload
    const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...files]);
            e.target.value = '';
        }
    };

    // Remove existing image
    const removeExistingImage = (index: number) => {
        setEditedImages(prev => prev.filter((_, i) => i !== index));
    };

    // Remove new image
    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    // Handle report button click
    const handleReportClick = async () => {
        const userId = user?.user_id || (user?.id ? parseInt(user.id) : undefined);

        try {
            const result = await socialFeedService.reportPost(post.id, userId);
            if (result) {
                // Update the post locally
                if (onUpdate) {
                    onUpdate(post.id, {
                        reported: result.reported,
                        reports: result.reports
                    });
                }

                toast({
                    title: result.reported ? "রিপোর্ট করা হয়েছে" : "রিপোর্ট বাতিল হয়েছে",
                    description: result.reported
                        ? "আপনার রিপোর্ট জমা দেওয়া হয়েছে।"
                        : "আপনার রিপোর্ট বাতিল করা হয়েছে।",
                });
            }
        } catch (error) {
            console.error('Error reporting post:', error);
            toast({
                title: "ত্রুটি",
                description: "রিপোর্ট করতে সমস্যা হয়েছে।",
                variant: "destructive"
            });
        }
    };

    // Handle post report
    const handleReportPost = async () => {
        if (!reportReason) {
            toast({
                title: "রিপোর্টের কারণ নির্বাচন করুন",
                description: "দয়া করে রিপোর্টের একটি কারণ নির্বাচন করুন।",
                variant: "destructive"
            });
            return;
        }

        const userId = user?.user_id || (user?.id ? parseInt(user.id) : undefined);
        const result = await socialFeedService.reportPost(post.id, reportReason, post.type, userId);

        if (result) {
            setShowReportDialog(false);
            setReportReason("");

            toast({
                title: result.reported ? "রিপোর্ট জমা দেওয়া হয়েছে" : "রিপোর্ট বাতিল করা হয়েছে",
                description: result.reported ? "আমরা আপনার রিপোর্ট পর্যালোচনা করব।" : "আপনার রিপোর্ট সরিয়ে দেওয়া হয়েছে।",
            });
        }
    };

    // Handle comment report
    const handleReportComment = async (commentId: string) => {
        if (!reportReason) {
            toast({
                title: "রিপোর্টের কারণ নির্বাচন করুন",
                description: "দয়া করে রিপোর্টের একটি কারণ নির্বাচন করুন।",
                variant: "destructive"
            });
            return;
        }

        const userId = user?.user_id || (user?.id ? parseInt(user.id) : undefined);
        const result = await socialFeedService.reportComment(post.id, commentId, reportReason, userId);

        if (result) {
            setShowReportDialog(false);
            setReportReason("");
            setReportCommentId(null);

            toast({
                title: result.reported ? "মন্তব্য রিপোর্ট করা হয়েছে" : "রিপোর্ট বাতিল করা হয়েছে",
                description: result.reported ? "আমরা আপনার রিপোর্ট পর্যালোচনা করব।" : "আপনার রিপোর্ট সরিয়ে দেওয়া হয়েছে।",
            });
        }
    };

    // Utility functions
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

    const formatTime = (dateString: string | undefined | null) => {
        if (!dateString) return "এখনই";

        // Handle MySQL datetime format (2025-01-17 11:03:28)
        // Backend now uses Asia/Dhaka timezone, so just parse directly
        const normalizedDate = dateString.replace(' ', 'T');
        const date = new Date(normalizedDate + '+06:00'); // Explicitly set Bangladesh timezone

        // Check if date is valid
        if (isNaN(date.getTime())) return "এখনই";

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 0) return "এখনই"; // Future date protection
        if (diffMinutes < 1) return "এখনই";
        if (diffMinutes < 60) return `${diffMinutes} মিনিট আগে`;
        if (diffHours < 24) return `${diffHours} ঘন্টা আগে`;
        if (diffDays < 7) return `${diffDays} দিন আগে`;
        return date.toLocaleDateString('bn-BD');
    };

    const postContent = post.content || '';
    const postImages = post.images || [];
    const postAuthor = post.author || { name: 'Unknown', avatar: '', location: '', userType: 'farmer', isExpert: false };
    const shouldTruncateContent = postContent.length > 300;
    const displayContent = shouldTruncateContent && !showFullContent
        ? postContent.substring(0, 300) + "..."
        : postContent;

    const isOwnPost = post.isOwnPost || (user?.name === postAuthor.name);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={getAzureImageUrl(postAuthor.avatar)} />
                            <AvatarFallback>
                                {postAuthor.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{postAuthor.name}</span>
                                {postAuthor.verified && (
                                    <span className="text-green-600 text-xs">✓</span>
                                )}
                                {postAuthor.isExpert && (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                        <UserCheck className="h-3 w-3 mr-1" />
                                        বিশেষজ্ঞ
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{postAuthor.location || 'Bangladesh'}</span>
                                <span>•</span>
                                <span>{formatTime(post.postedAt)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={typeColors[post.type] || typeColors.general}>
                            {typeLabels[post.type] || typeLabels.general}
                        </Badge>
                        
                        {/* Approval Status Badge - Only show for own posts */}
                        {isOwnPost && post.approvalStatus && (
                            <>
                                {post.approvalStatus === 'pending' && (
                                    <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                        <Clock className="h-3 w-3 mr-1" />
                                        অপেক্ষমান
                                    </Badge>
                                )}
                                {post.approvalStatus === 'rejected' && (
                                    <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        প্রত্যাখ্যাত
                                    </Badge>
                                )}
                                {post.approvalStatus === 'approved' && (
                                    <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        অনুমোদিত
                                    </Badge>
                                )}
                            </>
                        )}
                        
                        <TTSButton
                            text={postContent}
                            authorName={postAuthor.name}
                            size="icon"
                            variant="ghost"
                        />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {isOwnPost && (
                                    <>
                                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                            <Edit2 className="h-4 w-4 mr-2" />
                                            সম্পাদনা
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDelete?.(post.id)}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            মুছে ফেলুন
                                        </DropdownMenuItem>
                                    </>
                                )}
                                {!isOwnPost && (
                                    <DropdownMenuItem onClick={() => {
                                        if (post.reported) {
                                            handleReportClick();
                                        } else {
                                            setReportCommentId(null);
                                            setShowReportDialog(true);
                                        }
                                    }}>
                                        <Flag className={cn("h-4 w-4 mr-2", post.reported && "text-orange-500 fill-current")} />
                                        {post.reported ? 'রিপোর্ট বাতিল' : 'রিপোর্ট করুন'}
                                        {(post.reports || 0) > 0 && (
                                            <span className="ml-auto text-xs text-muted-foreground">({post.reports})</span>
                                        )}
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Post Content */}
                {isEditing ? (
                    <div className="space-y-3">
                        {/* Post Type Selector */}
                        <Select value={editedType} onValueChange={(value: any) => setEditedType(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">সাধারণ পোস্ট</SelectItem>
                                <SelectItem value="marketplace">বাজার</SelectItem>
                                <SelectItem value="question">প্রশ্ন</SelectItem>
                                <SelectItem value="advice">পরামর্শ</SelectItem>
                                {postAuthor.isExpert && (
                                    <SelectItem value="expert_advice">বিশেষজ্ঞ পরামর্শ</SelectItem>
                                )}
                            </SelectContent>
                        </Select>

                        <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="min-h-[100px] resize-none"
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
                            <Button size="sm" onClick={handleEditSave} disabled={isUploadingEdit}>
                                {isUploadingEdit ? 'আপলোড হচ্ছে...' : 'সংরক্ষণ'}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isUploadingEdit}
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedContent(post.content);
                                    setEditedType(post.type);
                                    setEditedImages(post.images || []);
                                    setNewImages([]);
                                }}
                            >
                                বাতিল
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm leading-relaxed">{displayContent}</p>
                        {shouldTruncateContent && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFullContent(!showFullContent)}
                                className="px-0 text-primary h-auto"
                            >
                                {showFullContent ? (
                                    <>
                                        <ChevronUp className="h-4 w-4 mr-1" />
                                        কম দেখুন
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-4 w-4 mr-1" />
                                        আরো দেখুন
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                )}



                {/* Images */}
                {postImages.length > 0 && (
                    <div className={cn(
                        "grid gap-2 rounded-lg overflow-hidden max-w-2xl mx-auto",
                        postImages.length === 1 && "grid-cols-1",
                        postImages.length === 2 && "grid-cols-2",
                        postImages.length >= 3 && "grid-cols-2"
                    )}>
                        {postImages.slice(0, 4).map((image, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "relative bg-muted overflow-hidden rounded-md",
                                    // Single image: wider aspect ratio on mobile, more constrained on desktop
                                    postImages.length === 1 && "aspect-[4/3] sm:aspect-[3/2] max-h-64 sm:max-h-80",
                                    // Two images: square on mobile, rectangular on desktop
                                    postImages.length === 2 && "aspect-square sm:aspect-[4/3] max-h-48 sm:max-h-60",
                                    // Multiple images: smaller squares
                                    postImages.length >= 3 && "aspect-square max-h-32 sm:max-h-40",
                                    postImages.length === 3 && index === 0 && "row-span-2 max-h-64 sm:max-h-80"
                                )}
                            >
                                <img
                                    src={getAzureImageUrl(image) || image}
                                    alt=""
                                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                    onError={(e) => {
                                        // Hide broken images
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                {postImages.length > 4 && index === 3 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium">
                                        +{postImages.length - 4}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Marketplace Link - Legacy */}
                {post.marketplaceLink && !post.marketplaceReference && (
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

                {/* Marketplace Reference - Enhanced Preview Card */}
                {post.marketplaceReference && (
                    <MarketplacePreviewCard marketplaceData={post.marketplaceReference} />
                )}
            </CardContent>

            <CardFooter className="pt-0">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onLike(post)}
                            disabled={isLiking}
                            className={cn(
                                "h-8 px-2 transition-colors",
                                post.liked && "text-red-500 hover:text-red-600",
                                isLiking && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <Heart className={cn(
                                "h-4 w-4 mr-1 transition-all",
                                post.liked && "fill-current scale-110"
                            )} />
                            <span className="text-xs">{post.likes}</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={loadComments}
                            className="h-8 px-2"
                        >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">{post.comments}</span>
                        </Button>
                    </div>
                </div>
            </CardFooter>

            {/* Comments Section */}
            {showComments && (
                <CardContent className="pt-0 space-y-4">
                    {/* Comment Input */}
                    <div className="flex gap-2 items-start">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {user?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Textarea
                                placeholder="একটি মন্তব্য লিখুন..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[80px] resize-none"
                            />
                            <Button
                                size="sm"
                                onClick={handleCommentSubmit}
                                disabled={!newComment.trim()}
                            >
                                <Send className="h-4 w-4 mr-1" />
                                মন্তব্য করুন
                            </Button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                        {comments.map((comment) => {
                            const commentAuthor = comment.author || { name: 'Unknown', avatar: '', isExpert: false };
                            return (
                                <div key={comment.id} className="flex gap-2 items-start">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={commentAuthor.avatar} />
                                        <AvatarFallback>
                                            {commentAuthor.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="bg-muted rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-sm">
                                                    {commentAuthor.name}
                                                </span>
                                                {commentAuthor.isExpert && (
                                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                        <UserCheck className="h-3 w-3 mr-1" />
                                                        বিশেষজ্ঞ
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm">{comment.content}</p>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                            <span>{formatTime(comment.postedAt)}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setReportCommentId(comment.id);
                                                    setShowReportDialog(true);
                                                }}
                                                className="h-6 px-2 text-xs"
                                            >
                                                <Flag className="h-3 w-3 mr-1" />
                                                রিপোর্ট
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            )}

            {/* Report Dialog */}
            <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {reportCommentId ? 'মন্তব্য রিপোর্ট করুন' : 'পোস্ট রিপোর্ট করুন'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Select value={reportReason} onValueChange={setReportReason}>
                            <SelectTrigger>
                                <SelectValue placeholder="রিপোর্টের কারণ নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                {(reportCommentId ? COMMENT_REPORT_REASONS : POST_REPORT_REASONS).map((reason) => (
                                    <SelectItem key={reason.id} value={reason.id}>
                                        <div>
                                            <div className="font-medium">{reason.label}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {reason.description}
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => reportCommentId ? handleReportComment(reportCommentId) : handleReportPost()}
                                disabled={!reportReason}
                            >
                                রিপোর্ট জমা দিন
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowReportDialog(false);
                                    setReportReason("");
                                    setReportCommentId(null);
                                }}
                            >
                                বাতিল
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
};