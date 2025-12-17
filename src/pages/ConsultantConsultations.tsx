import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Phone, Video, User, Clock, Star, Filter, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConsultationRequest {
    id: string;
    farmerName: string;
    farmerPhone: string;
    location: string;
    topic: string;
    description: string;
    preferredTime: string;
    urgency: "low" | "medium" | "high";
    status: "pending" | "scheduled" | "in-progress" | "completed" | "cancelled";
    type: "voice" | "video" | "text";
    requestedAt: string;
    scheduledAt?: string;
}

const ConsultantConsultations = () => {
    const { toast } = useToast();
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
    const [responseMessage, setResponseMessage] = useState("");

    const [consultations, setConsultations] = useState<ConsultationRequest[]>([
        {
            id: "1",
            farmerName: "আব্দুল করিম",
            farmerPhone: "01712345678",
            location: "নোয়াখালী, সদর",
            topic: "ধানের রোগবালাই",
            description: "আমার ধান গাছে বাদামী দাগ দেখা দিয়েছে। কী করব? জরুরি পরামর্শ দরকার।",
            preferredTime: "সকাল ৯টা থেকে ১১টা",
            urgency: "high",
            status: "pending",
            type: "voice",
            requestedAt: "2024-01-15T10:30:00Z"
        },
        {
            id: "2",
            farmerName: "ফাতেমা খাতুন",
            farmerPhone: "01787654321",
            location: "কুমিল্লা, দেবিদ্বার",
            topic: "সবজি চাষ পরামর্শ",
            description: "রবি মৌসুমে কোন সবজি চাষ করলে ভালো লাভ হবে? জমির পরিমাণ ২ বিঘা।",
            preferredTime: "বিকাল ২টা থেকে ৪টা",
            urgency: "medium",
            status: "scheduled",
            type: "video",
            requestedAt: "2024-01-15T09:15:00Z",
            scheduledAt: "2024-01-16T14:00:00Z"
        },
        {
            id: "3",
            farmerName: "মোহাম্মদ আলী",
            farmerPhone: "01856789012",
            location: "সিলেট, গোলাপগঞ্জ",
            topic: "মাছ চাষ",
            description: "পুকুরে মাছ চাষের জন্য কী কী প্রস্তুতি নিতে হবে? খরচ কেমন হবে?",
            preferredTime: "সন্ধ্যা ৬টা থেকে ৮টা",
            urgency: "low",
            status: "completed",
            type: "voice",
            requestedAt: "2024-01-14T15:45:00Z",
            scheduledAt: "2024-01-15T18:00:00Z"
        }
    ]);

    const handleScheduleConsultation = (consultationId: string, scheduledTime: string) => {
        setConsultations(consultations.map(consultation =>
            consultation.id === consultationId
                ? {
                    ...consultation,
                    status: "scheduled",
                    scheduledAt: new Date(scheduledTime).toISOString()
                }
                : consultation
        ));

        toast({
            title: "পরামর্শ নির্ধারিত হয়েছে",
            description: "কৃষককে সময়সূচী জানানো হয়েছে।",
        });
    };

    const handleCompleteConsultation = (consultationId: string) => {
        setConsultations(consultations.map(consultation =>
            consultation.id === consultationId
                ? { ...consultation, status: "completed" }
                : consultation
        ));

        toast({
            title: "পরামর্শ সম্পূর্ণ",
            description: "পরামর্শ সেশন সফলভাবে সম্পন্ন হয়েছে।",
        });
    };

    const handleSendResponse = (consultationId: string) => {
        if (!responseMessage.trim()) {
            toast({
                title: "বার্তা খালি",
                description: "অনুগ্রহ করে একটি বার্তা লিখুন।",
                variant: "destructive"
            });
            return;
        }

        toast({
            title: "বার্তা পাঠানো হয়েছে",
            description: "আপনার উত্তর কৃষকের কাছে পাঠানো হয়েছে।",
        });

        setResponseMessage("");
        setSelectedConsultation(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "scheduled": return "bg-blue-100 text-blue-800 border-blue-200";
            case "in-progress": return "bg-purple-100 text-purple-800 border-purple-200";
            case "completed": return "bg-green-100 text-green-800 border-green-200";
            case "cancelled": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending": return "অপেক্ষমান";
            case "scheduled": return "নির্ধারিত";
            case "in-progress": return "চলমান";
            case "completed": return "সম্পূর্ণ";
            case "cancelled": return "বাতিল";
            default: return "অজানা";
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case "high": return "text-red-600";
            case "medium": return "text-yellow-600";
            case "low": return "text-green-600";
            default: return "text-gray-600";
        }
    };

    const getUrgencyText = (urgency: string) => {
        switch (urgency) {
            case "high": return "জরুরি";
            case "medium": return "মাঝারি";
            case "low": return "সাধারণ";
            default: return "অজানা";
        }
    };

    const filteredConsultations = consultations.filter(consultation => {
        if (activeFilter === "all") return true;
        return consultation.status === activeFilter;
    });

    const filterOptions = [
        { value: "all", label: "সব পরামর্শ", count: consultations.length },
        { value: "pending", label: "অপেক্ষমান", count: consultations.filter(c => c.status === "pending").length },
        { value: "scheduled", label: "নির্ধারিত", count: consultations.filter(c => c.status === "scheduled").length },
        { value: "completed", label: "সম্পূর্ণ", count: consultations.filter(c => c.status === "completed").length },
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="p-4">
                    <h1 className="text-xl font-bold">পরামর্শ সেবা কেন্দ্র</h1>
                    <p className="text-sm text-muted-foreground">কৃষকদের পরামর্শ অনুরোধ পরিচালনা করুন</p>
                </div>
            </div>

            {/* Statistics */}
            <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {consultations.filter(c => c.status === "pending").length}
                            </div>
                            <div className="text-xs text-muted-foreground">অপেক্ষমান</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {consultations.filter(c => c.status === "scheduled").length}
                            </div>
                            <div className="text-xs text-muted-foreground">নির্ধারিত</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {consultations.filter(c => c.status === "completed").length}
                            </div>
                            <div className="text-xs text-muted-foreground">সম্পূর্ণ</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {consultations.filter(c => c.urgency === "high").length}
                            </div>
                            <div className="text-xs text-muted-foreground">জরুরি</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto mb-6">
                    {filterOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant={activeFilter === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveFilter(option.value)}
                            className="whitespace-nowrap"
                        >
                            {option.label}
                            <Badge variant="secondary" className="ml-2">
                                {option.count}
                            </Badge>
                        </Button>
                    ))}
                </div>

                {/* Consultations List */}
                <div className="space-y-4">
                    {filteredConsultations.map((consultation) => (
                        <Card key={consultation.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            {consultation.farmerName}
                                            {consultation.type === "voice" && <Phone className="h-4 w-4 text-blue-600" />}
                                            {consultation.type === "video" && <Video className="h-4 w-4 text-green-600" />}
                                            {consultation.type === "text" && <MessageSquare className="h-4 w-4 text-gray-600" />}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {consultation.location} • {consultation.farmerPhone}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <Badge className={getStatusColor(consultation.status)}>
                                            {getStatusText(consultation.status)}
                                        </Badge>
                                        <Badge variant="outline" className={getUrgencyColor(consultation.urgency)}>
                                            {getUrgencyText(consultation.urgency)}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-sm mb-1">বিষয়:</h4>
                                        <p className="text-sm text-primary">{consultation.topic}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-sm mb-1">বিবরণ:</h4>
                                        <p className="text-sm bg-muted p-3 rounded">{consultation.description}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-sm mb-1">পছন্দের সময়:</h4>
                                        <p className="text-sm flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {consultation.preferredTime}
                                        </p>
                                    </div>

                                    {consultation.scheduledAt && (
                                        <div>
                                            <h4 className="font-medium text-sm mb-1">নির্ধারিত সময়:</h4>
                                            <p className="text-sm text-blue-600">
                                                {new Date(consultation.scheduledAt).toLocaleString('bn-BD')}
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2">
                                        {consultation.status === "pending" && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setSelectedConsultation(consultation)}
                                                >
                                                    <MessageSquare className="h-4 w-4 mr-1" />
                                                    উত্তর দিন
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        const scheduledTime = prompt("সময় নির্ধারণ করুন (YYYY-MM-DD HH:MM format):");
                                                        if (scheduledTime) {
                                                            handleScheduleConsultation(consultation.id, scheduledTime);
                                                        }
                                                    }}
                                                >
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    সময় নির্ধারণ
                                                </Button>
                                            </>
                                        )}

                                        {consultation.status === "scheduled" && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {consultation.type === "voice" && <Phone className="h-4 w-4 mr-1" />}
                                                    {consultation.type === "video" && <Video className="h-4 w-4 mr-1" />}
                                                    {consultation.type === "text" && <MessageSquare className="h-4 w-4 mr-1" />}
                                                    পরামর্শ শুরু
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleCompleteConsultation(consultation.id)}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    সম্পূর্ণ করুন
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Response Modal */}
            {selectedConsultation && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <CardTitle>উত্তর প্রেরণ করুন</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {selectedConsultation.farmerName} এর জন্য
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">প্রশ্ন:</h4>
                                <p className="text-sm bg-muted p-3 rounded">
                                    {selectedConsultation.description}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium">আপনার উত্তর:</label>
                                <Textarea
                                    placeholder="বিস্তারিত পরামর্শ লিখুন..."
                                    value={responseMessage}
                                    onChange={(e) => setResponseMessage(e.target.value)}
                                    rows={6}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleSendResponse(selectedConsultation.id)}
                                    className="flex-1"
                                >
                                    উত্তর পাঠান
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedConsultation(null);
                                        setResponseMessage("");
                                    }}
                                >
                                    বাতিল
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ConsultantConsultations;
