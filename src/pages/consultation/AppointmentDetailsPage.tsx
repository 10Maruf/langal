import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
    Calendar,
    Clock,
    Video,
    Phone,
    MessageCircle,
    Loader2,
    CheckCircle,
    XCircle,
    ArrowLeft,
    User,
    FileText,
    Star,
    FileHeart,
} from "lucide-react";
import {
    getAppointmentById,
    Appointment,
    updateAppointmentStatus,
    cancelAppointment,
    completeAppointment,
} from "@/services/consultationService";
import { getProfilePhotoUrl } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const AppointmentDetailsPage = () => {
    const navigate = useNavigate();
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const { user } = useAuth();
    const { toast } = useToast();

    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const isExpert = user?.type === "expert";

    useEffect(() => {
        if (appointmentId) {
            fetchAppointment();
        }
    }, [appointmentId]);

    const fetchAppointment = async () => {
        try {
            setLoading(true);
            const response = await getAppointmentById(parseInt(appointmentId!));
            if (response.success) {
                setAppointment(response.data);
            } else {
                toast({
                    title: "ত্রুটি",
                    description: "অ্যাপয়েন্টমেন্ট তথ্য লোড করতে ব্যর্থ",
                    variant: "destructive",
                });
            }
        } catch (err) {
            console.error("Error fetching appointment:", err);
            toast({
                title: "ত্রুটি",
                description: "সার্ভারে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            setProcessing(true);
            const response = await updateAppointmentStatus(parseInt(appointmentId!), "confirm");
            if (response.success) {
                toast({
                    title: "সফল!",
                    description: "অ্যাপয়েন্টমেন্ট অনুমোদন করা হয়েছে",
                });
                fetchAppointment();
            }
        } catch (err) {
            toast({
                title: "ত্রুটি",
                description: "অনুমোদন করতে ব্যর্থ",
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        try {
            setProcessing(true);
            const response = await updateAppointmentStatus(
                parseInt(appointmentId!),
                "reject",
                "বিশেষজ্ঞ কর্তৃক প্রত্যাখ্যাত"
            );
            if (response.success) {
                toast({
                    title: "প্রত্যাখ্যাত",
                    description: "অ্যাপয়েন্টমেন্ট প্রত্যাখ্যান করা হয়েছে",
                });
                fetchAppointment();
            }
        } catch (err) {
            toast({
                title: "ত্রুটি",
                description: "প্রত্যাখ্যান করতে ব্যর্থ",
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleCancel = async () => {
        try {
            setProcessing(true);
            const response = await cancelAppointment(parseInt(appointmentId!), "ব্যবহারকারী কর্তৃক বাতিল");
            if (response.success) {
                toast({
                    title: "বাতিল",
                    description: "অ্যাপয়েন্টমেন্ট বাতিল করা হয়েছে",
                });
                fetchAppointment();
            }
        } catch (err) {
            toast({
                title: "ত্রুটি",
                description: "বাতিল করতে ব্যর্থ",
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleComplete = async () => {
        try {
            setProcessing(true);
            const response = await completeAppointment(parseInt(appointmentId!));
            if (response.success) {
                toast({
                    title: "সফল!",
                    description: "অ্যাপয়েন্টমেন্ট সম্পন্ন করা হয়েছে",
                });
                fetchAppointment();
            }
        } catch (err) {
            toast({
                title: "ত্রুটি",
                description: "সম্পন্ন করতে ব্যর্থ",
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleJoinCall = () => {
        if (appointment?.consultation_type === "chat") {
            navigate(`/consultation/chat/${appointmentId}`);
        } else {
            navigate(`/consultation/call/${appointmentId}`);
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-amber-100 text-amber-700",
            confirmed: "bg-green-100 text-green-700",
            completed: "bg-gray-100 text-gray-700",
            cancelled: "bg-red-100 text-red-700",
        };
        const labels: Record<string, string> = {
            pending: "অপেক্ষমান",
            confirmed: "নিশ্চিত",
            completed: "সম্পন্ন",
            cancelled: "বাতিল",
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
                return { icon: <Video className="h-5 w-5" />, label: "ভিডিও কল", color: "text-blue-600" };
            case "audio":
            case "audio_call":
                return { icon: <Phone className="h-5 w-5" />, label: "অডিও কল", color: "text-green-600" };
            case "chat":
                return { icon: <MessageCircle className="h-5 w-5" />, label: "চ্যাট", color: "text-purple-600" };
            default:
                return { icon: <MessageCircle className="h-5 w-5" />, label: type, color: "text-gray-600" };
        }
    };

    const formatDateTime = (appointment: Appointment) => {
        let dateStr = appointment.scheduled_at;
        if (!dateStr || isNaN(new Date(dateStr).getTime())) {
            const appointmentDate = appointment.appointment_date;
            const startTime = appointment.start_time;
            if (appointmentDate && startTime) {
                dateStr = `${String(appointmentDate).split("T")[0]}T${startTime}`;
            }
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return {
                date: String(appointment.appointment_date)?.split("T")[0] || "তারিখ নেই",
                time: appointment.start_time || "সময় নেই",
            };
        }
        return {
            date: date.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" }),
            time: date.toLocaleTimeString("bn-BD", { hour: "numeric", minute: "2-digit", hour12: true }),
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex flex-col items-center justify-center py-20 pt-24">
                    <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-3" />
                    <p className="text-gray-500">লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex flex-col items-center justify-center py-20 pt-24">
                    <XCircle className="h-12 w-12 text-red-500 mb-3" />
                    <p className="text-gray-500">অ্যাপয়েন্টমেন্ট পাওয়া যায়নি</p>
                    <Button onClick={() => navigate(-1)} className="mt-4">
                        ফিরে যান
                    </Button>
                </div>
            </div>
        );
    }

    const { date, time } = formatDateTime(appointment);
    const consultationType = getConsultationTypeInfo(appointment.consultation_type);

    // Get the other party's info
    const otherParty = isExpert
        ? {
            name: (appointment.farmer as any)?.profile?.full_name || "কৃষক",
            avatar: (appointment.farmer as any)?.profile?.profile_photo_url,
            role: "কৃষক",
        }
        : {
            name: (appointment.expert as any)?.profile?.full_name || "বিশেষজ্ঞ",
            avatar: (appointment.expert as any)?.profile?.profile_photo_url,
            role: "বিশেষজ্ঞ",
        };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />

            {/* Back Button */}
            <div className="bg-white px-4 py-3 flex items-center gap-3 border-b mt-14">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold">অ্যাপয়েন্টমেন্ট বিস্তারিত</h1>
            </div>

            <div className="p-4 space-y-4">
                {/* Status Card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-14 w-14">
                                    <AvatarImage src={getProfilePhotoUrl(otherParty.avatar)} />
                                    <AvatarFallback>{otherParty.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{otherParty.name}</h3>
                                    <p className="text-sm text-muted-foreground">{otherParty.role}</p>
                                </div>
                            </div>
                            {getStatusBadge(appointment.status)}
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <span>{date}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <span>{time}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={consultationType.color}>{consultationType.icon}</span>
                                <span>{consultationType.label}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Problem Description */}
                {(appointment.problem_description || appointment.problem_description_bn) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                সমস্যার বিবরণ
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {appointment.problem_description_bn || appointment.problem_description}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    {/* Expert Actions for Pending */}
                    {isExpert && appointment.status === "pending" && (
                        <div className="flex gap-3">
                            <Button
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={handleApprove}
                                disabled={processing}
                            >
                                {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                অনুমোদন করুন
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={handleReject}
                                disabled={processing}
                            >
                                {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                                প্রত্যাখ্যান করুন
                            </Button>
                        </div>
                    )}

                    {/* Join Call Button for Confirmed */}
                    {appointment.status === "confirmed" && (
                        <>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleJoinCall}>
                                {consultationType.icon}
                                <span className="ml-2">
                                    {appointment.consultation_type === "chat" ? "চ্যাট শুরু করুন" : "কলে যোগ দিন"}
                                </span>
                            </Button>
                            
                            {isExpert && (
                                <div className="flex gap-3">
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        onClick={handleComplete}
                                        disabled={processing}
                                    >
                                        {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                        সম্পন্ন করুন
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                                        onClick={() => navigate(`/consultation/prescription/${appointmentId}`)}
                                    >
                                        <FileHeart className="h-4 w-4 mr-2" />
                                        প্রেসক্রিপশন
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Cancel Button for Pending/Confirmed */}
                    {(appointment.status === "pending" || appointment.status === "confirmed") && (
                        <Button
                            variant="outline"
                            className="w-full text-red-600 border-red-200 hover:bg-red-50"
                            onClick={handleCancel}
                            disabled={processing}
                        >
                            {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                            অ্যাপয়েন্টমেন্ট বাতিল করুন
                        </Button>
                    )}

                    {/* Feedback Button for Completed */}
                    {/* {appointment.status === "completed" && !isExpert && (
                        <Button
                            className="w-full"
                            onClick={() => navigate(`/consultation/feedback/${appointmentId}`)}
                        >
                            <Star className="h-4 w-4 mr-2" />
                            ফিডব্যাক দিন
                        </Button>
                    )} */}

                    {/* View Prescription Button for Completed */}
                    {appointment.status === "completed" && (
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => navigate(`/consultation/prescription/view/${appointmentId}`)}
                        >
                            <FileHeart className="h-4 w-4 mr-2" />
                            প্রেসক্রিপশন দেখুন
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailsPage;
