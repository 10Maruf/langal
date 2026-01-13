import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Plus, X, FileHeart, Stethoscope } from "lucide-react";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
}

const PrescriptionPage = () => {
    const navigate = useNavigate();
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const { toast } = useToast();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [diagnosis, setDiagnosis] = useState("");
    const [prescriptionDetails, setPrescriptionDetails] = useState("");
    const [medications, setMedications] = useState<Medication[]>([
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" }
    ]);
    const [preventiveMeasures, setPreventiveMeasures] = useState("");
    const [followUpRequired, setFollowUpRequired] = useState(false);
    const [followUpDate, setFollowUpDate] = useState("");
    const [followUpNotes, setFollowUpNotes] = useState("");

    const addMedication = () => {
        setMedications([
            ...medications,
            { name: "", dosage: "", frequency: "", duration: "", instructions: "" }
        ]);
    };

    const removeMedication = (index: number) => {
        setMedications(medications.filter((_, i) => i !== index));
    };

    const updateMedication = (index: number, field: keyof Medication, value: string) => {
        const updated = [...medications];
        updated[index][field] = value;
        setMedications(updated);
    };

    const handleSubmit = async () => {
        if (!diagnosis || !prescriptionDetails) {
            toast({
                title: "ত্রুটি",
                description: "রোগ নির্ণয় এবং পরামর্শ প্রয়োজন",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await api.post(
                `/appointments/${appointmentId}/prescription`,
                {
                    diagnosis,
                    diagnosis_bn: diagnosis,
                    prescription_details: prescriptionDetails,
                    prescription_details_bn: prescriptionDetails,
                    medications: medications.filter(m => m.name),
                    preventive_measures: preventiveMeasures,
                    preventive_measures_bn: preventiveMeasures,
                    follow_up_required: followUpRequired,
                    follow_up_date: followUpDate || null,
                    follow_up_notes: followUpNotes,
                }
            );

            if (response.data.success) {
                toast({
                    title: "সফল!",
                    description: "প্রেসক্রিপশন সংরক্ষিত হয়েছে",
                });
                navigate(-1);
            }
        } catch (error: any) {
            console.error("Error saving prescription:", error);
            toast({
                title: "ত্রুটি",
                description: error.response?.data?.message || "প্রেসক্রিপশন সংরক্ষণ করতে ব্যর্থ",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

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
                <h1 className="text-xl font-bold text-gray-900">প্রেসক্রিপশন লিখুন</h1>
            </div>

            <div className="px-4 space-y-4">
                {/* Diagnosis */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-green-600" />
                            রোগ নির্ণয়
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <Label>রোগ নির্ণয়</Label>
                            <Textarea
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder="রোগের বিবরণ লিখুন (বাংলা/English)..."
                                className="mt-1"
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Prescription Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileHeart className="h-4 w-4 text-green-600" />
                            পরামর্শ ও চিকিৎসা
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <Label>চিকিৎসার পরামর্শ</Label>
                            <Textarea
                                value={prescriptionDetails}
                                onChange={(e) => setPrescriptionDetails(e.target.value)}
                                placeholder="চিকিৎসার পরামর্শ লিখুন (বাংলা/English)..."
                                className="mt-1"
                                rows={5}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Medications */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">ওষুধ ও সার</CardTitle>
                        <Button size="sm" onClick={addMedication} variant="outline">
                            <Plus className="h-4 w-4 mr-1" />
                            যোগ করুন
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {medications.map((med, index) => (
                            <div key={index} className="border rounded-lg p-3 space-y-2 relative">
                                {medications.length > 1 && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 h-6 w-6"
                                        onClick={() => removeMedication(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                                <div>
                                    <Label className="text-xs">ওষুধ/সার/কীটনাশকের নাম</Label>
                                    <Input
                                        value={med.name}
                                        onChange={(e) => updateMedication(index, "name", e.target.value)}
                                        placeholder="নাম লিখুন (বাংলা/English)..."
                                        className="mt-1"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <Label className="text-xs">মাত্রা</Label>
                                        <Input
                                            value={med.dosage}
                                            onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                                            placeholder="e.g., 100ml"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">কতবার</Label>
                                        <Input
                                            value={med.frequency}
                                            onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                                            placeholder="e.g., 2x daily"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">সময়কাল</Label>
                                        <Input
                                            value={med.duration}
                                            onChange={(e) => updateMedication(index, "duration", e.target.value)}
                                            placeholder="e.g., 7 days"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs">নির্দেশনা</Label>
                                    <Textarea
                                        value={med.instructions}
                                        onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                                        placeholder="Usage instructions..."
                                        className="mt-1"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Preventive Measures */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">প্রতিরোধমূলক ব্যবস্থা</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <Label>প্রতিরোধমূলক ব্যবস্থা</Label>
                            <Textarea
                                value={preventiveMeasures}
                                onChange={(e) => setPreventiveMeasures(e.target.value)}
                                placeholder="প্রতিরোধমূলক ব্যবস্থা লিখুন (বাংলা/English)..."
                                className="mt-1"
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Follow-up */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">পরবর্তী পরামর্শ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="followUp"
                                checked={followUpRequired}
                                onChange={(e) => setFollowUpRequired(e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="followUp">পরবর্তী পরামর্শ প্রয়োজন</Label>
                        </div>
                        {followUpRequired && (
                            <>
                                <div>
                                    <Label>তারিখ</Label>
                                    <Input
                                        type="date"
                                        value={followUpDate}
                                        onChange={(e) => setFollowUpDate(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label>নোট</Label>
                                    <Textarea
                                        value={followUpNotes}
                                        onChange={(e) => setFollowUpNotes(e.target.value)}
                                        placeholder="Follow-up notes..."
                                        className="mt-1"
                                        rows={2}
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            সংরক্ষণ করা হচ্ছে...
                        </>
                    ) : (
                        <>
                            <FileHeart className="h-4 w-4 mr-2" />
                            প্রেসক্রিপশন সংরক্ষণ করুন
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default PrescriptionPage;
