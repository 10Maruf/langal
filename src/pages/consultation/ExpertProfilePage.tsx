import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TTSButton } from "@/components/ui/tts-button";
import {
  Star,
  Phone,
  Video,
  MessageCircle,
  Award,
  Clock,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  CheckCircle,
  Users,
  Loader2,
  ThumbsUp,
  ArrowLeft,
} from "lucide-react";
import { getExpertById, Expert, getExpertAvailability, AvailabilitySlot, Feedback } from "@/services/consultationService";
import { getProfilePhotoUrl } from "@/lib/utils";

const ExpertProfilePage = () => {
  const navigate = useNavigate();
  const { expertId } = useParams<{ expertId: string }>();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    if (expertId) {
      fetchExpertData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expertId]);

  const fetchExpertData = async () => {
    try {
      setLoading(true);
      const [expertRes, availabilityRes] = await Promise.all([
        getExpertById(expertId!),
        getExpertAvailability(expertId!),
      ]);

      if (expertRes.success) {
        // Handle response format: { success, data: { expert: {} } }
        const expertData = expertRes.data?.expert || expertRes.data;
        setExpert(expertData);
      } else {
        setError("বিশেষজ্ঞের তথ্য লোড করতে ব্যর্থ হয়েছে");
      }

      if (availabilityRes.success) {
        setAvailability(availabilityRes.data || []);
      }
    } catch (err) {
      console.error("Error fetching expert data:", err);
      setError("সার্ভারে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${star <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300"
              }`}
          />
        ))}
      </div>
    );
  };

  const getDayName = (day: number): string => {
    const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
    return days[day] || "";
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${formattedHour}:${minutes} ${period}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-20 pt-24">
          <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-3" />
          <p className="text-gray-500">তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Header />
        <div className="text-center py-20 pt-24">
          <p className="text-red-500">{error || "বিশেষজ্ঞ খুঁজে পাওয়া যায়নি"}</p>
          <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
            ফিরে যান
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header />

      {/* Mobile Header with Back Button */}
      <div className="bg-white px-4 py-2 flex items-center gap-2 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="-ml-2 hover:bg-green-50 rounded-full h-8 w-8"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <span className="text-sm font-medium text-gray-500">ফিরে যান</span>
      </div>

      {/* Profile Header */}
      <div className="bg-white px-4 pb-6 pt-2">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-28 w-28 border-4 border-green-50 shadow-sm mb-4">
            <AvatarImage
              src={getProfilePhotoUrl(expert.user?.profile?.avatar_url)}
              alt={expert.user?.profile?.full_name}
            />
            <AvatarFallback className="bg-green-100 text-green-700 text-3xl">
              {expert.user?.profile?.full_name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-2xl font-bold flex flex-col items-center gap-1 text-gray-800">
            {expert.user?.profile?.full_name || "নাম নেই"}
            {expert.is_government_approved && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs px-2 py-0.5 rounded-full mt-1">
                <CheckCircle className="h-3 w-3 mr-1" /> সরকারি অনুমোদিত
              </Badge>
            )}
          </h2>

          <p className="text-green-600 font-medium mt-1 text-base">
            {expert.specialization_bn || expert.specialization}
          </p>

          <div className="flex items-center gap-2 mt-3 bg-gray-50 px-3 py-1 rounded-full">
            {renderStars(expert.rating)}
            <span className="text-sm text-gray-600 font-medium">
              {expert.rating.toFixed(1)} ({expert.total_reviews} রিভিউ)
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">{expert.experience_years}</p>
            <p className="text-xs text-gray-500 mt-1">বছর অভিজ্ঞতা</p>
          </div>
          <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">{expert.total_consultations}+</p>
            <p className="text-xs text-gray-500 mt-1">পরামর্শ</p>
          </div>
          {/* Rating moved to title, Fee removed */}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">পরিচিতি</TabsTrigger>
            <TabsTrigger value="schedule">সময়সূচী</TabsTrigger>
            {/* <TabsTrigger value="reviews">রিভিউ</TabsTrigger> */}
          </TabsList>

          <TabsContent value="about" className="mt-4 space-y-4">
            {/* Bio */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  পরিচয়
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {expert.bio_bn || expert.bio || "কোন তথ্য নেই"}
                </p>
              </CardContent>
            </Card>

            {/* Qualifications */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                  শিক্ষাগত যোগ্যতা
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expert.qualifications?.length ? (
                  <ul className="space-y-2">
                    {expert.qualifications.map((qual, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <Award className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {qual}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">তথ্য নেই</p>
                )}
              </CardContent>
            </Card>

            {/* Specialization Areas */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-600" />
                  বিশেষজ্ঞতার ক্ষেত্র
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {expert.expertise_areas?.map((area, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                      {area}
                    </Badge>
                  )) || <p className="text-gray-500 text-sm">তথ্য নেই</p>}
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          <TabsContent value="schedule" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  সাপ্তাহিক সময়সূচী
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availability.length > 0 ? (
                  <div className="space-y-3">
                    {availability.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="font-medium text-gray-700">
                            {getDayName(slot.day_of_week)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">সময়সূচী পাওয়া যায়নি</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="reviews" className="mt-4 space-y-4">
            {expert.recent_feedbacks?.length ? (
              expert.recent_feedbacks.map((feedback, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                          {feedback.farmer?.profile?.full_name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">
                            {feedback.farmer?.profile?.full_name || "কৃষক"}
                          </p>
                          <span className="text-xs text-gray-400">
                            {new Date(feedback.created_at).toLocaleDateString("bn-BD")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(feedback.rating)}
                        </div>
                        {feedback.comment && (
                          <p className="text-sm text-gray-600 mt-2">{feedback.comment}</p>
                        )}
                        {feedback.tags?.length && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {feedback.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <ThumbsUp className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">এখনও কোন রিভিউ নেই</p>
              </div>
            )}
          </TabsContent> */
        </Tabs>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 pb-6 md:pb-3">
        <div className="max-w-lg mx-auto w-full">
          <Button
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 rounded-xl text-lg h-12 shadow-md"
            onClick={() => navigate(`/consultation/book/${expertId}`)}
          >
            <Calendar className="h-5 w-5 mr-2" />
            সময় বুক করুন
          </Button>
        </div>
      </div>

      {/* Floating TTS */}
      <div className="fixed bottom-24 right-4 z-40">
        <TTSButton
          text={`${expert.user?.profile?.full_name} হলেন একজন ${expert.specialization_bn || expert.specialization} বিশেষজ্ঞ। তার ${expert.experience_years} বছরের অভিজ্ঞতা রয়েছে এবং ${expert.total_consultations}টিরও বেশি পরামর্শ দিয়েছেন।`}
          className="bg-green-600 hover:bg-green-700 h-14 w-14 rounded-full shadow-lg"
        />
      </div>
    </div>
  );
};

export default ExpertProfilePage;
