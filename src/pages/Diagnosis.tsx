import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mic, Camera, Upload, Stethoscope, ArrowLeft } from "lucide-react";
import { diagnose, Disease } from "@/services/diagnosisService";
import { useToast } from "@/hooks/use-toast";

// Types now sourced from diagnosisService

const Diagnosis = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [crop, setCrop] = useState("");
  const [customCropName, setCustomCropName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState("acre");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Disease[]>([]);
  const [error, setError] = useState<string | null>(null);

  const crops = [
    { value: "rice", label: "ধান" },
    { value: "wheat", label: "গম" },
    { value: "corn", label: "ভুট্টা" },
    { value: "tomato", label: "টমেটো" },
    { value: "potato", label: "আলু" },
    { value: "eggplant", label: "বেগুন" },
    { value: "cucumber", label: "শসা" },
    { value: "cabbage", label: "বাঁধাকপি" },
    { value: "others", label: "অন্যান্য" }
  ];

  // Removed mockDiseases; now using Gemini API response

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleVoiceInput = () => {
    type ISpeechRecognitionEvent = { results: ArrayLike<{ 0: { transcript: string } }> };
    interface ISpeechRecognition {
      lang: string;
      onresult: (event: ISpeechRecognitionEvent) => void;
      start: () => void;
    }

    const w = window as unknown as {
      webkitSpeechRecognition?: new () => ISpeechRecognition;
      SpeechRecognition?: new () => ISpeechRecognition;
    };

    if (w.webkitSpeechRecognition || w.SpeechRecognition) {
      const SRCtor = (w.webkitSpeechRecognition || w.SpeechRecognition)!;
      const recognition = new SRCtor();

      recognition.lang = 'bn-BD';
      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.start();
    } else {
      toast({
        title: "সাপোর্ট নেই",
        description: "আপনার ব্রাউজার ভয়েস ইনপুট সাপোর্ট করে না।",
        variant: "destructive"
      });
    }
  };

  const handleCropNameVoiceInput = () => {
    type ISpeechRecognitionEvent = { results: ArrayLike<{ 0: { transcript: string } }> };
    interface ISpeechRecognition {
      lang: string;
      onresult: (event: ISpeechRecognitionEvent) => void;
      start: () => void;
    }

    const w = window as unknown as {
      webkitSpeechRecognition?: new () => ISpeechRecognition;
      SpeechRecognition?: new () => ISpeechRecognition;
    };

    if (w.webkitSpeechRecognition || w.SpeechRecognition) {
      const SRCtor = (w.webkitSpeechRecognition || w.SpeechRecognition)!;
      const recognition = new SRCtor();

      recognition.lang = 'bn-BD';
      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setCustomCropName(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.start();
    } else {
      toast({
        title: "সাপোর্ট নেই",
        description: "আপনার ব্রাউজার ভয়েস ইনপুট সাপোর্ট করে না।",
        variant: "destructive"
      });
    }
  };

  const handleDiagnosis = async () => {
    const finalCropName = crop === "others" ? customCropName : crop;

    if (!finalCropName || (!symptoms && !image)) {
      toast({
        title: "তথ্য প্রয়োজন",
        description: crop === "others"
          ? "ফসলের নাম লিখুন এবং লক্ষণ বা ছবি দিন।"
          : "ফসল নির্বাচন করুন এবং লক্ষণ বা ছবি দিন।",
        variant: "destructive"
      });
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    try {
      const diseases = await diagnose({ crop: finalCropName, symptoms, imageFile: image });
      setResults(diseases);
      toast({
        title: "বিশ্লেষণ সম্পূর্ণ",
        description: `${diseases.length} টি সম্ভাব্য রোগ পাওয়া গেছে।`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "ত্রুটি হয়েছে";
      setError(msg);
      setResults([]);
      toast({
        title: "বিশ্লেষণ ব্যর্থ",
        description: msg,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateTotalCost = () => {
    if (!results.length || !area) return 0;
    const areaInAcre = unit === "acre" ? parseFloat(area) :
      unit === "bigha" ? parseFloat(area) * 0.33 :
        parseFloat(area) / 100;
    // Prefer chemicals aggregate from first disease if cost looks 0
    const first = results[0];
    let baseCost = first?.cost || 0;
    if ((!baseCost || baseCost === 0) && first?.chemicals?.length) {
      baseCost = first.chemicals.reduce((sum, c) => sum + c.dosePerAcre * c.pricePerUnit, 0);
    }
    return Math.round(baseCost * areaInAcre);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-4 pb-20 space-y-4 pt-20">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="p-2 mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Stethoscope className="h-5 w-5 text-primary" />
              ফসলের রোগ নির্ণয়
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">রোগের তথ্য দিন</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Crop Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">ফসলের নাম</label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="ফসল নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Crop Name Input - shown only when "Others" is selected */}
            {crop === "others" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">ফসলের নাম লিখুন</label>
                <Input
                  placeholder="ফসলের নাম লিখুন..."
                  value={customCropName}
                  onChange={(e) => setCustomCropName(e.target.value)}
                  className="mb-2"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCropNameVoiceInput}
                  className="w-full"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  ভয়েস দিয়ে বলুন
                </Button>
              </div>
            )}

            {/* Symptoms Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">লক্ষণ বর্ণনা</label>
              <Textarea
                placeholder="পাতায় দাগ, রং পরিবর্তন, শুকিয়ে যাওয়া ইত্যাদি লিখুন..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-[80px]"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceInput}
                className="w-full"
              >
                <Mic className="h-4 w-4 mr-2" />
                ভয়েস দিয়ে বলুন
              </Button>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">রোগাক্রান্ত অংশের ছবি</label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                {image ? (
                  <div className="space-y-2">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Uploaded"
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setImage(null)}
                    >
                      ছবি পরিবর্তন করুন
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      ছবি আপলোড করুন বা ক্যামেরা ব্যবহার করুন
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm" asChild>
                        <label className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-1" />
                          ফাইল নির্বাচন
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <label className="cursor-pointer">
                          <Camera className="h-4 w-4 mr-1" />
                          ক্যামেরা
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Area Input */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">জমির পরিমাণ</label>
                <Input
                  type="number"
                  placeholder="যেমন: 1.5"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">একক</label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acre">একর</SelectItem>
                    <SelectItem value="bigha">বিঘা</SelectItem>
                    <SelectItem value="decimal">ডেসিমেল</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleDiagnosis}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? "বিশ্লেষণ করা হচ্ছে..." : "রোগ নির্ণয় করুন"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ত্রুটি</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600">{error}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={handleDiagnosis} disabled={isAnalyzing}>পুনরায় চেষ্টা করুন</Button>
            </CardContent>
          </Card>
        )}
        {results.length > 0 && !error && (
          <>
            {/* Disease List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">সম্ভাব্য রোগসমূহ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.map((disease, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{disease.name}</h3>
                      <Badge variant={disease.probability > 70 ? "destructive" : "secondary"}>
                        {disease.probability}% সম্ভাবনা
                      </Badge>
                    </div>

                    {disease.type && (
                      <Badge variant="outline">{disease.type}</Badge>
                    )}

                    <p className="text-sm text-muted-foreground">
                      <strong>চিকিৎসা:</strong> {disease.treatment}
                    </p>

                    {disease.guideline && (
                      <div className="space-y-1">
                        <strong className="text-sm">নির্দেশনা:</strong>
                        <ul className="text-sm space-y-1 ml-4">
                          {disease.guideline.map((guide, idx) => (
                            <li key={idx}>• {guide}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {disease.chemicals && area && (
                      <div className="space-y-2">
                        <strong className="text-sm">প্রস্তাবিত ঔষধ:</strong>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs border-collapse border border-border">
                            <thead>
                              <tr className="bg-muted">
                                <th className="border border-border p-2 text-left">ঔষধ</th>
                                <th className="border border-border p-2 text-left">পরিমাণ</th>
                                <th className="border border-border p-2 text-left">খরচ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {disease.chemicals.map((chem, idx) => {
                                const areaInAcre = unit === "acre" ? parseFloat(area) :
                                  unit === "bigha" ? parseFloat(area) * 0.33 :
                                    parseFloat(area) / 100;
                                const qty = chem.dosePerAcre * areaInAcre;
                                const cost = qty * chem.pricePerUnit;

                                return (
                                  <tr key={idx}>
                                    <td className="border border-border p-2">{chem.name}</td>
                                    <td className="border border-border p-2">{qty.toFixed(2)} {chem.unit}</td>
                                    <td className="border border-border p-2">৳{cost.toLocaleString('bn-BD')}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {disease.videos && disease.videos.length > 0 && (
                      <div className="space-y-1">
                        <strong className="text-sm">ভিডিও গাইড:</strong>
                        {disease.videos.map((video, idx) => (
                          <a key={idx} href={video} target="_blank" rel="noopener noreferrer"
                            className="block text-xs text-blue-600 hover:underline break-all">
                            {video}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Cost Calculation */}
            {area && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">আনুমানিক খরচ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        {area} {unit === "acre" ? "একর" : unit === "bigha" ? "বিঘা" : "ডেসিমেল"} জমির জন্য
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        ৳{calculateTotalCost().toLocaleString('bn-BD')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        প্রাথমিক চিকিৎসার জন্য
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Expert Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">বিশেষজ্ঞ সহায়তা</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>কৃষি কল সেন্টার:</strong> ১৬১২৩
                  </p>
                  <p>
                    <strong>উপজেলা কৃষি অফিস:</strong> ৩৩৩
                  </p>
                  <p className="text-muted-foreground">
                    জরুরি প্রয়োজনে স্থানীয় কৃষি সম্প্রসারণ কর্মকর্তার সাথে যোগাযোগ করুন।
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Diagnosis;