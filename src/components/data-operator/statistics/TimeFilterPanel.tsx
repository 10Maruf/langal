import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, FilterX } from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { cn } from "@/lib/utils";

export interface TimeFilter {
    periodType: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
    selectedDate?: Date;
    selectedMonth?: string;
    selectedYear?: string;
    customStartDate?: Date;
    customEndDate?: Date;
}

interface TimeFilterPanelProps {
    filter: TimeFilter;
    onChange: (filter: TimeFilter) => void;
}

const TimeFilterPanel = ({ filter, onChange }: TimeFilterPanelProps) => {
    
    // Bengali months
    const months = [
        { value: "01", label: "জানুয়ারি" },
        { value: "02", label: "ফেব্রুয়ারি" },
        { value: "03", label: "মার্চ" },
        { value: "04", label: "এপ্রিল" },
        { value: "05", label: "মে" },
        { value: "06", label: "জুন" },
        { value: "07", label: "জুলাই" },
        { value: "08", label: "আগস্ট" },
        { value: "09", label: "সেপ্টেম্বর" },
        { value: "10", label: "অক্টোবর" },
        { value: "11", label: "নভেম্বর" },
        { value: "12", label: "ডিসেম্বর" },
    ];

    // Recent years
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => convertEnglishToBangla((currentYear - i).toString()));

    function convertEnglishToBangla(str: string) {
        return str.replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
    }

    const handleTypeChange = (value: string) => {
        onChange({
            ...filter,
            periodType: value as any
        });
    };

    return (
        <Card className="mb-6 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    
                    {/* Icon & Label */}
                    <div className="flex items-center gap-2 min-w-[150px]">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <Clock className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">সময়কাল</h3>
                            <p className="text-xs text-gray-500">রিপোর্টের সময়সীমা</p>
                        </div>
                    </div>

                    {/* Filter Controls */}
                    <div className="flex-1 flex flex-wrap gap-3 items-center">
                        
                        {/* Period Type Buttons */}
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            {[
                                { id: 'daily', label: 'দৈনিক' },
                                { id: 'weekly', label: 'সাপ্তাহিক' },
                                { id: 'monthly', label: 'মাসিক' },
                                { id: 'yearly', label: 'বাৎসরিক' },
                                { id: 'custom', label: 'কাস্টম' },
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleTypeChange(type.id)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                        filter.periodType === type.id
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                                    )}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {/* Dynamic Inputs based on Type */}
                        <div className="flex items-center gap-2">
                            {/* Daily / Weekly Selector */}
                            {(filter.periodType === 'daily' || filter.periodType === 'weekly') && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !filter.selectedDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {filter.selectedDate ? (
                                                format(filter.selectedDate, "PPP", { locale: bn })
                                            ) : (
                                                <span>তারিখ নির্বাচন করুন</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={filter.selectedDate}
                                            onSelect={(date) => onChange({ ...filter, selectedDate: date })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}

                            {/* Monthly Selector */}
                            {filter.periodType === 'monthly' && (
                                <div className="flex gap-2">
                                    <Select 
                                        value={filter.selectedMonth} 
                                        onValueChange={(v) => onChange({ ...filter, selectedMonth: v })}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="মাস" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((month) => (
                                                <SelectItem key={month.value} value={month.value}>
                                                    {month.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select 
                                        value={filter.selectedYear} 
                                        onValueChange={(v) => onChange({ ...filter, selectedYear: v })}
                                    >
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="বছর" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {years.map((year) => (
                                                <SelectItem key={year} value={year}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Yearly Selector */}
                            {filter.periodType === 'yearly' && (
                                <Select 
                                    value={filter.selectedYear} 
                                    onValueChange={(v) => onChange({ ...filter, selectedYear: v })}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="বছর নির্বাচন করুন" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            {/* Custom Range Selector */}
                            {filter.periodType === 'custom' && (
                                <div className="flex items-center gap-2">
                                     <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[160px] justify-start text-left font-normal",
                                                    !filter.customStartDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {filter.customStartDate ? (
                                                    format(filter.customStartDate, "P", { locale: bn })
                                                ) : (
                                                    <span>শুরুর তারিখ</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={filter.customStartDate}
                                                onSelect={(date) => onChange({ ...filter, customStartDate: date })}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <span className="text-gray-400">-</span>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[160px] justify-start text-left font-normal",
                                                    !filter.customEndDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {filter.customEndDate ? (
                                                    format(filter.customEndDate, "P", { locale: bn })
                                                ) : (
                                                    <span>শেষের তারিখ</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={filter.customEndDate}
                                                onSelect={(date) => onChange({ ...filter, customEndDate: date })}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TimeFilterPanel;