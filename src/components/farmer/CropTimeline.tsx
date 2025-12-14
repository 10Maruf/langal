import { CheckCircle, Circle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toBengaliNumber } from "@/services/weatherService";

interface TimelinePhase {
    phase: string;
    days: string;
    tasks: string[];
}

interface CropTimelineProps {
    cultivationPlan: TimelinePhase[];
    elapsedDays: number;
}

const CropTimeline = ({ cultivationPlan, elapsedDays }: CropTimelineProps) => {
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
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CropTimeline;
