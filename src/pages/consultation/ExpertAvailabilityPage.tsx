import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  Plus,
  Trash2,
  Save,
  Loader2,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import {
  getMyAvailability,
  setAvailability,
  AvailabilitySlot,
} from "@/services/consultationService";

interface DaySchedule {
  day: number;
  dayName: string;
  enabled: boolean;
  slots: { start_time: string; end_time: string; slot_duration: number }[];
}

const ExpertAvailabilityPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 0, dayName: "রবিবার", enabled: false, slots: [] },
    { day: 1, dayName: "সোমবার", enabled: false, slots: [] },
    { day: 2, dayName: "মঙ্গলবার", enabled: false, slots: [] },
    { day: 3, dayName: "বুধবার", enabled: false, slots: [] },
    { day: 4, dayName: "বৃহস্পতিবার", enabled: false, slots: [] },
    { day: 5, dayName: "শুক্রবার", enabled: false, slots: [] },
    { day: 6, dayName: "শনিবার", enabled: false, slots: [] },
  ]);

  useEffect(() => {
    fetchAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await getMyAvailability();
      if (response.success && response.data) {
        const existingSlots = response.data as AvailabilitySlot[];

        // Map existing slots to schedule
        const newSchedule = schedule.map((day) => {
          const daySlots = existingSlots.filter((slot) => slot.day_of_week === day.day);
          return {
            ...day,
            enabled: daySlots.length > 0,
            slots: daySlots.map((slot) => ({
              start_time: slot.start_time,
              end_time: slot.end_time,
              slot_duration: slot.slot_duration || 30,
            })),
          };
        });
        setSchedule(newSchedule);
      }
    } catch (err) {
      console.error("Error fetching availability:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].enabled = !newSchedule[dayIndex].enabled;
    if (newSchedule[dayIndex].enabled && newSchedule[dayIndex].slots.length === 0) {
      // Add default slot
      newSchedule[dayIndex].slots = [
        { start_time: "09:00", end_time: "17:00", slot_duration: 30 },
      ];
    }
    setSchedule(newSchedule);
  };

  const addSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    const lastSlot = newSchedule[dayIndex].slots[newSchedule[dayIndex].slots.length - 1];
    const newStartTime = lastSlot?.end_time || "09:00";
    newSchedule[dayIndex].slots.push({
      start_time: newStartTime,
      end_time: incrementTime(newStartTime, 4),
      slot_duration: 30,
    });
    setSchedule(newSchedule);
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots.splice(slotIndex, 1);
    if (newSchedule[dayIndex].slots.length === 0) {
      newSchedule[dayIndex].enabled = false;
    }
    setSchedule(newSchedule);
  };

  const updateSlot = (
    dayIndex: number,
    slotIndex: number,
    field: "start_time" | "end_time" | "slot_duration",
    value: string | number
  ) => {
    const newSchedule = [...schedule];
    if (field === "slot_duration") {
      newSchedule[dayIndex].slots[slotIndex][field] = value as number;
    } else {
      newSchedule[dayIndex].slots[slotIndex][field] = value as string;
    }
    setSchedule(newSchedule);
  };

  const incrementTime = (time: string, hours: number): string => {
    const [h, m] = time.split(":").map(Number);
    const newHour = Math.min(h + hours, 23);
    return `${newHour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare slots data
      const slots: Array<{
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration: number;
        is_available: boolean;
      }> = [];
      schedule.forEach((day) => {
        if (day.enabled) {
          day.slots.forEach((slot) => {
            slots.push({
              day_of_week: day.day,
              start_time: slot.start_time,
              end_time: slot.end_time,
              slot_duration: slot.slot_duration,
              is_available: true,
            });
          });
        }
      });

      const response = await setAvailability({ slots });

      if (response.success) {
        toast({
          title: "সফল!",
          description: "সময়সূচী সেভ করা হয়েছে",
        });
      } else {
        toast({
          title: "ত্রুটি",
          description: response.message || "সেভ করতে ব্যর্থ হয়েছে",
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
      setSaving(false);
    }
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
    <div className="min-h-screen bg-gray-50 pb-24">
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
          <h1 className="text-base font-semibold text-gray-900">সময়সূচী সেট করুন</h1>
          <p className="text-xs text-gray-500">আপনার সাপ্তাহিক উপলব্ধতা নির্ধারণ করুন</p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  এখানে আপনার সাপ্তাহিক সময়সূচী সেট করুন। কৃষকরা এই সময়ে আপনার সাথে পরামর্শের জন্য বুকিং করতে পারবেন।
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Cards */}
        {schedule.map((day, dayIndex) => (
          <Card key={day.day} className={day.enabled ? "border-green-200" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className={`h-4 w-4 ${day.enabled ? "text-green-600" : "text-gray-400"}`} />
                  {day.dayName}
                </CardTitle>
                <Switch
                  checked={day.enabled}
                  onCheckedChange={() => toggleDay(dayIndex)}
                />
              </div>
            </CardHeader>

            {day.enabled && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {day.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-2">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-gray-500">শুরু</Label>
                          <Input
                            type="time"
                            value={slot.start_time}
                            onChange={(e) =>
                              updateSlot(dayIndex, slotIndex, "start_time", e.target.value)
                            }
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">শেষ</Label>
                          <Input
                            type="time"
                            value={slot.end_time}
                            onChange={(e) =>
                              updateSlot(dayIndex, slotIndex, "end_time", e.target.value)
                            }
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div className="w-20">
                        <Label className="text-xs text-gray-500">স্লট (মি.)</Label>
                        <select
                          value={slot.slot_duration}
                          onChange={(e) =>
                            updateSlot(dayIndex, slotIndex, "slot_duration", parseInt(e.target.value))
                          }
                          className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
                        >
                          <option value={15}>১৫</option>
                          <option value={30}>৩০</option>
                          <option value={45}>৪৫</option>
                          <option value={60}>৬০</option>
                        </select>
                      </div>
                      {day.slots.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 mt-5"
                          onClick={() => removeSlot(dayIndex, slotIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => addSlot(dayIndex)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    আরও সময় যোগ করুন
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Fixed Bottom Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <Button
          className="w-full bg-green-600 hover:bg-green-700 h-12 rounded-xl text-lg"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              সেভ হচ্ছে...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              সময়সূচী সেভ করুন
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExpertAvailabilityPage;
