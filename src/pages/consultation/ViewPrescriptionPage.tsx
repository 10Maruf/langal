import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, FileHeart, Stethoscope, Pill, Calendar, AlertCircle } from "lucide-react";
import api from "@/services/api";

interface Prescription {
    prescription_id: number;
    appointment_id: number;
    diagnosis: string;
    diagnosis_bn: string;
    prescription: string;
    prescription_bn: string;
    recommended_products: any[];
    follow_up_needed: boolean;
    follow_up_date: string | null;
    follow_up_notes: string | null;
    severity: string;
    created_at: string;
    expert?: {
        profile?: {
            full_name: string;
        };
    };
}

const ViewPrescriptionPage = () => {
    const navigate = useNavigate();
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const { toast } = useToast();

    const [prescription, setPrescription] = useState<Prescription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrescription();
    }, [appointmentId]);

    const fetchPrescription = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/appointments/${appointmentId}/prescription`);
            if (response.data.success) {
                const data = response.data.data;
                // Parse JSON strings to arrays
                if (typeof data.recommended_products === 'string') {
                    data.recommended_products = JSON.parse(data.recommended_products || '[]');
                }
                setPrescription(data);
            } else {
                toast({
                    title: "ত্রুটি",
                    description: "প্রেসক্রিপশন খুঁজে পাওয়া যায়নি",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("Error fetching prescription:", error);
            toast({
                title: "ত্রুটি",
                description: error.response?.data?.message || "প্রেসক্রিপশন লোড করতে ব্যর্থ",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getSeverityBadge = (severity: string) => {
        const colors: Record<string, string> = {
            mild: "bg-green-100 text-green-700",
            moderate: "bg-yellow-100 text-yellow-700",
            severe: "bg-orange-100 text-orange-700",
            critical: "bg-red-100 text-red-700",
        };
        const labels: Record<string, string> = {
            mild: "সাধারণ",
            moderate: "মাঝারি",
            severe: "গুরুতর",
            critical: "অতি গুরুতর",
        };
        return (
            <Badge className={colors[severity] || colors.moderate}>
                {labels[severity] || severity}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
                <Header />
                <div className="flex items-center justify-center pt-32">
                    <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                </div>
            </div>
        );
    }

    if (!prescription) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
                <Header />
                <div className="pt-16 px-4 pb-2 flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full bg-white/50 backdrop-blur-sm"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </Button>
                    <h1 className="text-xl font-bold text-gray-900">প্রেসক্রিপশন</h1>
                </div>
                <div className="px-4 pt-8 text-center">
                    <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">এই অ্যাপয়েন্টমেন্টের জন্য কোন প্রেসক্রিপশন নেই</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20">
            <Header />

            <div className="pt-16 px-4 pb-2 flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="rounded-full bg-white/50 backdrop-blur-sm"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-700" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900">প্রেসক্রিপশন</h1>
                    <p className="text-xs text-gray-500">বিশেষজ্ঞের পরামর্শ</p>
                </div>
            </div>

            <div className="px-4 space-y-4">
                {/* Expert Info */}
                {prescription.expert && (
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">বিশেষজ্ঞ</p>
                                    <p className="font-semibold">{prescription.expert.profile?.full_name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">তারিখ</p>
                                    <p className="font-semibold text-sm">
                                        {new Date(prescription.created_at).toLocaleDateString("bn-BD")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Diagnosis */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-green-600" />
                            রোগ নির্ণয়
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {prescription.diagnosis_bn || prescription.diagnosis}
                        </p>
                    </CardContent>
                </Card>

                {/* Prescription */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileHeart className="h-4 w-4 text-green-600" />
                            পরামর্শ ও চিকিৎসা
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {prescription.prescription_bn || prescription.prescription}
                        </p>
                    </CardContent>
                </Card>

                {/* Medications */}
                {prescription.recommended_products && prescription.recommended_products.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Pill className="h-4 w-4 text-green-600" />
                                ওষুধ ও সার
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {prescription.recommended_products.map((med: any, index: number) => (
                                <div key={index} className="border-l-4 border-green-500 pl-3 py-2">
                                    <p className="font-semibold text-gray-900">{med.name || med.name_bn}</p>
                                    {med.dosage && (
                                        <p className="text-sm text-gray-600">মাত্রা: {med.dosage}</p>
                                    )}
                                    {med.frequency && (
                                        <p className="text-sm text-gray-600">কতবার: {med.frequency}</p>
                                    )}
                                    {med.duration && (
                                        <p className="text-sm text-gray-600">সময়কাল: {med.duration}</p>
                                    )}
                                    {med.instructions && (
                                        <p className="text-sm text-gray-600 mt-1 italic">{med.instructions}</p>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Follow-up */}
                {prescription.follow_up_needed && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-green-600" />
                                পরবর্তী পরামর্শ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {prescription.follow_up_date && (
                                <div>
                                    <p className="text-sm text-gray-500">তারিখ</p>
                                    <p className="font-semibold">
                                        {new Date(prescription.follow_up_date).toLocaleDateString("bn-BD", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            )}
                            {prescription.follow_up_notes && (
                                <div>
                                    <p className="text-sm text-gray-500">নোট</p>
                                    <p className="text-gray-700">{prescription.follow_up_notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ViewPrescriptionPage;
