import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Loader2
} from "lucide-react";
import DataOperatorHeader from "@/components/data-operator/DataOperatorHeader";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { getAzureImageUrl } from "@/lib/utils";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string | null;
    location: string;
    userType: string;
  };
  content: string;
  images: string[];
  type: string;
  likes: number;
  reports: number;
  postedAt: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
}

interface PostsResponse {
  posts: Post[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const DataOperatorPostApproval = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });
  const [processingPostId, setProcessingPostId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts(activeTab, 1);
  }, [activeTab]);

  const fetchPosts = async (status: 'pending' | 'approved' | 'rejected', page: number) => {
    setIsLoading(true);
    try {
      const response = await api.get<PostsResponse>('/data-operator/posts/pending', {
        params: { status, page, limit: 20 }
      });
      
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        variant: "destructive",
        title: "ত্রুটি",
        description: "পোস্ট লোড করতে ব্যর্থ হয়েছে"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (postId: string) => {
    if (!user?.id) return;

    setProcessingPostId(postId);
    try {
      await api.post(`/data-operator/posts/${postId}/approve`, {
        data_operator_id: user.id
      });

      toast({
        title: "সফল",
        description: "পোস্ট অনুমোদন করা হয়েছে",
      });

      // Refresh the list
      fetchPosts(activeTab, pagination.page);
    } catch (error) {
      console.error('Error approving post:', error);
      toast({
        variant: "destructive",
        title: "ত্রুটি",
        description: "পোস্ট অনুমোদন করতে ব্যর্থ হয়েছে"
      });
    } finally {
      setProcessingPostId(null);
    }
  };

  const handleReject = async (postId: string) => {
    if (!user?.id) return;

    setProcessingPostId(postId);
    try {
      await api.post(`/data-operator/posts/${postId}/reject`, {
        data_operator_id: user.id
      });

      toast({
        title: "সফল",
        description: "পোস্ট প্রত্যাখ্যান করা হয়েছে",
      });

      // Refresh the list
      fetchPosts(activeTab, pagination.page);
    } catch (error) {
      console.error('Error rejecting post:', error);
      toast({
        variant: "destructive",
        title: "ত্রুটি",
        description: "পোস্ট প্রত্যাখ্যান করতে ব্যর্থ হয়েছে"
      });
    } finally {
      setProcessingPostId(null);
    }
  };

  const getUserTypeBadge = (userType: string) => {
    const types: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      farmer: { label: "কৃষক", variant: "default" },
      expert: { label: "বিশেষজ্ঞ", variant: "secondary" },
      customer: { label: "ক্রেতা", variant: "destructive" }
    };
    return types[userType] || { label: userType, variant: "default" };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderPost = (post: Post) => {
    const userTypeBadge = getUserTypeBadge(post.author.userType);
    const isProcessing = processingPostId === post.id;

    return (
      <Card key={post.id} className="mb-4">
        <CardContent className="p-6">
          {/* Author Info */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={getAzureImageUrl(post.author.avatar)} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{post.author.name}</p>
                  <Badge variant={userTypeBadge.variant}>{userTypeBadge.label}</Badge>
                </div>
                <p className="text-sm text-gray-500">{post.author.location}</p>
                <p className="text-xs text-gray-400">{formatDate(post.postedAt)}</p>
              </div>
            </div>

            {/* Status Badge */}
            {post.approvalStatus === 'approved' && (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                অনুমোদিত
              </Badge>
            )}
            {post.approvalStatus === 'rejected' && (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                প্রত্যাখ্যাত
              </Badge>
            )}
            {post.approvalStatus === 'pending' && (
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                অপেক্ষমান
              </Badge>
            )}
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {post.images.map((image, idx) => (
                <img
                  key={idx}
                  src={getAzureImageUrl(image)}
                  alt={`Post image ${idx + 1}`}
                  className="rounded-lg w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/img/placeholder.png';
                  }}
                />
              ))}
            </div>
          )}

          {/* Post Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likes} লাইক</span>
            </div>
            {post.reports > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{post.reports} রিপোর্ট</span>
              </div>
            )}
          </div>

          {/* Action Buttons (only for pending posts) */}
          {activeTab === 'pending' && (
            <div className="flex gap-2">
              <Button
                onClick={() => handleApprove(post.id)}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                অনুমোদন করুন
              </Button>
              <Button
                onClick={() => handleReject(post.id)}
                disabled={isProcessing}
                variant="destructive"
                className="flex-1"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                প্রত্যাখ্যান করুন
              </Button>
            </div>
          )}

          {/* Approved/Rejected Info */}
          {(post.approvalStatus === 'approved' || post.approvalStatus === 'rejected') && post.approvedBy && (
            <div className="mt-4 pt-4 border-t text-sm text-gray-600">
              <p>
                {post.approvalStatus === 'approved' ? 'অনুমোদনকারী' : 'প্রত্যাখ্যানকারী'}: {post.approvedBy}
              </p>
              {post.approvedAt && <p className="text-xs">{formatDate(post.approvedAt)}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <DataOperatorHeader />

      <main className="container mx-auto px-4 pt-24 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/data-operator-dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 -ml-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>ড্যাশবোর্ডে ফিরে যান</span>
        </Button>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">পোস্ট অনুমোদন</h1>
          <p className="text-gray-600">সোশ্যাল ফিডের পোস্ট যাচাই ও অনুমোদন করুন</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              <Clock className="h-4 w-4 mr-2" />
              অপেক্ষমান ({pagination.total})
            </TabsTrigger>
            <TabsTrigger value="approved">
              <CheckCircle className="h-4 w-4 mr-2" />
              অনুমোদিত
            </TabsTrigger>
            <TabsTrigger value="rejected">
              <XCircle className="h-4 w-4 mr-2" />
              প্রত্যাখ্যাত
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">কোনো অপেক্ষমান পোস্ট নেই</p>
                </CardContent>
              </Card>
            ) : (
              <div>
                {posts.map(renderPost)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">কোনো অনুমোদিত পোস্ট নেই</p>
                </CardContent>
              </Card>
            ) : (
              <div>
                {posts.map(renderPost)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <XCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">কোনো প্রত্যাখ্যাত পোস্ট নেই</p>
                </CardContent>
              </Card>
            ) : (
              <div>
                {posts.map(renderPost)}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              disabled={pagination.page === 1 || isLoading}
              onClick={() => fetchPosts(activeTab, pagination.page - 1)}
            >
              পূর্ববর্তী
            </Button>
            <div className="flex items-center px-4">
              <span className="text-sm text-gray-600">
                পৃষ্ঠা {pagination.page} / {pagination.totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              disabled={pagination.page === pagination.totalPages || isLoading}
              onClick={() => fetchPosts(activeTab, pagination.page + 1)}
            >
              পরবর্তী
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default DataOperatorPostApproval;
