import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TTSButton } from "@/components/ui/tts-button";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  Loader2,
  CheckCircle,
  ThumbsUp,
} from "lucide-react";
import {
  getAppointmentById,
  Appointment,
  submitFeedback,
} from "@/services/consultationService";
import { getProfilePhotoUrl } from "@/lib/utils";

const FeedbackPage = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { toast } = useToast();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const feedbackTags = [
    { id: "helpful", label: "সহায়ক ছিলেন" },
    { id: "knowledgeable", label: "বিশেষজ্ঞ জ্ঞান" },
    { id: "friendly", label: "বন্ধুত্বপূর্ণ" },
    { id: "patient", label: "ধৈর্যশীল" },
    { id: "clear", label: "স্পষ্ট ব্যাখ্যা" },
    { id: "quick_response", label: "দ্রুত সাড়া" },
    { id: "professional", label: "পেশাদার" },
    { id: "recommend", label: "সুপারিশযোগ্য" },
  ];

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await getAppointmentById(parseInt(appointmentId!));
      if (response.success) {
        setAppointment(response.data);
      }
    } catch (err) {
      console.error("Error fetching appointment:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "রেটিং দিন",
        description: "অনুগ্রহ করে স্টার রেটিং দিন",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await submitFeedback({
        appointment_id: parseInt(appointmentId!),
        rating,
        comment: comment.trim() || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });

      if (response.success) {
        toast({
          title: "ধন্যবাদ!",
          description: "আপনার মতামত সফলভাবে জমা হয়েছে",
        });
        navigate("/consultation/appointments");
      } else {
        toast({
          title: "ত্রুটি",
          description: response.message || "মতামত জমা দিতে ব্যর্থ হয়েছে",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "ত্রুটি",
        description: "সার্ভারে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingText = (r: number) => {
    switch (r) {
      case 1:
        return "খুব খারাপ";
      case 2:
        return "খারাপ";
      case 3:
        return "মোটামুটি";
      case 4:
        return "ভালো";
      case 5:
        return "অসাধারণ!";
      default:
        return "রেটিং দিন";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-20 pt-24">
          <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-3" />
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      <Header />

      <div className="px-4 py-6 space-y-6 mt-14">
        {/* Expert Card */}
        {appointment?.expert && (
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16 border-2 border-white shadow">
                  <AvatarImage
                    src={getProfilePhotoUrl(appointment.expert.user?.profile?.avatar_url)}
                  />
                  <AvatarFallback className="bg-green-200 text-green-700 text-xl">
                    {appointment.expert.user?.profile?.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {appointment.expert.user?.profile?.full_name}
                  </h3>
                  <p className="text-sm text-green-700">
                    {appointment.expert.specialization_bn || appointment.expert.specialization}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Star Rating */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg">
              আপনার অভিজ্ঞতা কেমন ছিল?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                      }`}
                  />
                </button>
              ))}
            </div>
            <p
              className={`text-lg font-medium ${rating > 0 ? "text-amber-600" : "text-gray-400"
                }`}
            >
              {getRatingText(hoverRating || rating)}
            </p>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              বিশেষজ্ঞের সম্পর্কে বলুন (ঐচ্ছিক)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {feedbackTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1.5 text-sm ${selectedTags.includes(tag.id)
                      ? "bg-green-600 hover:bg-green-700"
                      : "hover:bg-green-50"
                    }`}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comment */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              বিস্তারিত মতামত (ঐচ্ছিক)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="আপনার অভিজ্ঞতা সম্পর্কে লিখুন..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <Button
          className="w-full bg-green-600 hover:bg-green-700 h-12 rounded-xl text-lg"
          onClick={handleSubmit}
          disabled={submitting || rating === 0}
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              জমা হচ্ছে...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              মতামত জমা দিন
            </>
          )}
        </Button>
      </div>

      {/* Floating TTS */}
      <div className="fixed bottom-24 right-4">
        <TTSButton
          text="এখানে আপনি বিশেষজ্ঞের সেবা সম্পর্কে আপনার মতামত দিতে পারেন। স্টার দিয়ে রেটিং করুন এবং চাইলে বিস্তারিত মন্তব্য লিখতে পারেন।"
          className="bg-green-600 hover:bg-green-700 h-14 w-14 rounded-full shadow-lg"
        />
      </div>
    </div>
  );
};

export default FeedbackPage;
