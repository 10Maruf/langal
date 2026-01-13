import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  Eye,
  Tag,
  MapPin,
  Phone
} from "lucide-react";
import DataOperatorHeader from "@/components/data-operator/DataOperatorHeader";
import { useAuth } from "@/contexts/AuthContext";
import { getAzureImageUrl } from "@/lib/utils";
import { marketplaceService } from "@/services/marketplaceService";
import { MarketplaceListing } from "@/types/marketplace";

const DataOperatorMarketplaceApproval = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [processingListingId, setProcessingListingId] = useState<string | null>(null);

  useEffect(() => {
    fetchListings(activeTab, 1);
  }, [activeTab]);

  const fetchListings = async (status: 'pending' | 'approved' | 'rejected', pageNum: number) => {
    setIsLoading(true);
    try {
      const result = await marketplaceService.getPendingListings(pageNum, 20, status);
      setListings(result.listings);
      setTotal(result.total);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: "ত্রুটি",
        description: "বিজ্ঞাপন লোড করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (listingId: string) => {
    if (!user?.user_id) return;
    
    setProcessingListingId(listingId);
    try {
      const success = await marketplaceService.approveListing(listingId, user.user_id);
      
      if (success) {
        toast({
          title: "সফল",
          description: "বিজ্ঞাপন অনুমোদন করা হয়েছে।",
        });
        fetchListings(activeTab, page);
      } else {
        throw new Error('Approval failed');
      }
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "বিজ্ঞাপন অনুমোদন করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setProcessingListingId(null);
    }
  };

  const handleReject = async (listingId: string) => {
    if (!user?.user_id) return;
    
    setProcessingListingId(listingId);
    try {
      const success = await marketplaceService.rejectListing(listingId, user.user_id);
      
      if (success) {
        toast({
          title: "সফল",
          description: "বিজ্ঞাপন প্রত্যাখ্যান করা হয়েছে।",
        });
        fetchListings(activeTab, page);
      } else {
        throw new Error('Rejection failed');
      }
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "বিজ্ঞাপন প্রত্যাখ্যান করতে সমস্যা হয়েছে।",
        variant: "destructive"
      });
    } finally {
      setProcessingListingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />অপেক্ষমাণ</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />অনুমোদিত</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />প্রত্যাখ্যাত</Badge>;
      default:
        return null;
    }
  };

  const renderListings = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      );
    }

    if (listings.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <CheckCircle className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              {activeTab === 'pending' && 'কোনো পেন্ডিং বিজ্ঞাপন নেই'}
              {activeTab === 'approved' && 'কোনো অনুমোদিত বিজ্ঞাপন নেই'}
              {activeTab === 'rejected' && 'কোনো প্রত্যাখ্যাত বিজ্ঞাপন নেই'}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{listing.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        <span className="font-semibold text-green-700">
                          {listing.price} {listing.currency}
                        </span>
                      </div>
                      <Badge variant="outline">{listing.listingTypeBn || listing.type}</Badge>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {listing.location}
                      </div>
                    </div>
                  </div>
                </div>
                {getStatusBadge(listing.approvalStatus || 'pending')}
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              {listing.images && listing.images.length > 0 && (
                <div className="mb-4 grid grid-cols-4 gap-2">
                  {listing.images.slice(0, 4).map((image, idx) => (
                    <img
                      key={idx}
                      src={getAzureImageUrl(image)}
                      alt={`Image ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              <p className="text-gray-700 mb-4 line-clamp-3">{listing.description}</p>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">বিক্রেতার তথ্য:</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{listing.author.name}</span>
                  {listing.contactInfo?.phone && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone className="w-3 h-3" />
                      {listing.contactInfo.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {listing.views} দেখা
                </div>
              </div>

              {listing.approvalStatus === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleApprove(listing.id)}
                    disabled={processingListingId === listing.id}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {processingListingId === listing.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    অনুমোদন করুন
                  </Button>
                  <Button
                    onClick={() => handleReject(listing.id)}
                    disabled={processingListingId === listing.id}
                    variant="destructive"
                    className="flex-1"
                  >
                    {processingListingId === listing.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    প্রত্যাখ্যান করুন
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <DataOperatorHeader />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/data-operator/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ড্যাশবোর্ড এ ফিরে যান
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">মার্কেটপ্লেস বিজ্ঞাপন অনুমোদন</h1>
            <p className="text-gray-600 mt-1">পেন্ডিং বিজ্ঞাপন পর্যালোচনা ও অনুমোদন করুন</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'pending' | 'approved' | 'rejected')} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              অপেক্ষমাণ ({total})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              অনুমোদিত
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              প্রত্যাখ্যাত
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">{renderListings()}</TabsContent>
          <TabsContent value="approved" className="mt-6">{renderListings()}</TabsContent>
          <TabsContent value="rejected" className="mt-6">{renderListings()}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataOperatorMarketplaceApproval;
