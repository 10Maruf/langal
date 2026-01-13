import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TTSButton } from "@/components/ui/tts-button";
import { useToast } from "@/hooks/use-toast";
import {
    Calendar,
    Clock,
    Video,
    Phone,
    MessageCircle,
    Loader2,
    AlertCircle,
    CheckCircle,
    XCircle,
    Star,
    ChevronRight,
    X,
    ArrowLeft,
    FileHeart,
} from "lucide-react";
import {
    getMyAppointments,
    Appointment,
    cancelAppointment,
    completeAppointment,
    getStatusColor,
    getConsultationTypeIcon,
} from "@/services/consultationService";
import { getProfilePhotoUrl } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const MyAppointmentsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("upcoming");
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [completingId, setCompletingId] = useState<number | null>(null);

    useEffect(() => {
        fetchAppointments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const status = activeTab === "upcoming" ? "confirmed,pending,scheduled" : activeTab === "past" ? "completed" : "cancelled";
            const response = await getMyAppointments({ status });
            if (response.success) {
                setAppointments(response.data || []);
            }
        } catch (err) {
            console.error("Error fetching appointments:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (appointmentId: number) => {
        try {
            setCancellingId(appointmentId);
            const response = await cancelAppointment(appointmentId, "কৃষক কর্তৃক বাতিল");
            if (response.success) {
                toast({
                    title: "সফল!",
                    description: "অ্যাপয়েন্টমেন্ট বাতিল করা হয়েছে",
                });
                fetchAppointments();
            } else {
                toast({
                    title: "ত্রুটি",
                    description: response.message || "বাতিল করতে ব্যর্থ হয়েছে",
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
            setCancellingId(null);
        }
    };

    const handleComplete = async (appointmentId: number) => {
        try {
            setCompletingId(appointmentId);
            const response = await completeAppointment(appointmentId);
            if (response.success) {
                toast({
                    title: "সফল!",
                    description: "অ্যাপয়েন্টমেন্ট সম্পন্ন করা হয়েছে",
                });
                fetchAppointments();
            } else {
                toast({
                    title: "ত্রুটি",
                    description: response.message || "সম্পন্ন করতে ব্যর্থ হয়েছে",
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
            setCompletingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-amber-100 text-amber-700",
            confirmed: "bg-green-100 text-green-700",
            scheduled: "bg-blue-100 text-blue-700",
            completed: "bg-gray-100 text-gray-700",
            cancelled: "bg-red-100 text-red-700",
            rejected: "bg-red-100 text-red-700",
        };

        const labels: Record<string, string> = {
            pending: "অপেক্ষমান",
            confirmed: "নিশ্চিত",
            scheduled: "নির্ধারিত",
            completed: "সম্পন্ন",
            cancelled: "বাতিল",
            rejected: "প্রত্যাখ্যাত",
        };

        return (
            <Badge className={colors[status] || "bg-gray-100 text-gray-700"}>
                {labels[status] || status}
            </Badge>
        );
    };

    const getConsultationTypeInfo = (type: string) => {
        switch (type) {
            case "video":
            case "video_call":
                return { icon: <Video className="h-4 w-4" />, label: "ভিডিও কল", color: "text-blue-600" };
            case "audio":
            case "audio_call":
                return { icon: <Phone className="h-4 w-4" />, label: "অডিও কল", color: "text-green-600" };
            case "chat":
                return { icon: <MessageCircle className="h-4 w-4" />, label: "চ্যাট", color: "text-purple-600" };
            default:
                return { icon: <MessageCircle className="h-4 w-4" />, label: type, color: "text-gray-600" };
        }
    };

    const formatDateTime = (appointment: Appointment) => {
        // Try scheduled_at first, then fallback to appointment_date + start_time
        let dateStr = appointment.scheduled_at;

        // If scheduled_at is not valid, construct from appointment_date and start_time
        if (!dateStr || dateStr === "Invalid Date" || isNaN(new Date(dateStr).getTime())) {
            const appointmentDate = appointment.appointment_date;
            const startTime = appointment.start_time;
            if (appointmentDate && startTime) {
                // Combine date and time
                dateStr = `${appointmentDate.split('T')[0]}T${startTime}`;
            }
        }

        const date = new Date(dateStr);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return {
                date: appointment.appointment_date?.split('T')[0] || "তারিখ নেই",
                time: appointment.start_time || "সময় নেই",
            };
        }

        const dateOptions: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        };
        return {
            date: date.toLocaleDateString("bn-BD", dateOptions),
            time: date.toLocaleTimeString("bn-BD", timeOptions),
        };
    };

    const isUpcoming = (appointment: Appointment) => {
        const dateStr = appointment.scheduled_at || `${appointment.appointment_date?.split('T')[0]}T${appointment.start_time}`;
        return new Date(dateStr) > new Date();
    };

    const handleJoinCall = (appointment: Appointment) => {
        if (appointment.consultation_type === "chat") {
            navigate(`/consultation/chat/${appointment.appointment_id}`);
        } else {
            navigate(`/consultation/call/${appointment.appointment_id}`);
        }
    };

    const renderAppointmentCard = (appointment: Appointment) => {
        const { date, time } = formatDateTime(appointment);
        const consultationType = getConsultationTypeInfo(appointment.consultation_type);
        const isExpert = user?.type === "expert";

        // Get the other party's info based on user type
        // Note: expert is a User object with profile nested inside
        const getOtherPartyInfo = () => {
            if (isExpert) {
                // Expert sees farmer info
                const farmerProfile = (appointment.farmer as any)?.profile;
                return {
                    name: farmerProfile?.full_name,
                    avatarUrl: farmerProfile?.profile_photo_url_full || farmerProfile?.profile_photo_url
                };
            }
            // Farmer sees expert info - expert is a User object directly
            const expertProfile = (appointment.expert as any)?.profile;
            return {
                name: expertProfile?.full_name,
                avatarUrl: expertProfile?.profile_photo_url_full || expertProfile?.profile_photo_url
            };
        };

        const otherPartyInfo = getOtherPartyInfo();

        return (
            <Card key={appointment.appointment_id} className="mb-4 overflow-hidden">
                <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-green-100">
                                <AvatarImage
                                    src={getProfilePhotoUrl(otherPartyInfo.avatarUrl)}
                                    alt={otherPartyInfo.name}
                                />
                                <AvatarFallback className="bg-green-100 text-green-700">
                                    {otherPartyInfo.name?.charAt(0) || "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {otherPartyInfo.name || "অজানা"}
                                </h3>
                                {!isExpert && (
                                    <p className="text-sm text-green-600">
                                        {appointment.expert_qualification?.specialization_bn || appointment.expert_qualification?.specialization || appointment.expert?.specialization}
                                    </p>
                                )}
                            </div>
                        </div>
                        {getStatusBadge(appointment.status)}
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-green-600" />
                            {date}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-green-600" />
                            {time}
                        </div>
                    </div>

                    {/* Consultation Type & Duration */}
                    <div className="flex items-center gap-4 mb-3 text-sm">
                        <div className={`flex items-center gap-1 ${consultationType.color}`}>
                            {consultationType.icon}
                            {consultationType.label}
                        </div>
                        <span className="text-gray-500">
                            {appointment.duration_minutes} মিনিট
                        </span>
                    </div>

                    {/* Problem Description */}
                    {appointment.problem_description && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {appointment.problem_description}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t">
                        {appointment.status === "confirmed" && isUpcoming(appointment) && (
                            <Button
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => handleJoinCall(appointment)}
                            >
                                {appointment.consultation_type === "chat" ? (
                                    <>
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        চ্যাট শুরু করুন
                                    </>
                                ) : (
                                    <>
                                        {appointment.consultation_type === "video" || appointment.consultation_type === "video_call" ? (
                                            <Video className="h-4 w-4 mr-2" />
                                        ) : (
                                            <Phone className="h-4 w-4 mr-2" />
                                        )}
                                        কলে যোগ দিন
                                    </>
                                )}
                            </Button>
                        )}

                        {(appointment.status === "confirmed" || appointment.status === "scheduled") && isExpert && (
                            <>
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    onClick={() => handleComplete(appointment.appointment_id)}
                                    disabled={completingId === appointment.appointment_id}
                                >
                                    {completingId === appointment.appointment_id ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                    )}
                                    সম্পন্ন করুন
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                                    onClick={() => navigate(`/consultation/prescription/${appointment.appointment_id}`)}
                                >
                                    <FileHeart className="h-4 w-4 mr-2" />
                                    প্রেসক্রিপশন
                                </Button>
                            </>
                        )}

                        {appointment.status === "pending" && !isExpert && (
                            <Button
                                variant="outline"
                                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => handleCancel(appointment.appointment_id)}
                                disabled={cancellingId === appointment.appointment_id}
                            >
                                {cancellingId === appointment.appointment_id ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <X className="h-4 w-4 mr-2" />
                                )}
                                বাতিল করুন
                            </Button>
                        )}

                        {/* {appointment.status === "completed" && !appointment.has_feedback && !isExpert && (
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => navigate(`/consultation/feedback/${appointment.appointment_id}`)}
                            >
                                <Star className="h-4 w-4 mr-2" />
                                রেটিং দিন
                            </Button>
                        )} */}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/consultation/appointment/${appointment.appointment_id}`)}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20">
            <Header />

            {/* Title Bar with Back Button */}
            <div className="pt-16 px-4 pb-2 flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="rounded-full bg-white/50 backdrop-blur-sm"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-700" />
                </Button>
                <h1 className="text-xl font-bold text-gray-900">আমার অ্যাপয়েন্টমেন্ট</h1>
            </div>

            {/* Tabs */}
            <div className="px-4 py-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="upcoming" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            আসন্ন
                        </TabsTrigger>
                        <TabsTrigger value="past" className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            সম্পন্ন
                        </TabsTrigger>
                        <TabsTrigger value="cancelled" className="flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            বাতিল
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="mt-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-3" />
                                <p className="text-gray-500">লোড হচ্ছে...</p>
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">কোন আসন্ন অ্যাপয়েন্টমেন্ট নেই</p>
                                {/* <Button
                                    onClick={() => navigate("/consultation/experts")}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    বিশেষজ্ঞ খুঁজুন
                                </Button> */}
                            </div>
                        ) : (
                            appointments.map(renderAppointmentCard)
                        )}
                    </TabsContent>

                    <TabsContent value="past" className="mt-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-3" />
                                <p className="text-gray-500">লোড হচ্ছে...</p>
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-12">
                                <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">কোন সম্পন্ন অ্যাপয়েন্টমেন্ট নেই</p>
                            </div>
                        ) : (
                            appointments.map(renderAppointmentCard)
                        )}
                    </TabsContent>

                    <TabsContent value="cancelled" className="mt-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-3" />
                                <p className="text-gray-500">লোড হচ্ছে...</p>
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-12">
                                <XCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">কোন বাতিল অ্যাপয়েন্টমেন্ট নেই</p>
                            </div>
                        ) : (
                            appointments.map(renderAppointmentCard)
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Floating TTS */}
            <div className="fixed bottom-24 right-4">
                <TTSButton
                    text="এখানে আপনি আপনার সকল অ্যাপয়েন্টমেন্ট দেখতে পাচ্ছেন। আসন্ন ট্যাবে আপনার নির্ধারিত অ্যাপয়েন্টমেন্ট এবং সম্পন্ন ট্যাবে পুরানো অ্যাপয়েন্টমেন্ট দেখতে পাবেন।"
                    className="bg-green-600 hover:bg-green-700 h-14 w-14 rounded-full shadow-lg"
                />
            </div>
        </div>
    );
};

export default MyAppointmentsPage;
