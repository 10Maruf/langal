import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, MapPin, ShoppingCart, X, UserCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from '@/services/api';
import axios from "axios";

interface CreatePostProps {
  onPost: (postData: any) => void;
  onCancel: () => void;
}

export const CreatePost = ({ onPost, onCancel }: CreatePostProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState(user?.type === 'expert' ? "expert_advice" : "general");
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [marketplaceData, setMarketplaceData] = useState({
    title: "",
    price: "",
    category: ""
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...newFiles]);
      // Reset input so same files can be selected again if needed
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    // Get user_id from either user_id or id field
    const userId = user?.user_id || (user?.id ? parseInt(user.id) : null);

    if (!userId) {
      console.error('User ID not found');
      return;
    }

    setIsUploading(true);

    try {
      // Upload images to server first
      let uploadedImageUrls: string[] = [];

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => {
          formData.append('images[]', img);
        });

        const uploadResponse = await axios.post(
          `${API_URL}/social/upload-images`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (uploadResponse.data.success) {
          uploadedImageUrls = uploadResponse.data.urls;
        }
      }

      const postData = {
        user_id: userId,
        content,
        type: postType,
        images: uploadedImageUrls,
        marketplaceLink: postType === "marketplace" ? marketplaceData : undefined
      };

      onPost(postData);
    } catch (error) {
      console.error('Error uploading images:', error);
      // Still try to post without images
      const postData = {
        user_id: userId,
        content,
        type: postType,
        images: [],
        marketplaceLink: postType === "marketplace" ? marketplaceData : undefined
      };
      onPost(postData);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mx-4 mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">নতুন পোস্ট</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Author Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {user?.name ? user.name.charAt(0) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {user?.name || 'ইউজার'}
              </span>
              {user?.type === 'expert' && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  <UserCheck className="h-3 w-3 mr-1" />
                  বিশেষজ্ঞ
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>
                {user?.type === 'expert' ? 'কৃষি বিশ্ববিদ্যালয়' : 'বাংলাদেশ'}
              </span>
            </div>
          </div>
        </div>

        {/* Post Type Selection */}
        <Select value={postType} onValueChange={setPostType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">সাধারণ পোস্ট</SelectItem>
            <SelectItem value="marketplace">বাজার</SelectItem>
            <SelectItem value="question">প্রশ্ন</SelectItem>
            <SelectItem value="advice">পরামর্শ</SelectItem>
            {user?.type === 'expert' && (
              <SelectItem value="expert_advice">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  বিশেষজ্ঞ পরামর্শ
                </div>
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        {/* Content */}
        <Textarea
          placeholder="আপনার মনের কথা লিখুন..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] resize-none"
        />

        {/* Marketplace Fields */}
        {postType === "marketplace" && (
          <div className="space-y-3 p-3 bg-accent/5 rounded-lg border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShoppingCart className="h-4 w-4" />
              <span>বাজার তথ্য</span>
            </div>

            <Input
              placeholder="পণ্যের নাম"
              value={marketplaceData.title}
              onChange={(e) => setMarketplaceData({ ...marketplaceData, title: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="দাম (৳)"
                type="number"
                value={marketplaceData.price}
                onChange={(e) => setMarketplaceData({ ...marketplaceData, price: e.target.value })}
              />
              <Select
                value={marketplaceData.category}
                onValueChange={(value) => setMarketplaceData({ ...marketplaceData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ক্যাটেগরি" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="machinery">যন্ত্রপাতি</SelectItem>
                  <SelectItem value="crops">ফসল</SelectItem>
                  <SelectItem value="seeds">বীজ</SelectItem>
                  <SelectItem value="fertilizer">সার</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <Image className="h-4 w-4" />
            <span>ছবি যোগ করুন</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(image)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleSubmit} className="flex-1" disabled={isUploading || !content.trim()}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                আপলোড হচ্ছে...
              </>
            ) : (
              'পোস্ট করুন'
            )}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isUploading}>
            বাতিল
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};