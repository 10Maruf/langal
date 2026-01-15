import { CheckCircle, Circle, Clock, Info, Pill, Lightbulb, Sprout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toBengaliNumber } from "@/services/weatherService";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface TimelinePhase {
    phase: string;
    days: string;
    tasks: string[];
    details?: string;
    medicines?: string[];
    advice?: string[];
    fertilizers?: Array<{
        name: string;
        amount: string;
    }>;
}

interface CropTimelineProps {
    cultivationPlan: TimelinePhase[];
    elapsedDays: number;
}

const CropTimeline = ({ cultivationPlan, elapsedDays }: CropTimelineProps) => {
    const [selectedPhase, setSelectedPhase] = useState<TimelinePhase | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleViewDetails = (phase: TimelinePhase) => {
        setSelectedPhase(phase);
        setIsDialogOpen(true);
    };

    const parsePhaseDay = (daysString: string): number | null => {
        const match = daysString.match(/Day (\d+)/);
        return match ? parseInt(match[1]) : null;
    };

    const parsePhaseDayRange = (daysString: string): { start: number; end: number } | null => {
        const match = daysString.match(/Day (\d+)-(\d+)/);
        if (match) {
            return { start: parseInt(match[1]), end: parseInt(match[2]) };
        }
        return null;
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">চাষাবাদের সময়রেখা</h3>
            <div className="relative pl-12">
                {/* Vertical line */}
                <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-border" />

                <div className="space-y-6">
                    {cultivationPlan.map((phase, idx) => {
                        const dayRange = parsePhaseDayRange(phase.days);
                        const phaseDay = parsePhaseDay(phase.days);

                        let isCompleted = false;
                        let isCurrent = false;

                        if (dayRange) {
                            // Phase has a range (e.g., Day 1-15)
                            isCompleted = elapsedDays > dayRange.end;
                            isCurrent = elapsedDays >= dayRange.start && elapsedDays <= dayRange.end;
                        } else if (phaseDay) {
                            // Phase has single day (e.g., Day 30)
                            isCompleted = elapsedDays > phaseDay;
                            isCurrent = elapsedDays === phaseDay;
                        }

                        return (
                            <div key={idx} className="relative">
                                {/* Phase marker */}
                                <div className="absolute left-[3px] top-[16px] z-10">
                                    {isCompleted ? (
                                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                                            <CheckCircle className="h-5 w-5 text-white" />
                                        </div>
                                    ) : isCurrent ? (
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse shadow-md">
                                            <Clock className="h-5 w-5 text-white" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shadow-sm">
                                            <Circle className="h-5 w-5 text-gray-500" />
                                        </div>
                                    )}
                                </div>

                                <Card
                                    className={`ml-12 ${isCompleted
                                        ? "bg-green-50 border-green-200"
                                        : isCurrent
                                            ? "bg-blue-50 border-blue-200"
                                            : "bg-muted/30"
                                        }`}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold">{phase.phase}</h4>
                                                    {isCompleted && (
                                                        <span className="text-xs text-green-600 font-medium">
                                                            ✓ সম্পন্ন
                                                        </span>
                                                    )}
                                                    {isCurrent && (
                                                        <span className="text-xs text-blue-600 font-medium">
                                                            • চলমান
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    {phase.days}
                                                    {dayRange && (
                                                        <span className="ml-2">
                                                            (
                                                            {elapsedDays < dayRange.start
                                                                ? `${toBengaliNumber(dayRange.start - elapsedDays)} দিন বাকি`
                                                                : elapsedDays >= dayRange.start && elapsedDays <= dayRange.end
                                                                    ? elapsedDays === dayRange.start
                                                                        ? "আজ শুরু"
                                                                        : `${toBengaliNumber(dayRange.end - elapsedDays)} দিন বাকি`
                                                                    : `${toBengaliNumber(elapsedDays - dayRange.end)} দিন আগে`}
                                                            )
                                                        </span>
                                                    )}
                                                    {!dayRange && phaseDay && (
                                                        <span className="ml-2">
                                                            (
                                                            {elapsedDays < phaseDay
                                                                ? `${toBengaliNumber(phaseDay - elapsedDays)} দিন বাকি`
                                                                : elapsedDays === phaseDay
                                                                    ? "আজ"
                                                                    : `${toBengaliNumber(elapsedDays - phaseDay)} দিন আগে`}
                                                            )
                                                        </span>
                                                    )}
                                                </p>
                                                <ul className="text-sm space-y-1">
                                                    {phase.tasks?.map((task, taskIdx) => (
                                                        <li
                                                            key={taskIdx}
                                                            className={`flex items-start gap-2 ${isCompleted ? "text-green-700" : "text-muted-foreground"
                                                                }`}
                                                        >
                                                            <span className="text-primary mt-0.5">•</span>
                                                            <span>{task}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`ml-2 shrink-0 ${!isCurrent ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-100'}`}
                                                onClick={() => isCurrent && handleViewDetails(phase)}
                                                disabled={!isCurrent}
                                            >
                                                <Info className={`h-5 w-5 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{selectedPhase?.phase}</DialogTitle>
                        <DialogDescription>
                            {selectedPhase?.days}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 mt-4">
                        {/* Tasks */}
                        {selectedPhase?.tasks && selectedPhase.tasks.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2 text-sm">করণীয় কাজসমূহ:</h4>
                                <ul className="text-sm space-y-1.5 bg-muted/30 p-3 rounded-md">
                                    {selectedPhase.tasks.map((task, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-primary mt-0.5">•</span>
                                            <span>{task}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Fertilizers */}
                        {selectedPhase?.fertilizers && selectedPhase.fertilizers.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2 text-sm text-green-700 flex items-center gap-1.5">
                                    <Sprout className="h-4 w-4" />
                                    প্রয়োজনীয় সার:
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedPhase.fertilizers.map((fert, idx) => (
                                        <div key={idx} className="bg-green-50 p-2 rounded border border-green-100">
                                            <div className="font-medium text-green-900 text-sm">{fert.name}</div>
                                            <div className="text-xs text-green-700">{fert.amount}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Details */}
                        {selectedPhase?.details && (
                            <div>
                                <h4 className="font-semibold mb-2 text-sm">বিস্তারিত নির্দেশনা:</h4>
                                <p className="text-sm bg-blue-50 p-3 rounded-md text-muted-foreground">
                                    {selectedPhase.details}
                                </p>
                            </div>
                        )}

                        {/* Medicines */}
                        {selectedPhase?.medicines && selectedPhase.medicines.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2 text-sm text-orange-700 flex items-center gap-1.5">
                                    <Pill className="h-4 w-4" />
                                    প্রয়োজনীয় ঔষধ/কীটনাশক:
                                </h4>
                                <ul className="text-sm space-y-1.5 bg-orange-50 p-3 rounded-md border border-orange-100">
                                    {selectedPhase.medicines.map((medicine, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <Pill className="h-3.5 w-3.5 text-orange-600 mt-0.5 shrink-0" />
                                            <span className="text-orange-900">{medicine}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Advice */}
                        {selectedPhase?.advice && selectedPhase.advice.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2 text-sm text-green-700 flex items-center gap-1.5">
                                    <Lightbulb className="h-4 w-4" />
                                    বিশেষ পরামর্শ:
                                </h4>
                                <ul className="text-sm space-y-1.5 bg-green-50 p-3 rounded-md border border-green-100">
                                    {selectedPhase.advice.map((tip, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <Lightbulb className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                                            <span className="text-green-900">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CropTimeline;
