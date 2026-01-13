import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TTSButton } from "@/components/ui/tts-button";
import { useToast } from "@/hooks/use-toast";
import {
    Calendar,
    Clock,
    Video,
    Phone,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    CheckCircle,
    Info,
    ArrowLeft,
} from "lucide-react";
import {
    getExpertById,
    Expert,
    getExpertAvailableSlots,
    AvailableSlot,
    createAppointment,
} from "@/services/consultationService";
import { getProfilePhotoUrl } from "@/lib/utils";

const BookAppointmentPage = () => {
    const navigate = useNavigate();
    const { expertId } = useParams<{ expertId: string }>();
    const { toast } = useToast();

    const [expert, setExpert] = useState<Expert | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
    const [consultationType, setConsultationType] = useState<"video" | "audio" | "chat">("video");
    const [urgency, setUrgency] = useState<"low" | "medium" | "high">("medium");
    const [problemDescription, setProblemDescription] = useState("");
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);

    // Generate next 14 days
    const [dates, setDates] = useState<{ date: string; dayName: string; dayNum: string; isToday: boolean }[]>([]);

    useEffect(() => {
        generateDates();
        if (expertId) {
            fetchExpertData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expertId]);

    useEffect(() => {
        if (selectedDate && expertId) {
            fetchAvailableSlots();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, expertId]);

    const generateDates = () => {
        const dayNames = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];
        const today = new Date();
        const newDates = [];

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Fix timezone issue: using toISOString() converts to UTC, which might be previous day
            // Instead, manually construct local date string YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const localDateStr = `${year}-${month}-${day}`;

            newDates.push({
                date: localDateStr,
                dayName: dayNames[date.getDay()],
                dayNum: date.getDate().toString(),
                isToday: i === 0,
            });
        }

        setDates(newDates);
        setSelectedDate(newDates[0].date);
    };

    const fetchExpertData = async () => {
        try {
            setLoading(true);
            const response = await getExpertById(expertId!);
            if (response.success) {
                // Handle response format: { success, data: { expert: {} } }
                const expertData = response.data?.expert || response.data;
                setExpert(expertData);
            } else {
                setError("বিশেষজ্ঞের তথ্য লোড করতে ব্যর্থ হয়েছে");
            }
        } catch (err) {
            console.error("Error fetching expert:", err);
            setError("সার্ভারে সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            setSlotsLoading(true);
            const response = await getExpertAvailableSlots(expertId!, selectedDate);
            console.log('Available slots response:', response);
            if (response.success) {
                // Handle both structure formats (array directly or nested in slots property)
                const slotsData = response.data?.slots || response.data || [];
                console.log('Parsed slots data:', slotsData);
                setAvailableSlots(Array.isArray(slotsData) ? slotsData : []);
            }
        } catch (err) {
            console.error("Error fetching slots:", err);
        } finally {
            setSlotsLoading(false);
        }
    };

    const formatTime = (time: string): string => {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours);
        const period = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${formattedHour}:${minutes} ${period}`;
    };

    const handleSubmit = async () => {
        if (!selectedSlot) {
            toast({
                title: "সময় নির্বাচন করুন",
                description: "অনুগ্রহ করে একটি সময় স্লট নির্বাচন করুন",
                variant: "destructive",
            });
            return;
        }

        if (!problemDescription.trim()) {
            toast({
                title: "সমস্যা লিখুন",
                description: "অনুগ্রহ করে আপনার সমস্যার বিবরণ দিন",
                variant: "destructive",
            });
            return;
        }

        try {
            setSubmitting(true);

            // Map consultation type to backend format
            const typeMapping: Record<string, string> = {
                'audio': 'audio_call',
                'video': 'video_call',
                'chat': 'chat'
            };

            // Map urgency to integer
            const urgencyMapping: Record<string, number> = {
                'low': 1,
                'medium': 2,
                'high': 3
            };

            const payload = {
                // Use expert.user_id if available, otherwise fallback to expertId (assuming it might be user_id)
                expert_id: expert?.user_id || parseInt(expertId!),
                consultation_type: (typeMapping[consultationType] || consultationType) as any,
                appointment_date: selectedDate,
                start_time: selectedSlot.start_time,
                // scheduled_at is not needed by backend, using date+time
                duration_minutes: selectedSlot.duration_minutes || 30,
                urgency_level: urgencyMapping[urgency] || 2,
                problem_description: problemDescription,
            };

            const response = await createAppointment(payload);

            if (response.success) {
                toast({
                    title: "সফল!",
                    description: "আপনার অ্যাপয়েন্টমেন্ট রিকোয়েস্ট পাঠানো হয়েছে",
                });
                navigate("/consultation/appointments");
            } else {
                toast({
                    title: "ত্রুটি",
                    description: response.message || "অ্যাপয়েন্টমেন্ট তৈরি করতে ব্যর্থ হয়েছে",
                    variant: "destructive",
                });
            }
        } catch (err) {
            console.error("Error creating appointment:", err);
            toast({
                title: "ত্রুটি",
                description: "সার্ভারে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
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
                    <AlertCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
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

            {/* Back Button Header */}
            <div className="bg-white px-4 py-3 flex items-center gap-3 border-b mt-14">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="-ml-2 hover:bg-gray-100 rounded-full h-9 w-9"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Button>
                <div>
                    <h1 className="text-base font-semibold text-gray-900">পরামর্শ বুক করুন</h1>
                    <p className="text-xs text-gray-500">সময় ও ধরন নির্বাচন করুন</p>
                </div>
            </div>

            {/* Expert Card - Compact */}
            <div className="px-4 py-3">
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                    <Avatar className="h-11 w-11 border-2 border-green-100">
                        <AvatarImage
                            src={getProfilePhotoUrl(expert.user?.profile?.avatar_url)}
                            alt={expert.user?.profile?.full_name}
                        />
                        <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                            {expert.user?.profile?.full_name?.charAt(0) || "?"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                            {expert.user?.profile?.full_name}
                        </h3>
                        <p className="text-xs text-green-600">
                            {expert.specialization_bn || expert.specialization}
                        </p>
                    </div>
                </div>
            </div>

            {/* Date Selection */}
            <div className="px-4 mb-3">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-green-600" />
                    তারিখ নির্বাচন
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                    {dates.map((d) => (
                        <button
                            key={d.date}
                            onClick={() => setSelectedDate(d.date)}
                            className={`flex-shrink-0 w-14 py-2.5 rounded-lg text-center transition-all ${selectedDate === d.date
                                    ? "bg-green-600 text-white shadow-sm"
                                    : "bg-white border border-gray-200 text-gray-700 hover:border-green-300"
                                }`}
                        >
                            <p className="text-[10px] opacity-80">{d.isToday ? "আজ" : d.dayName}</p>
                            <p className="text-base font-semibold">{d.dayNum}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Slot Selection */}
            <div className="px-4 mb-3">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-green-600" />
                    সময় নির্বাচন
                </h3>
                {slotsLoading ? (
                    <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
                    </div>
                ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-1.5">
                        {availableSlots.map((slot, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedSlot(slot)}
                                disabled={!slot.is_available}
                                className={`py-2 px-1 rounded-lg text-xs font-medium transition-all ${selectedSlot?.start_time === slot.start_time
                                        ? "bg-green-600 text-white shadow-sm"
                                        : slot.is_available
                                            ? "bg-white border border-gray-200 text-gray-700 hover:border-green-300"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {formatTime(slot.start_time)}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 bg-white rounded-lg border border-gray-100">
                        <Clock className="h-6 w-6 text-gray-300 mx-auto mb-1" />
                        <p className="text-gray-500 text-xs">এই তারিখে স্লট নেই</p>
                    </div>
                )}
            </div>

            {/* Consultation Type - No Fee Display */}
            {/* <div className="px-4 mb-3">
                <h3 className="text-sm font-medium text-gray-700 mb-2">পরামর্শের ধরন</h3>
                <RadioGroup
                    value={consultationType}
                    onValueChange={(v) => setConsultationType(v as "video" | "audio" | "chat")}
                    className="grid grid-cols-3 gap-2"
                >
                    <Label
                        htmlFor="video"
                        className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all ${consultationType === "video"
                                ? "border-green-600 bg-green-50"
                                : "border-gray-200 bg-white"
                            }`}
                    >
                        <RadioGroupItem value="video" id="video" className="sr-only" />
                        <Video className={`h-5 w-5 mb-1 ${consultationType === "video" ? "text-green-600" : "text-gray-400"}`} />
                        <span className="text-xs font-medium">ভিডিও কল</span>
                    </Label>

                    <Label
                        htmlFor="audio"
                        className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all ${consultationType === "audio"
                                ? "border-green-600 bg-green-50"
                                : "border-gray-200 bg-white"
                            }`}
                    >
                        <RadioGroupItem value="audio" id="audio" className="sr-only" />
                        <Phone className={`h-5 w-5 mb-1 ${consultationType === "audio" ? "text-green-600" : "text-gray-400"}`} />
                        <span className="text-xs font-medium">অডিও কল</span>
                    </Label>

                    <Label
                        htmlFor="chat"
                        className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all ${consultationType === "chat"
                                ? "border-green-600 bg-green-50"
                                : "border-gray-200 bg-white"
                            }`}
                    >
                        <RadioGroupItem value="chat" id="chat" className="sr-only" />
                        <MessageCircle className={`h-5 w-5 mb-1 ${consultationType === "chat" ? "text-green-600" : "text-gray-400"}`} />
                        <span className="text-xs font-medium">চ্যাট</span>
                    </Label>
                </RadioGroup>
            </div> */}

            {/* Urgency Level */}
            {/* <div className="px-4 mb-3">
                <h3 className="text-sm font-medium text-gray-700 mb-2">জরুরী অবস্থা</h3>
                <RadioGroup
                    value={urgency}
                    onValueChange={(v) => setUrgency(v as "low" | "medium" | "high")}
                    className="flex gap-2"
                >
                    <Label
                        htmlFor="low"
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-lg border cursor-pointer text-xs font-medium ${urgency === "low" ? "border-green-600 bg-green-50 text-green-700" : "border-gray-200 bg-white text-gray-600"
                            }`}
                    >
                        <RadioGroupItem value="low" id="low" className="sr-only" />
                        সাধারণ
                    </Label>
                    <Label
                        htmlFor="medium"
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-lg border cursor-pointer text-xs font-medium ${urgency === "medium" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-gray-200 bg-white text-gray-600"
                            }`}
                    >
                        <RadioGroupItem value="medium" id="medium" className="sr-only" />
                        মাঝারি
                    </Label>
                    <Label
                        htmlFor="high"
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-lg border cursor-pointer text-xs font-medium ${urgency === "high" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 bg-white text-gray-600"
                            }`}
                    >
                        <RadioGroupItem value="high" id="high" className="sr-only" />
                        জরুরী
                    </Label>
                </RadioGroup>
            </div> */}

            {/* Problem Description */}
            <div className="px-4 mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">সমস্যার বিবরণ</h3>
                <Textarea
                    placeholder="আপনার ফসল বা কৃষি সংক্রান্ত সমস্যাটি সংক্ষেপে লিখুন..."
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    rows={3}
                    className="resize-none text-sm bg-white border-gray-200"
                />
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    বিস্তারিত লিখলে বিশেষজ্ঞ ভালো সাহায্য করতে পারবেন
                </p>
            </div>

            {/* Fixed Bottom - No Fee */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 shadow-lg">
                <div className="max-w-lg mx-auto">
                    <Button
                        className="w-full bg-green-600 hover:bg-green-700 h-11 rounded-lg text-sm font-medium"
                        onClick={handleSubmit}
                        disabled={submitting || !selectedSlot}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                প্রক্রিয়াকরণ...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                রিকোয়েস্ট পাঠান
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Floating TTS - Smaller 
            <div className="fixed bottom-20 right-4">
                <TTSButton
                    text="এখানে আপনি বিশেষজ্ঞের সাথে পরামর্শের জন্য সময় বুক করতে পারেন। প্রথমে তারিখ নির্বাচন করুন, তারপর সময় এবং পরামর্শের ধরন বেছে নিন।"
                    className="bg-green-600 hover:bg-green-700 h-12 w-12 rounded-full shadow-lg"
                />
            </div> */}
        </div>
    );
};

export default BookAppointmentPage;
