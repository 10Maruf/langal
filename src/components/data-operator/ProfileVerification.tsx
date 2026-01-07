import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/services/api';
import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Eye, Users, ShoppingBag, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataOperatorHeader from '@/components/data-operator/DataOperatorHeader';

interface FarmerProfile {
  user_id: number;
  full_name: string;
  father_name?: string;
  mother_name?: string;
  phone_number: string;
  profile_photo_url_full?: string;
  date_of_birth?: string;
  nid_number?: string;
  division?: string;
  district?: string;
  upazila?: string;
  union?: string;
  post_office?: string;
  village?: string;
  verification_status?: 'pending' | 'approved' | 'rejected';
  verified_at?: string;
  verified_by?: number;
}

interface CustomerProfile {
  user_id: number;
  full_name: string;
  father_name?: string;
  mother_name?: string;
  phone_number: string;
  profile_photo_url_full?: string;
  nid_photo_url_full?: string;
  date_of_birth?: string;
  nid_number?: string;
  village?: string;
  postal_code?: number;
  division?: string;
  district?: string;
  upazila?: string;
  address?: string;
  business_name?: string;
  business_type?: string;
  custom_business_type?: string;
  trade_license_number?: string;
  business_address?: string;
  established_year?: number;
  verification_status?: 'pending' | 'approved' | 'rejected';
  verified_at?: string;
  verified_by?: number;
}

interface ExpertProfile {
  user_id: number;
  full_name: string;
  phone_number: string;
  profile_photo_url_full?: string;
  date_of_birth?: string;
  nid_number?: string;
  division?: string;
  district?: string;
  upazila?: string;
  post_office?: string;
  qualification?: string;
  specialization?: string;
  experience_years?: number;
  institution?: string;
  license_number?: string;
  certification_document_url?: string;
  is_government_approved?: boolean;
  rating?: number;
  total_consultations?: number;
  verification_status?: 'pending' | 'approved' | 'rejected';
  verified_at?: string;
  verified_by?: number;
}

const ProfileVerification = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfile | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<ExpertProfile | null>(null);
  const [nidPhotoError, setNidPhotoError] = useState(false);
  const [certDocError, setCertDocError] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('farmer');

  // Business type translations
  const businessTypeMap: Record<string, string> = {
    'retail': 'খুচরা বিক্রয়',
    'wholesale': 'পাইকারি বিক্রয়',
    'restaurant': 'রেস্টুরেন্ট',
    'hotel': 'হোটেল',
    'grocery': 'মুদি দোকান',
    'supermarket': 'সুপারমার্কেট',
    'agro_business': 'কৃষি ব্যবসা',
    'agro_industry': 'কৃষি শিল্প',
    'export': 'রপ্তানি',
    'import': 'আমদানি',
    'other': 'অন্যান্য'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchFarmers(), fetchCustomers(), fetchExperts()]);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmers = async () => {
    try {
      const response = await api.get('/data-operator/farmers');
      setFarmers(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching farmers:', error);
      toast.error(error.response?.data?.message || 'কৃষক তালিকা লোড করতে ব্যর্থ');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/data-operator/customers');
      setCustomers(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast.error(error.response?.data?.message || 'ক্রেতা তালিকা লোড করতে ব্যর্থ');
    }
  };

  const fetchExperts = async () => {
    try {
      const response = await api.get('/data-operator/experts');
      setExperts(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching experts:', error);
      toast.error(error.response?.data?.message || 'বিশেষজ্ঞ তালিকা লোড করতে ব্যর্থ');
    }
  };

  const handleViewDetails = (farmer: FarmerProfile) => {
    setSelectedFarmer(farmer);
    setSelectedCustomer(null);
    setSelectedExpert(null);
    setIsViewOpen(true);
  };

  const handleViewDetailsCustomer = (customer: CustomerProfile) => {
    setSelectedCustomer(customer);
    setSelectedFarmer(null);
    setSelectedExpert(null);
    setNidPhotoError(false);
    setIsViewOpen(true);
  };

  const handleViewDetailsExpert = (expert: ExpertProfile) => {
    setSelectedExpert(expert);
    setSelectedFarmer(null);
    setSelectedCustomer(null);
    setCertDocError(false);
    setIsViewOpen(true);
  };

  const handleVerification = async (userId: number, status: 'approved' | 'rejected') => {
    try {
      setProcessingId(userId);
      
      const response = await api.post('/data-operator/verify-profile', {
        user_id: userId,
        verification_status: status,
      });

      toast.success(
        status === 'approved' 
          ? 'প্রোফাইল অনুমোদিত হয়েছে' 
          : 'প্রোফাইল প্রত্যাখ্যাত হয়েছে'
      );

      // Update local state based on active tab
      if (selectedFarmer) {
        setFarmers(farmers.map(f => 
          f.user_id === userId 
            ? { ...f, verification_status: status, verified_at: new Date().toISOString() }
            : f
        ));
      } else if (selectedCustomer) {
        setCustomers(customers.map(c => 
          c.user_id === userId 
            ? { ...c, verification_status: status, verified_at: new Date().toISOString() }
            : c
        ));
      } else if (selectedExpert) {
        setExperts(experts.map(e => 
          e.user_id === userId 
            ? { ...e, verification_status: status, verified_at: new Date().toISOString() }
            : e
        ));
      }

      setIsViewOpen(false);
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.response?.data?.message || 'যাচাইকরণ ব্যর্থ হয়েছে');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" />
            অনুমোদিত
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="mr-1 h-3 w-3" />
            প্রত্যাখ্যাত
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            অপেক্ষমাণ
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/data-operator-dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">প্রোফাইল যাচাই</h1>
          </div>
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">তথ্য লোড হচ্ছে...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DataOperatorHeader />
      
      <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-[calc(100vh-73px)] p-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/data-operator-dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">প্রোফাইল যাচাই</h1>
            </div>
          </div>

          {/* Tabs for different user types */}
          <Tabs defaultValue="farmer" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="farmer" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                কৃষক
                <Badge variant="secondary" className="ml-2">{farmers.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                ক্রেতা
                <Badge variant="secondary" className="ml-2">{customers.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="expert" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                কৃষি বিশেষজ্ঞ
                <Badge variant="secondary" className="ml-2">{experts.length}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Farmer Tab */}
            <TabsContent value="farmer" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">মোট কৃষক</div>
            <div className="text-2xl font-bold text-gray-800">{farmers.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">অপেক্ষমাণ</div>
            <div className="text-2xl font-bold text-yellow-600">
              {farmers.filter(f => f.verification_status === 'pending' || !f.verification_status).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">অনুমোদিত</div>
            <div className="text-2xl font-bold text-green-600">
              {farmers.filter(f => f.verification_status === 'approved').length}
            </div>
          </div>
        </div>

        {/* Farmers List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    কৃষক
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    মোবাইল নম্বর
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    এলাকা
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    অবস্থা
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    কার্যক্রম
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {farmers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      কোন কৃষক পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  farmers.map((farmer) => (
                    <tr key={farmer.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {farmer.profile_photo_url_full ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={farmer.profile_photo_url_full}
                                alt={farmer.full_name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-600 font-medium">
                                  {farmer.full_name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {farmer.full_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{farmer.phone_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {farmer.village && farmer.upazila 
                            ? `${farmer.village}, ${farmer.upazila}`
                            : farmer.district || 'তথ্য নেই'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(farmer.verification_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(farmer)}
                          className="mr-2"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          বিস্তারিত দেখুন
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
            </TabsContent>

            {/* Customer Tab */}
            <TabsContent value="customer" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-600">মোট ক্রেতা</div>
                  <div className="text-2xl font-bold text-gray-800">{customers.length}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-600">অপেক্ষমাণ</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {customers.filter(c => c.verification_status === 'pending' || !c.verification_status).length}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-600">অনুমোদিত</div>
                  <div className="text-2xl font-bold text-green-600">
                    {customers.filter(c => c.verification_status === 'approved').length}
                  </div>
                </div>
              </div>

              {/* Customers List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ক্রেতা
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          মোবাইল নম্বর
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          এলাকা
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          অবস্থা
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          কার্যক্রম
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            কোন ক্রেতা পাওয়া যায়নি
                          </td>
                        </tr>
                      ) : (
                        customers.map((customer) => (
                          <tr key={customer.user_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  {customer.profile_photo_url_full ? (
                                    <img
                                      className="h-10 w-10 rounded-full object-cover"
                                      src={customer.profile_photo_url_full}
                                      alt={customer.full_name}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-blue-600 font-medium">
                                        {customer.full_name.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {customer.full_name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{customer.phone_number}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {customer.address || customer.upazila 
                                  ? `${customer.address || customer.upazila}`
                                  : customer.district || 'তথ্য নেই'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(customer.verification_status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetailsCustomer(customer)}
                                className="mr-2"
                              >
                                <Eye className="mr-1 h-4 w-4" />
                                বিস্তারিত দেখুন
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Agricultural Expert Tab */}
            <TabsContent value="expert" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-600">মোট বিশেষজ্ঞ</div>
                  <div className="text-2xl font-bold text-gray-800">{experts.length}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-600">অপেক্ষমাণ</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {experts.filter(e => e.verification_status === 'pending' || !e.verification_status).length}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-600">অনুমোদিত</div>
                  <div className="text-2xl font-bold text-green-600">
                    {experts.filter(e => e.verification_status === 'approved').length}
                  </div>
                </div>
              </div>

              {/* Experts List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          নাম
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          মোবাইল নম্বর
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          বিশেষত্ব
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          অবস্থান
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          স্ট্যাটাস
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          অ্যাকশন
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {experts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            কোন বিশেষজ্ঞ পাওয়া যায়নি
                          </td>
                        </tr>
                      ) : (
                        experts.map((expert) => (
                          <tr key={expert.user_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  {expert.profile_photo_url_full ? (
                                    <img
                                      className="h-10 w-10 rounded-full object-cover"
                                      src={expert.profile_photo_url_full}
                                      alt={expert.full_name}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                      <span className="text-purple-600 font-medium">
                                        {expert.full_name.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {expert.full_name}
                                  </div>
                                  {expert.qualification && (
                                    <div className="text-xs text-gray-500">{expert.qualification}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{expert.phone_number}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {expert.specialization || 'তথ্য নেই'}
                              </div>
                              {expert.experience_years && (
                                <div className="text-xs text-gray-500">
                                  অভিজ্ঞতা: {expert.experience_years} বছর
                                </div>
                              )}
                              {expert.certification_document_url && (
                                <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                  <CheckCircle className="h-3 w-3" />
                                  সার্টিফিকেট আছে
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {expert.upazila || expert.district || 'তথ্য নেই'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(expert.verification_status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetailsExpert(expert)}
                                className="mr-2"
                              >
                                <Eye className="mr-1 h-4 w-4" />
                                বিস্তারিত দেখুন
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedFarmer ? 'কৃষক প্রোফাইল' : selectedCustomer ? 'ক্রেতা প্রোফাইল' : 'বিশেষজ্ঞ প্রোফাইল'}
            </DialogTitle>
            <DialogDescription>
              {selectedFarmer ? 'কৃষকের বিস্তারিত তথ্য' : selectedCustomer ? 'ক্রেতার বিস্তারিত তথ্য' : 'বিশেষজ্ঞের বিস্তারিত তথ্য'}
            </DialogDescription>
          </DialogHeader>

          {selectedFarmer && (
            <div className="space-y-6">
              {/* Profile Photo */}
              <div className="flex justify-center">
                <>
                  {selectedFarmer.profile_photo_url_full ? (
                    <img
                      src={selectedFarmer.profile_photo_url_full}
                      alt={selectedFarmer.full_name}
                      className="h-32 w-32 rounded-full object-cover border-4 border-green-200 cursor-pointer hover:opacity-80"
                      onClick={() => window.open(selectedFarmer.profile_photo_url_full, '_blank')}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.removeAttribute('style');
                      }}
                    />
                  ) : null}
                  <div 
                    className="h-32 w-32 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-200"
                    style={{ display: selectedFarmer.profile_photo_url_full ? 'none' : 'flex' }}
                  >
                    <span className="text-4xl text-green-600 font-bold">
                      {selectedFarmer.full_name.charAt(0)}
                    </span>
                  </div>
                </>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                {getStatusBadge(selectedFarmer.verification_status)}
              </div>

              {/* Rejection Alert */}
              {selectedFarmer.verification_status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">প্রোফাইল প্রত্যাখ্যাত</h4>
                      <p className="text-sm text-red-700 mt-1">
                        আপনার প্রোফাইল প্রত্যাখ্যাত হয়েছে। সঠিক তথ্য দিয়ে পুনরায় আপডেট করার জন্য অনুগ্রহ করে অফিসে যোগাযোগ করুন।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  ব্যক্তিগত তথ্য
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">পূর্ণ নাম</label>
                    <p className="text-base text-gray-800 mt-1">{selectedFarmer.full_name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">মোবাইল নম্বর</label>
                    <p className="text-base text-gray-800 mt-1">{selectedFarmer.phone_number}</p>
                  </div>
                  
                  {selectedFarmer.date_of_birth && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">জন্ম তারিখ</label>
                      <p className="text-base text-gray-800 mt-1">{selectedFarmer.date_of_birth}</p>
                    </div>
                  )}
                  
                  {selectedFarmer.nid_number && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">জাতীয় পরিচয়পত্র নম্বর</label>
                      <p className="text-base text-gray-800 mt-1">{selectedFarmer.nid_number}</p>
                    </div>
                  )}
                  
                  {selectedFarmer.father_name && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">পিতার নাম</label>
                      <p className="text-base text-gray-800 mt-1">{selectedFarmer.father_name}</p>
                    </div>
                  )}
                  
                  {selectedFarmer.mother_name && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">মাতার নাম</label>
                      <p className="text-base text-gray-800 mt-1">{selectedFarmer.mother_name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  ঠিকানা
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {selectedFarmer.division && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">বিভাগ</label>
                      <p className="text-base text-gray-800 mt-1">{selectedFarmer.division}</p>
                    </div>
                  )}
                  
                  {selectedFarmer.district && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">জেলা</label>
                      <p className="text-base text-gray-800 mt-1">{selectedFarmer.district}</p>
                    </div>
                  )}
                  
                  {selectedFarmer.upazila && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">উপজেলা</label>
                      <p className="text-base text-gray-800 mt-1">{selectedFarmer.upazila}</p>
                    </div>
                  )}
                  
                  {selectedFarmer.union && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">ইউনিয়ন</label>
                      <p className="text-base text-gray-800 mt-1">{selectedFarmer.union}</p>
                    </div>
                  )}
                  
                  {selectedFarmer.post_office && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">পোস্ট অফিস</label>
                      <p className="text-base text-gray-800 mt-1">{selectedFarmer.post_office}</p>
                    </div>
                  )}
                  
                  {selectedFarmer.village && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">গ্রাম</label>
                      <p className="text-base text-gray-800 mt-1">{selectedFarmer.village}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {(!selectedFarmer.verification_status || selectedFarmer.verification_status === 'pending') && (
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => handleVerification(selectedFarmer.user_id, 'approved')}
                    disabled={processingId === selectedFarmer.user_id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {processingId === selectedFarmer.user_id ? 'প্রক্রিয়াকরণ...' : 'অনুমোদন করুন'}
                  </Button>
                  
                  <Button
                    onClick={() => handleVerification(selectedFarmer.user_id, 'rejected')}
                    disabled={processingId === selectedFarmer.user_id}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {processingId === selectedFarmer.user_id ? 'প্রক্রিয়াকরণ...' : 'প্রত্যাখ্যান করুন'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {selectedCustomer && (
            <div className="space-y-6">
              {/* Profile Photo */}
              <div className="flex justify-center">
                <>
                  {selectedCustomer.profile_photo_url_full ? (
                    <img
                      src={selectedCustomer.profile_photo_url_full}
                      alt={selectedCustomer.full_name}
                      className="h-32 w-32 rounded-full object-cover border-4 border-blue-200 cursor-pointer hover:opacity-80"
                      onClick={() => window.open(selectedCustomer.profile_photo_url_full, '_blank')}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.removeAttribute('style');
                      }}
                    />
                  ) : null}
                  <div 
                    className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200"
                    style={{ display: selectedCustomer.profile_photo_url_full ? 'none' : 'flex' }}
                  >
                    <span className="text-4xl text-blue-600 font-bold">
                      {selectedCustomer.full_name.charAt(0)}
                    </span>
                  </div>
                </>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                {getStatusBadge(selectedCustomer.verification_status)}
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 mb-3">ব্যক্তিগত তথ্য</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">পূর্ণ নাম</label>
                    <p className="text-base text-gray-800 mt-1">{selectedCustomer.full_name}</p>
                  </div>

                  {selectedCustomer.father_name && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">পিতার নাম</label>
                      <p className="text-base text-gray-800 mt-1">{selectedCustomer.father_name}</p>
                    </div>
                  )}

                  {selectedCustomer.mother_name && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">মাতার নাম</label>
                      <p className="text-base text-gray-800 mt-1">{selectedCustomer.mother_name}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">মোবাইল নম্বর</label>
                    <p className="text-base text-gray-800 mt-1">{selectedCustomer.phone_number}</p>
                  </div>

                  {selectedCustomer.date_of_birth && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">জন্ম তারিখ</label>
                      <p className="text-base text-gray-800 mt-1">
                        {new Date(selectedCustomer.date_of_birth).toLocaleDateString('bn-BD')}
                      </p>
                    </div>
                  )}

                  {selectedCustomer.nid_number && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">এনআইডি নম্বর</label>
                      <p className="text-base text-gray-800 mt-1">{selectedCustomer.nid_number}</p>
                    </div>
                  )}
                </div>

                {/* NID Photo */}
                {selectedCustomer.nid_photo_url_full && (
                  <div className="border-t pt-4">
                    <label className="text-sm font-medium text-gray-500 block mb-2">এনআইডি ফটো</label>
                    {!nidPhotoError ? (
                      <img
                        src={selectedCustomer.nid_photo_url_full}
                        alt="NID"
                        className="max-w-md h-auto border rounded cursor-pointer hover:opacity-80"
                        onClick={() => window.open(selectedCustomer.nid_photo_url_full, '_blank')}
                        onError={() => setNidPhotoError(true)}
                      />
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                          <p className="text-sm text-yellow-800">এনআইডি ফটো লোড করা যায়নি</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Address Information */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-700 mb-3">ঠিকানা তথ্য</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCustomer.village && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">গ্রাম/এলাকা</label>
                        <p className="text-base text-gray-800 mt-1">{selectedCustomer.village}</p>
                      </div>
                    )}

                    {selectedCustomer.postal_code && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">পোস্টাল কোড</label>
                        <p className="text-base text-gray-800 mt-1">{selectedCustomer.postal_code}</p>
                      </div>
                    )}

                    {selectedCustomer.upazila && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">উপজেলা</label>
                        <p className="text-base text-gray-800 mt-1">{selectedCustomer.upazila}</p>
                      </div>
                    )}

                    {selectedCustomer.district && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">জেলা</label>
                        <p className="text-base text-gray-800 mt-1">{selectedCustomer.district}</p>
                      </div>
                    )}

                    {selectedCustomer.division && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">বিভাগ</label>
                        <p className="text-base text-gray-800 mt-1">{selectedCustomer.division}</p>
                      </div>
                    )}

                    {selectedCustomer.address && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-500">সম্পূর্ণ ঠিকানা</label>
                        <p className="text-base text-gray-800 mt-1">{selectedCustomer.address}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Information */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-700 mb-3">ব্যবসা তথ্য</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCustomer.business_name && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">ব্যবসার নাম</label>
                        <p className="text-base text-gray-800 mt-1">{selectedCustomer.business_name}</p>
                      </div>
                    )}

                    {selectedCustomer.business_type && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">ব্যবসার ধরণ</label>
                        <p className="text-base text-gray-800 mt-1">
                          {selectedCustomer.business_type === 'other' && selectedCustomer.custom_business_type
                            ? selectedCustomer.custom_business_type
                            : businessTypeMap[selectedCustomer.business_type] || selectedCustomer.business_type}
                        </p>
                      </div>
                    )}

                    {selectedCustomer.trade_license_number && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">ট্রেড লাইসেন্স নম্বর</label>
                        <p className="text-base text-gray-800 mt-1">{selectedCustomer.trade_license_number}</p>
                      </div>
                    )}

                    {selectedCustomer.established_year && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">প্রতিষ্ঠার বছর</label>
                        <p className="text-base text-gray-800 mt-1">{selectedCustomer.established_year}</p>
                      </div>
                    )}

                    {selectedCustomer.business_address && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-500">ব্যবসার ঠিকানা</label>
                        <p className="text-base text-gray-800 mt-1">{selectedCustomer.business_address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {(!selectedCustomer.verification_status || selectedCustomer.verification_status === 'pending') && (
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => handleVerification(selectedCustomer.user_id, 'approved')}
                    disabled={processingId === selectedCustomer.user_id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {processingId === selectedCustomer.user_id ? 'প্রক্রিয়াকরণ...' : 'অনুমোদন করুন'}
                  </Button>
                  
                  <Button
                    onClick={() => handleVerification(selectedCustomer.user_id, 'rejected')}
                    disabled={processingId === selectedCustomer.user_id}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {processingId === selectedCustomer.user_id ? 'প্রক্রিয়াকরণ...' : 'প্রত্যাখ্যান করুন'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Expert Profile View */}
          {selectedExpert && (
            <div className="space-y-6">
              {/* Profile Photo */}
              <div className="flex justify-center">
                <>
                  {selectedExpert.profile_photo_url_full ? (
                    <img
                      src={selectedExpert.profile_photo_url_full}
                      alt={selectedExpert.full_name}
                      className="h-32 w-32 rounded-full object-cover border-4 border-purple-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.removeAttribute('style');
                      }}
                    />
                  ) : null}
                  <div 
                    className="h-32 w-32 rounded-full bg-purple-100 flex items-center justify-center border-4 border-purple-200"
                    style={{ display: selectedExpert.profile_photo_url_full ? 'none' : 'flex' }}
                  >
                    <span className="text-4xl text-purple-600 font-bold">
                      {selectedExpert.full_name.charAt(0)}
                    </span>
                  </div>
                </>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                {getStatusBadge(selectedExpert.verification_status)}
              </div>

              {/* Rejection Alert */}
              {selectedExpert.verification_status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        আপনার প্রোফাইল প্রত্যাখ্যাত হয়েছে
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        সংশোধনের জন্য অফিসে যোগাযোগ করুন।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">ব্যক্তিগত তথ্য</h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">পূর্ণ নাম</label>
                    <p className="text-base text-gray-800 mt-1">{selectedExpert.full_name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">মোবাইল নম্বর</label>
                    <p className="text-base text-gray-800 mt-1">{selectedExpert.phone_number}</p>
                  </div>

                  {selectedExpert.date_of_birth && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">জন্ম তারিখ</label>
                      <p className="text-base text-gray-800 mt-1">
                        {new Date(selectedExpert.date_of_birth).toLocaleDateString('bn-BD')}
                      </p>
                    </div>
                  )}

                  {selectedExpert.nid_number && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">এনআইডি নম্বর</label>
                      <p className="text-base text-gray-800 mt-1">{selectedExpert.nid_number}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Certification Document */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">সার্টিফিকেট ডকুমেন্ট</h4>
                {selectedExpert.certification_document_url ? (
                  !certDocError ? (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src={selectedExpert.certification_document_url}
                          alt="Certification Document"
                          className="max-w-full h-auto rounded-lg border-2 border-blue-200 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => window.open(selectedExpert.certification_document_url, '_blank')}
                          onError={() => setCertDocError(true)}
                        />
                        <p className="text-sm text-gray-600">
                          📄 সার্টিফিকেট বড় করে দেখতে ছবিতে ক্লিক করুন
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                        <p className="text-sm text-yellow-800">
                          সার্টিফিকেট ডকুমেন্ট লোড করা যায়নি
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                      <p className="text-sm text-yellow-800">
                        কোন সার্টিফিকেট ডকুমেন্ট জমা দেওয়া হয়নি
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Expert Qualification Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">পেশাগত যোগ্যতা</h4>
                <div className="grid grid-cols-2 gap-4 bg-purple-50 rounded-lg p-4">
                  {selectedExpert.qualification && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">শিক্ষাগত যোগ্যতা</label>
                      <p className="text-base text-gray-800 mt-1">{selectedExpert.qualification}</p>
                    </div>
                  )}

                  {selectedExpert.specialization && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">বিশেষত্ব</label>
                      <p className="text-base text-gray-800 mt-1">{selectedExpert.specialization}</p>
                    </div>
                  )}

                  {selectedExpert.institution && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">প্রতিষ্ঠান</label>
                      <p className="text-base text-gray-800 mt-1">{selectedExpert.institution}</p>
                    </div>
                  )}

                  {selectedExpert.experience_years && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">অভিজ্ঞতা</label>
                      <p className="text-base text-gray-800 mt-1">{selectedExpert.experience_years} বছর</p>
                    </div>
                  )}

                  {selectedExpert.license_number && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">লাইসেন্স নম্বর</label>
                      <p className="text-base text-gray-800 mt-1">{selectedExpert.license_number}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">সরকারি অনুমোদন</label>
                    <p className="text-base text-gray-800 mt-1">
                      {selectedExpert.is_government_approved ? 'হ্যাঁ' : 'না'}
                    </p>
                  </div>

                  {selectedExpert.rating !== undefined && selectedExpert.rating !== null && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">রেটিং</label>
                      <p className="text-base text-gray-800 mt-1">
                        ⭐ {typeof selectedExpert.rating === 'number' ? selectedExpert.rating.toFixed(1) : selectedExpert.rating} / 5.0
                      </p>
                    </div>
                  )}

                  {selectedExpert.total_consultations !== undefined && selectedExpert.total_consultations !== null && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">মোট পরামর্শ</label>
                      <p className="text-base text-gray-800 mt-1">
                        {selectedExpert.total_consultations} টি পরামর্শ সম্পন্ন
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">ঠিকানা তথ্য</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedExpert.division && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">বিভাগ</label>
                      <p className="text-base text-gray-800 mt-1">{selectedExpert.division}</p>
                    </div>
                  )}

                  {selectedExpert.district && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">জেলা</label>
                      <p className="text-base text-gray-800 mt-1">{selectedExpert.district}</p>
                    </div>
                  )}

                  {selectedExpert.upazila && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">উপজেলা</label>
                      <p className="text-base text-gray-800 mt-1">{selectedExpert.upazila}</p>
                    </div>
                  )}

                  {selectedExpert.post_office && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">পোস্ট অফিস</label>
                      <p className="text-base text-gray-800 mt-1">{selectedExpert.post_office}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {(!selectedExpert.verification_status || selectedExpert.verification_status === 'pending') && (
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => handleVerification(selectedExpert.user_id, 'approved')}
                    disabled={processingId === selectedExpert.user_id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {processingId === selectedExpert.user_id ? 'প্রক্রিয়াকরণ...' : 'অনুমোদন করুন'}
                  </Button>
                  
                  <Button
                    onClick={() => handleVerification(selectedExpert.user_id, 'rejected')}
                    disabled={processingId === selectedExpert.user_id}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {processingId === selectedExpert.user_id ? 'প্রক্রিয়াকরণ...' : 'প্রত্যাখ্যান করুন'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProfileVerification;
