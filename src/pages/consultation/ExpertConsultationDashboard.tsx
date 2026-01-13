import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useToast } from "@/hooks/use-toast";
import {
    Calendar,
    Clock,
    Users,
    Star,
    Video,
    Phone,
    MessageCircle,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    ChevronRight,
    Bell,
    ArrowLeft,
} from "lucide-react";
import {
    getMyAppointments,
    Appointment,
    updateAppointmentStatus,
    getExpertStats,
} from "@/services/consultationService";
import { getProfilePhotoUrl } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface ExpertStats {
    total_appointments: number;
    completed_appointments: number;
    pending_appointments: number;
    average_rating: number;
    total_reviews: number;
}

const ExpertConsultationDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();

    const [stats, setStats] = useState<ExpertStats | null>(null);
    const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
    const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, pendingRes, todayRes] = await Promise.all([
                getExpertStats(),
                getMyAppointments({ status: "pending" }),
                getMyAppointments({ status: "confirmed,scheduled" }),
            ]);

            if (statsRes.success) {
                setStats(statsRes.data);
            }

            if (pendingRes.success) {
                setPendingAppointments(pendingRes.data || []);
            }

            if (todayRes.success) {
                // Filter for today's appointments
                const today = new Date().toDateString();
                const todayAppts = (todayRes.data || []).filter(
                    (apt: Appointment) => new Date(apt.scheduled_at).toDateString() === today
                );
                setTodayAppointments(todayAppts);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (appointmentId: number) => {
        try {
            setProcessingId(appointmentId);
            const response = await updateAppointmentStatus(appointmentId, "confirm");
            if (response.success) {
                toast({
                    title: "সফল!",
                    description: "অ্যাপয়েন্টমেন্ট অনুমোদন করা হয়েছে",
                });
                fetchData();
            } else {
                toast({
                    title: "ত্রুটি",
                    description: response.message || "অনুমোদন করতে ব্যর্থ হয়েছে",
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
            setProcessingId(null);
        }
    };

    const handleReject = async (appointmentId: number) => {
        try {
            setProcessingId(appointmentId);
            const response = await updateAppointmentStatus(appointmentId, "reject", "বিশেষজ্ঞ কর্তৃক প্রত্যাখ্যাত");
            if (response.success) {
                toast({
                    title: "প্রত্যাখ্যাত",
                    description: "অ্যাপয়েন্টমেন্ট প্রত্যাখ্যান করা হয়েছে",
                });
                fetchData();
            }
        } catch (err) {
            toast({
                title: "ত্রুটি",
                description: "সার্ভারে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setProcessingId(null);
        }
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

        if (!dateStr || isNaN(new Date(dateStr).getTime())) {
            const appointmentDate = appointment.appointment_date;
            const startTime = appointment.start_time;
            if (appointmentDate && startTime) {
                dateStr = `${String(appointmentDate).split('T')[0]}T${startTime}`;
            }
        }

        const date = new Date(dateStr);

        if (isNaN(date.getTime())) {
            return {
                date: String(appointment.appointment_date)?.split('T')[0] || "তারিখ নেই",
                time: appointment.start_time || "সময় নেই",
            };
        }

        return {
            date: date.toLocaleDateString("bn-BD", { day: "numeric", month: "short" }),
            time: date.toLocaleTimeString("bn-BD", { hour: "numeric", minute: "2-digit", hour12: true }),
        };
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
        <div className="min-h-screen bg-gray-50 pb-20">
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
                    <h1 className="text-base font-semibold text-gray-900">পরামর্শ ড্যাশবোর্ড</h1>
                    <p className="text-xs text-gray-500">আপনার অ্যাপয়েন্টমেন্ট পরিচালনা করুন</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="px-4 py-3">
                <div className="grid grid-cols-3 gap-2">
                    <Card>
                        <CardContent className="p-3 text-center">
                            <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                            <p className="text-lg font-bold text-gray-900">
                                {stats?.total_appointments || 0}
                            </p>
                            <p className="text-[10px] text-gray-500">মোট পরামর্শ</p>
                        </CardContent>
                    </Card>
                    {/* <Card>
                        <CardContent className="p-3 text-center">
                            <Star className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                            <p className="text-lg font-bold text-gray-900">
                                {stats?.average_rating?.toFixed(1) || "0.0"}
                            </p>
                            <p className="text-[10px] text-gray-500">গড় রেটিং</p>
                        </CardContent>
                    </Card> */}
                    <Card>
                        <CardContent className="p-3 text-center">
                            <Bell className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                            <p className="text-lg font-bold text-gray-900">
                                {pendingAppointments.length}
                            </p>
                            <p className="text-[10px] text-gray-500">অপেক্ষমান</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Pending Requests */}
            {pendingAppointments.length > 0 && (
                <div className="px-4 py-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        অপেক্ষমান রিকোয়েস্ট ({pendingAppointments.length})
                    </h3>
                    <div className="space-y-3">
                        {pendingAppointments.slice(0, 3).map((appointment) => {
                            const { date, time } = formatDateTime(appointment);
                            const consultationType = getConsultationTypeInfo(appointment.consultation_type);
                            const farmerProfile = (appointment.farmer as any)?.profile;

                            return (
                                <Card key={appointment.appointment_id} className="border-l-4 border-l-orange-500">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src={getProfilePhotoUrl(farmerProfile?.profile_photo_url_full || farmerProfile?.profile_photo_url)}
                                                />
                                                <AvatarFallback className="bg-green-100 text-green-700">
                                                    {farmerProfile?.full_name?.charAt(0) || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">
                                                    {farmerProfile?.full_name || "কৃষক"}
                                                </h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                    <span>{date}</span>
                                                    <span>•</span>
                                                    <span>{time}</span>
                                                    <span>•</span>
                                                    <span className={consultationType.color}>
                                                        {consultationType.icon}
                                                    </span>
                                                </div>
                                                {appointment.problem_description && (
                                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                        {appointment.problem_description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                                onClick={() => handleApprove(appointment.appointment_id)}
                                                disabled={processingId === appointment.appointment_id}
                                            >
                                                {processingId === appointment.appointment_id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        অনুমোদন
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                                onClick={() => handleReject(appointment.appointment_id)}
                                                disabled={processingId === appointment.appointment_id}
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                প্রত্যাখ্যান
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                        {pendingAppointments.length > 3 && (
                            <Button
                                variant="ghost"
                                className="w-full text-green-600"
                                onClick={() => navigate("/consultation/appointments")}
                            >
                                সব দেখুন ({pendingAppointments.length})
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Today's Schedule */}
            <div className="px-4 py-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    আজকের সময়সূচী
                </h3>
                {todayAppointments.length > 0 ? (
                    <div className="space-y-3">
                        {todayAppointments.map((appointment) => {
                            const { time } = formatDateTime(appointment);
                            const consultationType = getConsultationTypeInfo(appointment.consultation_type);
                            const farmerProfile = (appointment.farmer as any)?.profile;

                            return (
                                <Card
                                    key={appointment.appointment_id}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => navigate(`/consultation/appointment/${appointment.appointment_id}`)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-green-100 rounded-lg p-2">
                                                    <Clock className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{time}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {farmerProfile?.full_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={consultationType.color}>
                                                    {consultationType.icon}
                                                    <span className="ml-1">{consultationType.label}</span>
                                                </Badge>
                                                <ChevronRight className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="bg-gray-50">
                        <CardContent className="p-6 text-center">
                            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">আজকে কোন অ্যাপয়েন্টমেন্ট নেই</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-4">
                <h3 className="font-semibold text-gray-800 mb-3">দ্রুত কার্যক্রম</h3>
                <div className="grid grid-cols-3 gap-2">
                    <Button
                        variant="outline"
                        className="h-auto py-3 flex flex-col items-center gap-1"
                        onClick={() => navigate("/consultation/availability")}
                    >
                        <Clock className="h-5 w-5 text-green-600" />
                        <span className="text-xs">সময়সূচী</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-auto py-3 flex flex-col items-center gap-1"
                        onClick={() => navigate("/consultation/appointments")}
                    >
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="text-xs">অ্যাপয়েন্টমেন্ট</span>
                    </Button>
                    {/* <Button
                        variant="outline"
                        className="h-auto py-3 flex flex-col items-center gap-1"
                        onClick={() => navigate("/consultation/prescriptions")}
                    >
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                        <span className="text-xs">প্রেসক্রিপশন</span>
                    </Button> */}
                </div>
            </div>
        </div>
    );
};

export default ExpertConsultationDashboard;
