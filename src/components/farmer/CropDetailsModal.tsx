import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Clock,
    DollarSign,
    Wheat,
    Droplets,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Trash2,
    Loader2,
    Sprout,
    PlayCircle,
    XCircle,
} from "lucide-react";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CropTimeline from "@/components/farmer/CropTimeline";
import { toBengaliNumber } from "@/services/weatherService";

interface CropDetailsModalProps {
    cropId: number | null;
    isOpen: boolean;
    onClose: () => void;
    onCropUpdated?: () => void;
}

const CropDetailsModal = ({ cropId, isOpen, onClose, onCropUpdated }: CropDetailsModalProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [crop, setCrop] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [progress, setProgress] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [nextAction, setNextAction] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { toast } = useToast();

    const formatBanglaDate = (dateString: string) => {
        const banglaMonths = [
            'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
            'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
        ];
        const date = new Date(dateString);
        const day = toBengaliNumber(date.getDate());
        const month = banglaMonths[date.getMonth()];
        const year = toBengaliNumber(date.getFullYear());
        return `${day} ${month}, ${year}`;
    };

    const fetchCropDetails = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/recommendations/selected/${cropId}/details`);
            if (response.data.success) {
                setCrop(response.data.crop);
                setProgress(response.data.progress);
                setNextAction(response.data.next_action);
            }
        } catch (error) {
            console.error("Failed to fetch crop details:", error);
            toast({
                title: "ত্রুটি",
                description: "ফসলের তথ্য লোড করতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && cropId) {
            fetchCropDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, cropId]);

    const handleStatusUpdate = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            const response = await api.put(`/recommendations/selected/${cropId}/status`, {
                status: newStatus,
            });
            if (response.data.success) {
                toast({
                    title: "সফল",
                    description: "ফসলের স্ট্যাটাস আপডেট হয়েছে",
                });
                fetchCropDetails();
                onCropUpdated?.();
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemoveCrop = async () => {
        setIsUpdating(true);
        try {
            const response = await api.delete(`/recommendations/selected/${cropId}`);
            if (response.data.success) {
                toast({
                    title: "সফল",
                    description: "ফসল সরানো হয়েছে",
                });
                onCropUpdated?.();
                onClose();
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "ফসল সরাতে সমস্যা হয়েছে",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
            setShowDeleteDialog(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "planned":
                return "bg-blue-500";
            case "active":
                return "bg-green-500";
            case "completed":
                return "bg-gray-500";
            case "cancelled":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getStatusBangla = (status: string) => {
        switch (status) {
            case "planned":
                return "পরিকল্পিত";
            case "active":
                return "সক্রিয়";
            case "completed":
                return "সম্পন্ন";
            case "cancelled":
                return "বাতিল";
            default:
                return status;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            {crop?.crop_name_bn || "ফসলের বিস্তারিত"}
                            {crop && (
                                <Badge className={getStatusColor(crop.status)}>
                                    {getStatusBangla(crop.status)}
                                </Badge>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            ফসলের সম্পূর্ণ তথ্য, অগ্রগতি এবং নির্দেশনা
                        </DialogDescription>
                    </DialogHeader>

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : crop ? (
                        <div className="space-y-4">
                            {/* Progress Section */}
                            {progress && crop.status !== "cancelled" && (
                                <Card>
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">অগ্রগতি</h3>
                                            <span className="text-2xl font-bold text-primary">
                                                {progress.percentage}%
                                            </span>
                                        </div>
                                        <Progress value={progress.percentage} className="h-2" />
                                        <div className="grid grid-cols-3 gap-2 text-sm text-center">
                                            <div>
                                                <p className="text-muted-foreground">অতিবাহিত</p>
                                                <p className="font-semibold">{toBengaliNumber(progress.elapsed_days)} দিন</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">বাকি</p>
                                                <p className="font-semibold">{toBengaliNumber(progress.remaining_days)} দিন</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">মোট</p>
                                                <p className="font-semibold">{toBengaliNumber(progress.total_days)} দিন</p>
                                            </div>
                                        </div>
                                        {progress.is_overdue && (
                                            <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>সংগ্রহের তারিখ অতিক্রম করেছে</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Next Action */}
                            {nextAction && crop.status === "active" && (
                                <Card className="border-primary">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold mb-1">পরবর্তী কাজ</h3>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {toBengaliNumber(nextAction.days_until)} দিন পর: {nextAction.phase}
                                                </p>
                                                <ul className="text-sm space-y-1">
                                                    {nextAction.tasks?.map((task: string, idx: number) => (
                                                        <li key={idx}>• {task}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Description */}
                            {crop.description_bn && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-muted-foreground">{crop.description_bn}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Basic Info */}
                            <Card>
                                <CardContent className="pt-6 space-y-3">
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-muted-foreground">শুরুর তারিখ</p>
                                                <p className="font-medium">{formatBanglaDate(crop.start_date)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-muted-foreground">সংগ্রহের তারিখ</p>
                                                <p className="font-medium">{formatBanglaDate(crop.expected_harvest_date)}</p>
                                            </div>
                                        </div>
                                        {crop.duration_days && (
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-purple-600" />
                                                <div>
                                                    <p className="text-muted-foreground">সময়কাল</p>
                                                    <p className="font-medium">{toBengaliNumber(crop.duration_days)} দিন</p>
                                                </div>
                                            </div>
                                        )}
                                        {crop.yield_per_bigha && (
                                            <div className="flex items-center gap-2">
                                                <Wheat className="h-4 w-4 text-amber-600" />
                                                <div>
                                                    <p className="text-muted-foreground">ফলন</p>
                                                    <p className="font-medium">{crop.yield_per_bigha}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-green-600" />
                                            <div>
                                                <p className="text-muted-foreground">আনুমানিক খরচ</p>
                                                <p className="font-medium">৳{crop.estimated_cost}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                            <div>
                                                <p className="text-muted-foreground">আনুমানিক লাভ</p>
                                                <p className="font-medium text-green-600">৳{crop.estimated_profit}</p>
                                            </div>
                                        </div>
                                        {crop.market_price && (
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-blue-600" />
                                                <div>
                                                    <p className="text-muted-foreground">বাজার মূল্য</p>
                                                    <p className="font-medium">{crop.market_price}</p>
                                                </div>
                                            </div>
                                        )}
                                        {crop.water_requirement && (
                                            <div className="flex items-center gap-2">
                                                <Droplets className="h-4 w-4 text-blue-600" />
                                                <div>
                                                    <p className="text-muted-foreground">পানির প্রয়োজন</p>
                                                    <p className="font-medium">
                                                        {crop.water_requirement === 'low' ? 'কম' :
                                                            crop.water_requirement === 'medium' ? 'মাঝারি' :
                                                                crop.water_requirement === 'high' ? 'বেশি' : crop.water_requirement}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {crop.difficulty && (
                                            <div className="flex items-center gap-2">
                                                <Sprout className="h-4 w-4 text-emerald-600" />
                                                <div>
                                                    <p className="text-muted-foreground">কঠিনতা</p>
                                                    <p className="font-medium">
                                                        {crop.difficulty === 'easy' ? 'সহজ' :
                                                            crop.difficulty === 'medium' ? 'মাঝারি' :
                                                                crop.difficulty === 'hard' ? 'কঠিন' : crop.difficulty}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Status Actions */}
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold mb-3">স্ট্যাটাস পরিবর্তন করুন</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {crop.status === "planned" && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleStatusUpdate("active")}
                                                disabled={isUpdating}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <PlayCircle className="h-4 w-4 mr-2" />
                                                চাষ শুরু করুন
                                            </Button>
                                        )}
                                        {crop.status === "active" && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleStatusUpdate("completed")}
                                                disabled={isUpdating}
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                সংগ্রহ সম্পন্ন
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => setShowDeleteDialog(true)}
                                            disabled={isUpdating}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            ফসল সরান
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Separator />

                            {/* Cultivation Timeline */}
                            {crop.cultivation_plan && crop.cultivation_plan.length > 0 && progress && (
                                <CropTimeline
                                    cultivationPlan={crop.cultivation_plan}
                                    elapsedDays={progress.elapsed_days}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            ফসলের তথ্য পাওয়া যায়নি
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                        <AlertDialogDescription>
                            এই ফসলটি আপনার তালিকা থেকে সরানো হবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>বাতিল</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveCrop} className="bg-red-600 hover:bg-red-700">
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "হ্যাঁ, সরান"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CropDetailsModal;
